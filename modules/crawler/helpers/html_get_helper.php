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

//        // set url
//        curl_setopt($ch, CURLOPT_URL, $url);
//
//        //return the transfer as a string
////         curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//        curl_setopt($ch,CURLOPT_USERAGENT,'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.13) Gecko/20080311 Firefox/2.0.0.13');
//        curl_setopt($ch, CURLOPT_POST, 1 );
////         curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
//        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 2);
//
//        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 1);
//        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
//bug($_SERVER);
        $options = array(
            CURLOPT_URL            => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER         => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING       => "",
            CURLOPT_AUTOREFERER    => true,
            CURLOPT_CONNECTTIMEOUT => 120,
            CURLOPT_TIMEOUT        => 120,
            CURLOPT_MAXREDIRS      => 10,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_SSL_VERIFYPEER =>false,
            CURLOPT_USERAGENT      => $_SERVER['HTTP_USER_AGENT']
        );
        curl_setopt_array( $ch, $options );


        // $output contains the output string
        $contents = curl_exec($ch);
        $error = curl_errno($ch);

        if (!$error) {
            switch ($http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE)) {
                case 200:  # OK
                    break;
                default:
                    bug($url);
                    echo 'Unexpected HTTP code: ', $http_code, "\n";
            }

        } else {
            bug("error:" );
        }

        // close curl resource to free up system resources




        return $contents;
    }
endif;