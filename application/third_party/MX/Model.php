<?php

/**
 * Class MX_Model
 * @property CI_DB_query_builder $db
 * @property CI_Loader $load
 */
class MX_Model extends CI_Model
{
    public $limit = 50, $page = 1;
    public $table = NULL;
    var $search, $orders = [];
    var $tableFields, $fields = [];

    public function __construct()
    {
        parent::__construct();
        $ci = get_instance();
        $this->load->database();
        $this->draw = input_get('draw');

        if ($ci->uri->extension == 'json') {
            $length = input_get('length');
            $ci->session->set_userdata('page_length', $length);
            $start = input_get('start');
            $ci->session->set_userdata('page_start', $start);
            $order = input_get('order');
            $ci->session->set_userdata('page_order', $order);
        }
        if (($limit = $ci->session->userdata('page_length')) != null) {
            $this->limit = $limit;
        }

        $this->offset = $ci->session->userdata('page_start');


        $search = input_get('search');
        if ($search) {
            $this->search = $search['value'];
        }

        $columns = input_get('columns');
        if (is_array($columns) && !empty($columns)) {
            foreach ($columns AS $f) {
                $this->tableFields[] = $f['data'];
            }
            $order = input_get('order');
            if ($order) {
                foreach ($order AS $o) {
                    $this->orders[] = [$this->tableFields[$o['column']], $o['dir']];
                }
            }

        }
    }

    public function fields(){
        return $this->fields;
    }

    function row_get($id = 0, $table = null)
    {
        if (strlen($table) < 0) {
            $table = $this->table;
        }

        $row = $this->db->from($table)->where("id", $id)->limit(1)->get()->row();
        return $row;
    }

    function items_json($fields=[])
    {
        if( !$this->table ){
            return [];
        }
        foreach ($fields AS $i=>$k){
            if( !array_key_exists($k,$this->fields) ){
                unset($fields[$i]);
            }
        }

        $this->db->from($this->table)->select(implode(',',$fields));

        if ($this->search) {
            foreach ($fields AS $field){
                $this->db->like($field, $this->search);
            }
        }

        if ($this->orders) {
            foreach ($this->orders AS $o) {
                $this->db->order_by($o[0], $o[1]);
            }
        } else {
            $this->db->order_by('id DESC');
        }
        return $this->dataTableJson();
    }

    function dataTableJson($db = null)
    {
        if (is_null($db)) {
            $db = $this->db;
        }
        $tempDb = clone $db;
        $num_rows = $tempDb->count_all_results();
        $query = $db->limit($this->limit, $this->offset)->get();
        $data = $query->result_array();
//        dd($this->db->last_query());
        return jsonData(array('data' => $data, 'draw' => $this->draw, 'recordsTotal' => $num_rows, 'recordsFiltered' => $num_rows));
    }

    protected function count_ajax(){
        $tempDb = clone $this->db;
        return $tempDb->count_all_results();
    }


    function pagination_get($page)
    {
        if (!$page || $page < 1) {
            $page = 1;
        }
        $ci = get_instance();
        $this->db->from($this->table);
        $db = $this->db;
        $tempdb = clone $db;

        $itemTotal = $tempdb->count_all_results();

        $query = $db->limit($this->limit, $this->limit * ($page - 1))->get();
        $data = $query->result_array();
//dd($db->last_query());
        $pageTotal = round($itemTotal / $this->limit, 0, PHP_ROUND_HALF_UP);

        set_temp_val("pagination", ['total' => $itemTotal, 'page_last' => $pageTotal, 'limit' => $this->limit, 'current' => $page]);
        return $data;
    }

    function isExist($where, $id = 0)
    {
        if (!is_numeric($id)) {
            $id = 0;
        }
        $this->db->where($where)->where('id <>', $id);
        $result = $this->db->get($this->table);
        if (!$result) {
            bug($this->db->last_query());
            die;
        }

        return $result->num_rows() > 0;
    }

    function checkTableExist($tableName, $file = null, $module = null)
    {
        if (!$this->db->table_exists($tableName)) {
            list($path, $file) = Modules::find($file, $module, null, true);
            if ($path) {
                if (!function_exists('read_file')) {
                    get_instance()->load->helper('file');
                }
                $data = read_file($path . $file);
                $sqls = preg_split('/;/', $data);
                if (count($sqls) > 0) foreach ($sqls AS $sql) {
                    $sql = trim($sql);
                    if (strlen($sql) > 0) {
                        $this->db->query($sql);
                    }

                }
            }
        }
    }

    public function updateRow($data,$id=0){
        if( array_key_exists('id',$data) ){
            $id = $data['id'];
        }

        if (!isset($data['id']) || strlen($data['id']) < 1) {
            $data['id'] = 0;
        }

        $this->db->from($this->table)->where('id',$id);

        if( $this->db->count_all_results() < 1 ){
            $this->db->insert($this->table, $data);
            $id = $this->db->insert_id();
            set_success('Success add new data.');
        } else {
            $this->db->where('id',$id)->update($this->table,$data);
            set_success('Success Update data.');
        }
        return $id;
    }


    /**
     * @param $params
     * @param null $value
     * @return $this
     */
    public function where($params, $value = NULL)
    {
        if (is_string($params)) {
            $this->db->where($params, $value);
        } elseif (is_array($params)) {
            $this->db->where($params);
        }
        return $this;
    }

    public function where_like($params, $value = NULL)
    {
        if (is_string($params)) {
            $this->db->like($params, $value);
        } elseif (is_array($params)) {
            $this->db->like($params);
        }
        return $this;
    }

    public function count()
    {
        $this->db->from($this->table);
        $query = $this->db->get();
        return $query->num_rows();
    }

    public function page($number = 1)
    {
        $this->db->limit($this->limit, $this->limit * ($number - 1));
        return $this;
    }

    /**
     * overwrite DB function
     */

    public function select($params = "*")
    {
        $this->db->select($params);
        return $this;
    }

    public function where_in($key = NULL, $values = NULL, $escape = NULL)
    {
        $this->db->where_in($key, $values, $escape);
        return $this;
    }

    public function not_like($field, $match = '', $side = 'both', $escape = NULL)
    {
        $this->db->not_like($field, $match, $side, $escape);
        return $this;
    }

    public function order_by($orderby, $direction = '', $escape = NULL)
    {
        $this->db->order_by($orderby, $direction, $escape);
        return $this;
    }

    public function limit($value, $offset = 0)
    {
        $this->db->limit($value, $offset);
        return $this;
    }

    public function get($where = NULL)
    {
        if (is_array($where)) {

        } else if (is_numeric($where)) {
            $this->db->where('id', $where);
        }
        $query = $this->db->get($this->table);
        return $query->result();
    }

    public function get_array()
    {
        $query = $this->db->get($this->table);
        return $query->result_array();
    }

    public function get_row()
    {
        $this->db->from($this->table);
        $query = $this->db->get();
        return $query->row();
    }

    public function row()
    {
        $this->db->from($this->table);
        $query = $this->db->get();
        return $query->row();
    }

    public function row_array()
    {
        $this->db->from($this->table);
        $query = $this->db->get();
        return $query->row_array();
    }

    public function findRow($id){
        $this->db->from($this->table)->where('id',$id);

        $tempDb = clone $this->db;

        if( $tempDb->count_all_results() > 0 ){
            return $this->db->get()->row();
        } else {
            return [];
        }
    }

}