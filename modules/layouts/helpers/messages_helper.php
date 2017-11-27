<?php
if ( !function_exists('set_error')) {

    function set_error($msg = NULL)
    {
        if ( $msg ) {
            $session = get_instance()->session;
            $_SESSION['error'] = "aaaaa";
            $session->mark_as_flash('error');
            $session->set_flashdata('error', $msg);
        }
    }
}
