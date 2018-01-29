<?php
if ( !function_exists('set_error')) {

    function set_error($msg = NULL)
    {
        if ( $msg ) {
            $session = get_instance()->session;
            //$_SESSION['error'] = "aaaaa";
            //$session->mark_as_flash('error');
            //$session->flashdata('error');
            //$session->set_flashdata(['error'=>$msg]);
            $session->set_userdata("error",$msg);
            $session->mark_as_flash('error');
        }
    }

    function set_success($msg = NULL)
    {
        if ( $msg ) {
            $session = get_instance()->session;
            $session->mark_as_flash('success');
            $session->set_flashdata('success', $msg);

        }
    }
}
