<?php
if ( !function_exists('set_error')) {

    function set_error($msg = NULL)
    {
        if (! $msg) {
            $session = get_instance()->session;
            $session->mark_as_flash('error');
            $session->set_userdata('error', $msg);
        }
    }
}
