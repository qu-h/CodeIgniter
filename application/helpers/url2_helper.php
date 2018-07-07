<?php

function uri_extension(){

}

function url_to_edit($uri=null,$editId=0) {
    $editId = intval($editId);
    if( !$uri ){
        $uri = uri_string();
    }
    $ci = get_instance();
    $uri_length = $ci->uri->total_segments();
    $is_add = $ci->uri->rsegment($uri_length-1);

    if( $editId > 0 ){
        if( $is_add =='add' || $ci->uri->rsegment($uri_length) =='add' ){
            $uri = str_replace(["/add"],'/edit',$uri);
        } else if( $is_add != 'edit' ) {
            $uri .= "/edit";
        }

        if( $is_add != 'edit' && !is_numeric($ci->uri->rsegment($uri_length))  ){
            $uri .= "/$editId";
        }

    }


    return $uri;
}

function url_to_list(){
    $ci = get_instance();
    $uri_length = $ci->uri->total_segments();
    $action = $ci->uri->rsegment($uri_length-1);
    $action_last = $ci->uri->rsegment($uri_length);
    $uri = uri_string();

    if( in_array($action,['delete','edit']) || in_array($action_last,['add']) ){
        $uriLengthBack = $uri_length - 1;
        if( in_array($action,['delete','edit']) ){
            $uriLengthBack = $uri_length - 2;
        }

        $uri = "";
        for ($i=1;$i < $uriLengthBack +1 ;$i++){
            $uri .= $ci->uri->rsegment($i);
            if( $i < $uriLengthBack ){
                $uri .= DS;
            }
        }
    }
    return $uri;
}

function submit_redirect($id=0){
    $submit = input_post('submit');

    switch ($submit){
        case 'save':
            $newUri = url_to_edit(null,$id);
            break;
        case 'submit':
            $uriBack = input_get("back");
            if( strlen($uriBack) > 0 ){
                $newUri = base64url_decode($uriBack);
            } else {
                $newUri = url_to_list();
            }
            break;
    }
    return redirect($newUri, 'refresh');
}

function trim_all( $str , $what = NULL , $with = ' ' )
{
    if( $what === NULL )
    {
        //  Character      Decimal      Use
        //  "\0"            0           Null Character
        //  "\t"            9           Tab
        //  "\n"           10           New line
        //  "\x0B"         11           Vertical Tab
        //  "\r"           13           New Line in Mac
        //  " "            32           Space

        $what   = "\\x00-\\x20";    //all white-spaces and control chars
    }

    return trim( preg_replace( "/[".$what."]+/" , $with , $str ) , $what );
}

function str_replace_last( $search , $replace , $str ) {
    if( ( $pos = strrpos( $str , $search ) ) !== false ) {
        $search_length  = strlen( $search );
        $str    = substr_replace( $str , $replace , $pos , $search_length );
    }
    return $str;
}


if ( ! function_exists('trim_title'))
{
    function trim_title($str)
    {
        return trim($str," \t\n\r".chr(0xC2).chr(0xA0));;
    }
}