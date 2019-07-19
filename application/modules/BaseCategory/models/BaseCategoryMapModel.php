<?php if (!defined('BASEPATH')) exit('No direct script coess allowed');

class BaseCategoryMapModel extends MX_Model
{

    var $table = 'category_map';
    function __construct()
    {
        parent::__construct();
    }

    public function update($target_id, $target_table, $categories = [])
    {
        $where = ['target_id' => $target_id, 'target_table' => $target_table];

        $query = $this->db->where($where)->get($this->table);

        if ($query->num_rows() < 1 && !empty($categories)) {
            foreach ($categories AS $cate) {
                $where['category_id'] = $cate;
                $this->db->insert("category_map", $where);
            }
        } else {
            foreach ($query->result() AS $row) {
                if (in_array($row->category_id, $categories) != true) {
                    $this->db->where('id', $row->id)->delete($this->table);
                } else if (($key = array_search($row->category_id, $categories)) !== false) {
                    unset($categories[$key]);
                }
            }
            if (!empty($categories)) {
                foreach ($categories AS $cate) {
                    $where['category_id'] = $cate;
                    $this->db->insert($this->table, $where);
                }
            }
        }
    }

    public function getCategories($target_id,$target_table='article'){
        $data = [];
        $where = ['target_id' => $target_id, 'target_table' => $target_table];
        $query = $this->db->where($where)->get($this->table);
        if( $query->num_rows() > 0 ) foreach ($query->result() AS $cate){
            $data[] = $cate->category_id;
        }
        return $data;
    }

    public function getChildrens($id,$target_table='category'){
        $data = [];
        $where = ['category_id' => $id, 'target_table' => $target_table];
        $query = $this->db->where($where)->get($this->table);
        if( $query->num_rows() > 0 ) foreach ($query->result() AS $cate){
            $data[] = $cate->target_id;
        }
        return $data;
    }
}