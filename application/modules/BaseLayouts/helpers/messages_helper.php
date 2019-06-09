<?php defined('BASEPATH') OR exit('No direct script access allowed');

if (!function_exists('set_error')) {
    function set_message_flash($type = 'error', $message)
    {
        $session = get_instance()->session;
        $session->set_userdata($type, $message);
        $session->mark_as_flash($type);
    }

    function set_error($msg = NULL)
    {
        if ($msg)
            set_message_flash('error', $msg);
    }

    function set_success($msg = NULL)
    {
        if ($msg)
            set_message_flash('success', $msg);
    }
}
