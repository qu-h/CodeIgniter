<?php
/**
 * Created by PhpStorm.
 * User: hongq
 * Date: 12/26/2018
 * Time: 3:03 AM
 */

class CI_Env
{
    var $data = [];

    function __construct()
    {
        if (empty($this->data)) {
            $this->read();
        }
    }

    public function read()
    {
        if (empty($env_data)) {
            $env_file = realpath(FCPATH . DIRECTORY_SEPARATOR . ".env");
            if( empty($env_file) ){
                $env_file = realpath(FCPATH . "/../.env");
            }

            if (is_file($env_file)) {
                $data = @file_get_contents($env_file);
                $lines = preg_split('/\r\n|\n|\r/', trim($data));
                if (count($lines) > 0) foreach ($lines AS $line) {
                    $row = preg_split('/=/', trim($line));
                    $valName = trim($row[0]);
                    if (substr($valName, 0, 1) == '#')
                        continue;
                    $value = null;
                    if (count($row) == 2) {
                        $value = trim($row[1]);

                        if (substr($value, 0, 1) == '"') {
                            $value = substr($value, 1);
                        }

                        if (substr($value, strlen($value) - 1, 1) == '"') {
                            $value = substr($value, 0, strlen($value) - 1);
                        }

                        $charEnd = strpos($value, '"');
                        if ($charEnd > 0) {
                            $value = substr($value, 0, $charEnd);
                        }
                    }
                    if (defined('ROOT_PATH') && strpos($value, 'ROOT_PATH')) {
                        $value = str_replace('{ROOT_PATH}', ROOT_PATH, $value);
                    }
                    if (!defined($valName)) {
                        $this->data[trim($valName)] = trim($value);
                    }
                }
            }
        }
    }

    public function get($env_name)
    {
        return array_key_exists($env_name, $this->data) ? $this->data[$env_name] : null;
    }
}