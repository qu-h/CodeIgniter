<?php
class SmartadminSite_func extends CI_Smarty
{
    static function site_title_func($params = null)
    {
        $site_title = get_instance()->smarty->getTemplateVars('site_title');
        if( strlen($site_title) >0 ){
            return $site_title;
        }
    }

    static function site_description_func($params = null)
    {
    }

    static function site_author_func($params = null)
    {
    }
}