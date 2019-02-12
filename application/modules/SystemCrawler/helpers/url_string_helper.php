<?php

function get_domain($url=""){
    preg_match("/[a-z0-9\-]{1,63}\.[a-z\.]{2,6}$/", parse_url($url, PHP_URL_HOST), $_domain_tld);
    return !empty($_domain_tld) ? $_domain_tld[0] : null;
}