<?php if (!defined('BASEPATH')) exit('No direct script coess allowed');

class BaseCategoryMapModel extends MX_Model
{

    var $table = 'category_map';
    function __construct()
    {
        parent::__construct();
    }

    public function update($target_id, $target_table, $categories = [],$alias=null)
    {
        $where = ['target_id' => $target_id, 'target_table' => $target_table];
        if( strlen($alias)>0 ){
            $where['alias'] = $alias;
        }
        $query = $this->db->where($where)->get($this->table);

        if ($query->num_rows() < 1 && !empty($categories)) {
            foreach ($categories AS $cate) {
                if( strlen($cate) > 0 && is_numeric($cate) ){
                    $where['category_id'] = $cate;
                    $this->db->insert("category_map", $where);
                }
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
                    if( strlen($cate) > 0 && is_numeric($cate) ){
                        $where['category_id'] = $cate;
                        $this->db->insert($this->table, $where);
                    }
                }
            }
        }
    }

    public function getCategories($target_id,$target_table='article',$alias=''){
        $data = [];
        $where = ['target_id' => $target_id, 'target_table' => $target_table];
        if( strlen($alias)>0 ){
            $where['alias'] = $alias;
        }
        $query = $this->db->where($where)->get($this->table);
        if( $query->num_rows() > 0 ) foreach ($query->result() AS $cate){
            $data[] = $cate->category_id;
        }
        return $data;
    }

    public function GetRowMapping($target_id,$target_table='article',$alias=''){
        $where = ['target_id' => $target_id, 'target_table' => $target_table];
        if( strlen($alias)>0 ){
            $where['alias'] = $alias;
        }
        $query = $this->db->where($where)->limit(1)->get($this->table);
        if( $query->num_rows() > 0 ) {
            $row = $query->row();
//            dd($row);
            $map_data =$this->row_get($row->category_id,"category");

            $row->mapping_value = $map_data->name;
            $row->mapping_id = $map_data->id;


            return $row;
        }
        return [];
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

    public function LinkIDConcat($link_id_to='id',$target_alias='',$target_table="category",$tb_alias='m'){
        $sql = "SELECT GROUP_CONCAT($tb_alias.category_id) FROM category_map AS $tb_alias WHERE $tb_alias.target_id = $link_id_to AND m.target_table = '$target_table' ";
        if ( strlen($target_alias) > 0){
            $sql .= " AND m.alias = '$target_alias' ";
        }
        return $sql;
    }

    public function LinkNameConcat($link_id_to='id',$target_alias='',$target_table="category",$tb_alias='cate'){
        $sql = "SELECT GROUP_CONCAT($tb_alias.name) FROM category AS $tb_alias ";
        $sql.= "LEFT JOIN category_map AS m ON m.category_id = $tb_alias.id WHERE m.target_id = $link_id_to AND m.target_table = '$target_table' ";

        if ( strlen($target_alias) > 0){
            $sql .= " AND m.alias = '$target_alias' ";
        }
        return $sql;
    }

    public function LinkCount($link_id_from='id',$target_alias='',$target_table="category",$tb_alias='m'){
        $sql = "SELECT COUNT($tb_alias.category_id) FROM category_map AS $tb_alias WHERE $tb_alias.category_id = $link_id_from AND m.target_table = '$target_table' ";
        if ( strlen($target_alias) > 0){
            $sql .= " AND m.alias = '$target_alias' ";
        }
        return $sql;
    }
}