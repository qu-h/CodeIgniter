
<?php

class SmartadminMenu {
    static function menu_navigation($params)
    {
        if( !isset(get_instance()->db) ){
            return;
        }
        $db = get_instance()->db;
        $db->from('menus')
            ->where(['parent'=> 0,'status'=> 1,'backend'=>1]);
        $menus = $db->order_by('order ASC')->get();

        if( !$menus ){
            return NULL;
        }
        $html = '<ul>';
        if ($menus->num_rows() > 0)
            foreach ($menus->result() as $m1) {
                $label = '<span class="menu-item-parent">' . lang($m1->name) . '</span>';
                if (strlen($m1->icon) > 0) {
                    $label = '<i class="fa fa-lg fa-fw ' . $m1->icon . '"></i>' . $label;
                }

                $current_uri = uri_string();
                if(
                    strlen($m1->uri) > 0
                    AND substr($current_uri, 0, strlen($m1->uri)) == $m1->uri
                    //&& strpos($m1->uri, $current_uri) >=0
                ) {
                    $html .= '<li class="active" >';
                } else {
                    $html .= '<li>';
                }

                $submenus = $db->from('menus')
                    ->where(array(
                        'status' => 1,
                        'parent' => $m1->id
                    ))
                    ->order_by('order')
                    ->get();


                if ($submenus->num_rows() > 0) {
                    $html .= anchor(NULL, $label);
                    $html .= '<ul>';
                    foreach ($submenus->result() as $m2) {
                        if (strlen($m2->icon) > 0) {
                            $label = '<i class="fa fa-lg fa-fw ' . $m2->icon . '"></i>' . lang($m2->name);
                        } else {
                            $label = $m2->name;
                        }
                        $actived = NULL;
                        if(  $current_uri == $m2->uri
                            //|| strpos($m2->uri,$current_uri)>0
                            || substr($current_uri, 0, strlen($m2->uri)) == $m2->uri
                        ) {
                            $actived = 'class="active"';
                        }
                        $html .= "<li $actived>" . anchor($m2->uri, $label) . "</li>";


                    }
                    $html .= '</ul>';
                } else {
                    $html .= anchor($m1->uri, $label);
                }
                $html .= '</li>';
            }

        $html .= '</ul>';
        return $html;
    }
}