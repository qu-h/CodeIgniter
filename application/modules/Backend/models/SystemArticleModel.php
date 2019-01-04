<?php if (!defined('BASEPATH')) exit('No direct script core allowed');

class SystemArticleModel extends MX_Model
{
    var $table = 'article';
    var $table_tags = 'article_tags';
    var $fields = array(
        'id' => array(
            'type' => 'hidden'
        ),
        'imgthumb' => array(
            'type' => 'file',
            "value" => null
        ),
        'title' => array(
            'label' => 'Article Name',
            'desc' => null,
            'icon' => 'send'
        ),
        'alias' => array(
            'label' => 'Article Alias',
            'required' => true,
            'desc' => null,
            'icon' => 'link'
        ),
        'category' => array(
            'type' => 'select_category',
            'icon' => 'list',
            'category-type' => 'article'
        ),
        'source' => array(
            'type' => 'crawler_link',
            'icon' => 'globe'
        ),
        'summary' => array(
            'type' => 'textarea',
            'editor' => 'form-control'
        ),
        'content' => array(
            'type' => 'textarea'
        ),
        'status' => ['type' => 'publish', 'value' => 1],
        'ordering' => ['type' => 'number', 'icon' => 'sort-numeric-desc'],
        'tags' => ['type' => 'tags']
    );

    var $page_limit = 10;

    function __construct()
    {
        parent::__construct();
    }

    function fields()
    {
        return $this->fields;
    }

    function get_item_by_id($id = 0)
    {

        $row = $this->db->where('id', $id)->get($this->table)->row();

        if (!is_null($row) && isset($row->id)) {
            $row->tags = $this->getTags($row->id);
        }
        return $row;
    }

    function get_item_by_alias($alias = 0, $cateogry_id = 0, $status = 1)
    {
        $this->db->where("alias", $alias);

        if ($cateogry_id != null) {
            $this->db->where("category", $cateogry_id);
        }

        if (is_numeric($status)) {
            $this->db->where("status", $status);
        }
        $query = $this->db->get($this->table);
        return $query->row_array();
    }

    function update($data = NULL)
    {
        if (!isset($data['alias']) OR strlen($data['alias']) < 1) {
            if (strlen($data['title']) > 0) {
                $data['alias'] = url_title($data['title'], '-', true);
            } else {
                set_error('Please enter alias');
                return false;
            }
        }

        if (!isset($data['id']) || strlen($data['id']) < 1) {
            $data['id'] = 0;
        }
        if (!isset($data['ordering']) || strlen($data['ordering']) < 1) {
            $data['ordering'] = 0;
        }

        if (is_null($data['category']) || strlen($data['category']) < 1) {
            $data['category'] = 0;
        }
        $data['status'] = $data['status'] == 'on' ? true : false;
        $tags = $data['tags'];
        unset($data['tags']);
        $exist = $this->check_exist($data['alias'], $data['id'], $data['category']);

        if ($exist) {
            $link = anchor(url_to_edit(null, $exist->id), $exist->title);
            set_error('Dupplicate Article ' . $link . ' ');
            return false;
        } elseif (intval($data['id']) > 0) {
            $data['modified'] = date("Y-m-d H:i:s");
            $id = $data['id'];
            unset($data['id']);
            $this->db->where('id', $id)->update($this->table, $data);
        } else {
            $this->db->insert($this->table, $data);
            $id = $this->db->insert_id();
        }

        if (!$id) {
            bug($this->db->last_query());
        }
        if (is_array($tags) && !empty($tags)) {
            $this->updateTags($id, $tags);
        }

        return $id;
    }

    function check_exist($alias, $id, $category = 0)
    {
        if (!is_numeric($category)) {
            $category = 0;
        }
        if (!is_numeric($id)) {
            $id = 0;
        }
        $this->db->where('alias', $alias)
            ->where("category = $category")
            ->where('id <>', $id);
        $result = $this->db->get($this->table);
        if (!$result) {
            bug($this->db->last_query());
            die;
        }

        return ($result->num_rows() > 0) ? $result->row() : false;
    }

    /*
     * Json return for Datatable
     */
    function items_json($category_id = null, $actions_allow = NULL)
    {
        $this->db->select('a.id,a.title,a.alias, a.source, a.imgthumb, a.status, a.ordering');
        $this->db->join("category AS c", 'c.id=a.category', 'LEFT')->select('c.name AS category_name,a.category AS category_id');

        $this->db->select("(SELECT GROUP_CONCAT(tag.keyword_id) FROM article_tags AS tag WHERE tag.article_id = a.id) AS tag_ids", FALSE);
        $this->db->select("(SELECT GROUP_CONCAT(k.word) FROM keywords AS k LEFT JOIN article_tags AS tag ON k.id = tag.keyword_id WHERE tag.article_id = a.id) AS tag_names", FALSE);

        if ($category_id !== null) {
            $this->db->where("a.category", $category_id);
        }
        $this->db->where("(a.status <> -1 OR a.status IS NULL)");
        $this->db->from($this->table . " AS a");

        if ($this->search) {
            $this->db->like('LOWER(a.title)', strtolower($this->search));
        }

        if ($this->orders) {
            foreach ($this->orders AS $o) {
                $this->db->order_by("a." . $o[0], $o[1]);
            }
        } else {
            $this->db->order_by('id DESC');
        }
        return $this->dataTableJson();
    }

    function get_items_latest()
    {
        $this->db->select('id,title,summary ,category,source');
        $this->db->order_by('id DESC');
        $query = $this->db->limit($this->page_limit)->get($this->table);
        return $query->result();
    }

    public function item_delete($id = 0)
    {
        $this->db->where('id', $id)->update($this->table, ['status' => -1]);
    }

    public function getAll($category_id = 0, $return_array = false, $limit = 10)
    {
        $this->db->select("a.title, a.imgthumb, a.alias, a.summary");
        $this->db->select("a.category AS category_id");
        $this->db->where('a.status', 1)->from($this->table . " AS a");
        $this->db->join("category AS c", 'c.id = a.category', 'LEFT')
            ->select("c.alias AS category_alias");
        $this->db->where("a.category", $category_id);
        $this->db->order_by("a.ordering ASC");
        if ($limit > 0) {
            $this->db->limit($limit);
        }
        $query = $this->db->get();
        return $return_array ? $query->result_array() : $query->result();
    }

    private function updateTags($article_id = 0, $tags = [])
    {
        $tagsMapping = $this->db->where('article_id', $article_id)->select("keyword_id")->get($this->table_tags);
        $exist = [];
        if ($tagsMapping->num_rows() > 0) {
            foreach ($tagsMapping->result() AS $r) {
                $exist[] = $r->keyword_id;
            }
        }

        $available = [];
        foreach ($tags AS $k) {
            if (!in_array($k, $exist)) {
                $this->db->insert($this->table_tags, ['article_id' => $article_id, 'keyword_id' => $k]);
                $available[] = $k;
            }
        }
        $this->db->where('article_id', $article_id)->where_not_in('keyword_id', $tags)->delete($this->table_tags);
    }

    private function getTags($article_id = 0)
    {
        $tagsMapping = $this->db->where('article_id', $article_id)->select("keyword_id")->get($this->table_tags);
        $exist = [];
        if ($tagsMapping->num_rows() > 0) {
            foreach ($tagsMapping->result() AS $r) {
                $exist[] = $r->keyword_id;
            }
        }
        return $exist;
    }
}
