<?php
class SmartAdminButton extends CI_Smarty {

    /**
     * @param array $params
     * @return string
     */
    static function btn($params=[]){
        $label = array_key_exists('txt',$params) ? $params['txt'] : 'Submit';
        $label = lang($label);
        $attr = [
            'class'=>['btn'],
            'type'=>'submit',
            'name'=>'submit',
            'value'=>1
        ];

        if ( array_key_exists('type',$params) ){
            $attr['class'][] = "btn-".$params['type'];
        }
        if ( array_key_exists('name',$params) ){
            $attr['name'] = "btn-".$params['name'];
        }

        if ( array_key_exists('icon',$params) ){
            $icon = $params['icon'];
            $iconClass = '';
            if (preg_match('#^glyphicon-#i', $icon) === 1) {
                $iconClass = "glyphicon $icon";
            } else if(preg_match('#^fa-#i', $icon) === 1)  {
                $iconClass = "fa $icon";
            }
            if( strlen($iconClass) > 0 ){
                $label = '<span class="btn-label"><i class="'.$iconClass.'"></i></span>&nbsp;&nbsp;'.$label;
                $attr['class'][] = "btn-labeled";
            }
        }
        $html = '<button '._stringify_attributes($attr).'>'.($label).'</button>';
        return $html;
    }
    static function btnSubmit($params=[]){
        $params['txt'] = 'Submit';
        $params['icon'] = 'fa-retweet';
        $params['type'] = "primary";

        return self::btn($params);
    }

    static function btnSave($params=[]){
        $params['txt'] = 'Save';
        $params['icon'] = 'fa-save';
        $params['type'] = "success";

        return self::btn($params);
    }

    static function btnCancel($params=[]){
        $params['txt'] = 'cancel';
        $params['icon'] = 'glyphicon-trash';
        $params['type'] = "cancel";

        return self::btn($params);
    }

    static function btnCrawler(){
        $params['txt'] = 'Crawler';
        $params['icon'] = 'fa-bug';
        $params['type'] = "default";
        $params['name'] = 'crawler';
        return self::btn($params);
    }

    static function backendButtons(){
        $btn = self::btnCancel();
        $btn.= self::btnSubmit();
        $btn.= self::btnSave();

        return $btn;
    }
}