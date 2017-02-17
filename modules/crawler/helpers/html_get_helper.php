<?php
if ( !function_exists('get_str_between')) {

    function get_str_between($string, $start, $end){
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }
}

if( !function_exists('get_site_html_curl') ) :
    function get_site_html_curl($url=NULL){
        $ch = curl_init();

        // set url
        curl_setopt($ch, CURLOPT_URL, $url);

        //return the transfer as a string
//         curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
        curl_setopt($ch, CURLOPT_POST, 1 );
//         curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);


        // $output contains the output string
        $contents = curl_exec($ch);
        $error = NULL;
        if (curl_errno($ch)) {
            $error = curl_error($ch);
        }
        // close curl resource to free up system resources

//         bug( $error );

        curl_close($ch);
//         bug($contents);die('get content');
        return $contents;
    }
endif;