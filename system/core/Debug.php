<?php

if (!function_exists('bug')) {
    function bug($var = null, $exit = false)
    {
        echo '<pre>';
        print_r($var);
        echo '</pre>'.PHP_EOL;

        if ($exit) {
            die("exit:" . $exit);
        }
    }
}

function dd($value,$die=null,$traceStep = 50){
    $backtrace = debug_backtrace();
    if( count($backtrace) > 0 ) {
        if( $traceStep ){
            //krsort($backtrace);
        } else {
            $backtraceLast = $backtrace[0];
            $backtrace = [$backtraceLast];
        }
        if( $traceStep > 0 ){
            $count = 1;
            bug("=========================================BEGIN BACK-TRACE",false);
            foreach ($backtrace AS $b){
                if( $count > $traceStep ){
                    break;
                }

                $file = $b['file'];
                $file = str_replace(BASEPATH,'[BASEPATH]',$file);
                $file = str_replace(BASEPATH,'[BASEPATH]',$file);
                $line = $b['line'];
                $class = array_key_exists('class',$b) ? $b['class'] : null;
                $function = array_key_exists('function',$b) ? $b['function'] : null;

                $count++;
                bug($file."[$line]",false);
            }
            bug("========================================================END BACK-TRACE",false);
        }
    }
    bug($value,false);
    if( $die === false ){
        return;
    }
    if( is_string($die) ){
        die($die);
    } else {
        die('go to die '.__LINE__);
    }
}