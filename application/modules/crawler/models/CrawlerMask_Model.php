<?php if ( ! defined('BASEPATH')) exit('No direct script coess allowed');
class CrawlerMask_Model extends CI_Model
{
    var $ci;

    function __construct()
    {
        parent::__construct();
        $this->load->database();
    }

    var $table = 'crawler_mask';

    public function get_site($domain){
        $data = $this->db->where('domain',$domain)->get($this->table);
        // bug($data);
        // die("quannh");
        return $data->row();
    }
}