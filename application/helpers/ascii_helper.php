<?php

function uniord($u) {
    $k = mb_convert_encoding($u, 'UCS-2LE', 'UTF-8');
    $k1 = ord(substr($k, 0, 1));
    $k2 = ord(substr($k, 1, 1));
    return $k2 * 256 + $k1;
}

function unihex($u) {
    mb_internal_encoding("UTF-8");
    $char = mb_substr($u, 0, 1);
    return bin2hex($char);
}

