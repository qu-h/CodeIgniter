<?php

class BaseArticleMarkdownModel extends MX_Model
{
    var $table = 'article_markdown';
    function __construct()
    {
        parent::__construct();
    }

    public function update($article_id,$content=null){
        $row = $this->where(['article_id'=>$article_id])->row();

        if( empty($row) ){
            $this->db->insert($this->table,['article_id'=>$article_id,'content'=>$content]);
            $id = $this->db->insert_id();
        } else {
            $this->db->where('id',$row->id)
                ->update($this->table,['article_id'=>$article_id,'content'=>$content]);
            $id = $row->id;
        }
        return $id;
    }

    public function __call($method,$arguments) {
        if( $method == 'getContent' ){
            $row = $this->db->where('article_id',$arguments[0])->get($this->table)->row();
            return !empty($row) ? $row->content : null;
        }

        if( strtolower(substr($method,0,3)) == 'get'){
            dd($method);
        }
    }
}