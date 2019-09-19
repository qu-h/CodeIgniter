<?php


class BaseImageModel extends MX_Model
{
    var $table = 'image';

    function __construct()
    {
        parent::__construct();
    }

    public function getImages($link_id,$link_table){
        $this->db->where(['link_id'=>$link_id,'link_table'=>$link_table]);
        $query = $this->db->get($this->table);

        return $query->num_rows() > 0 ? $query->result() : [];
    }

    public function getImage($link_id,$link_table){
        $images = $this->getImages($link_id,$link_table);
        return count($images) > 0 ? $images[0]->uri : null;
    }

}