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

function dd($value,$die=null,$traceStep = 1){
    $backtrace = debug_backtrace();
    $lineChecking = __LINE__;
    $fileChecking = "";
    if( count($backtrace) > 0 ) {
        if( $traceStep==-1){
            $traceStep = 50;
        }
        if( $traceStep ){
            //krsort($backtrace);
        } else {
            $backtraceLast = $backtrace[0];
            $backtrace = [$backtraceLast];
        }
        $lastFile = reset($backtrace);
        $lineChecking = $lastFile['line'];
        $fileChecking = pathinfo($lastFile['file'], PATHINFO_BASENAME);
        if( $traceStep > 0 ){
            $count = 1;
            bug("========================================================BEGIN BACK-TRACE",false);
            $systemModulePath = realpath(BASEPATH."..".DS."application".DS."modules").DS;
            foreach ($backtrace AS $index=>$b){
                if( $count > $traceStep ){
                    break;
                }
                if( array_key_exists('file',$b) != true){
                    continue;
                }
                $file = $b['file'];
                $file = str_replace(BASEPATH,'[BASEPATH    ] ',$file);

                $file = str_replace($systemModulePath,'[SystemModule] ',$file);
                $file = str_replace(APPPATH,'[APPPATH     ] ',$file);
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
        die("go to die $fileChecking [$lineChecking]");
    }
}