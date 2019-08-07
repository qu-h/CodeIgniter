<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Class SystemUser
 * @property SystemUserModel $SystemUserModel
 */
class SystemUser extends MX_Controller
{

    function __construct()
    {
        parent::__construct();

        $this->fields = $this->SystemUserModel->fields();
        $this->load->library('Session');

        $this->uid = $this->session->userdata('user_id');
        set_temp_val("SignOutLink", "user/logout");
//        add_site_structure('users',lang("User Management") );
    }

    function checkLogin($uriControl = "")
    {

        if ($this->uid) {
            $user = $this->SystemUserModel->get_item_by_id($this->uid);
            if (!isset($user->avatar) || strlen($user->avatar) < 1) {
                $user->avatar = theme_url("img/avatars/male.png");
            }
            set_temp_val("user", (array)$user);
        } else {
            if (strlen($uriControl) > 0) {
                $redirectLogin = $uriControl."/";
            } else {
                $redirectLogin = "user/login/";
            }

            if (
                uri_string() != $redirectLogin
                && (strpos(uri_string(),$redirectLogin) === FALSE)  )
            {
                redirect($redirectLogin . base64url_encode($this->uri->uri_string()), 'location');
            }
        }
        return true;
    }

    function login($uriBack = "")
    {
        if ($this->session->userdata('user_id')) {
            redirect('', 'location');
        }

        if ($this->input->post()) {
            $post = array(
                'username' => input_post('username'),
                'password' => input_post('password')
            );
            $remember = input_post("remember");

            $login = $this->SystemUserModel->checklogin($post);

            if ($login != NULL) {

                if( $this->uri->segment(1)=='admin' && $this->uri->segment(2)=='login' ){
                    $uriReturn = base64_decode($this->uri->segment(3));
                } elseif ($this->uri->segment(1)=='login') {
                    $uriReturn = base64_decode($this->uri->segment(2));
                } elseif ($uriBack) {
                    $uriReturn = $uriBack;
                } else {
                    if ($this->uri->segment(2)) {
                        $uriReturn = base64_decode($this->uri->segment(2));
                    }
                }
                $this->session->set_userdata('user_id', $login->id);
                redirect($uriReturn, 'location');
            }
        }

        if( class_exists("Google") ){
            set_temp_val("google_login_url",$this->google->get_login_url());
        }
        $this->template->set_layout('login')->build('login');
    }

    public function logout()
    {
        $this->session->sess_destroy();
    }

    var $table_fields = array(
        'id' => array("#", 5, true, 'text-center'),
        'fullname' => array("Fullname"),
        'email' => array('Email'),
        'actions' => array(),
    );

    function items()
    {

        if ($this->uri->extension == 'json') {
            return $this->SystemUserModel->items_json(array_keys($this->table_fields));
        }

        $data = columns_fields($this->table_fields);

        $this->template
            ->build('backend/datatables', $data);
    }

    public function form($id = 0)
    {
        if ($this->input->post()) {
            $data = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $data[$name] = $this->input->post($name);
            }
            $add = $this->SystemUserModel->update($data);
//            die("after post");
            if ($add) {
                set_error(lang('Success.'));
            }

        } else if ($id > 0) {
            $item = $this->SystemUserModel->get_item_by_id($id);
            foreach ($this->fields AS $field => $val) {
                if (isset($item->$field)) {
                    $this->fields[$field]['value'] = $item->$field;
                }
            }
        }

        $data = array(
            'fields' => $this->fields
        );
        $this->template->build('backend/form', $data);
    }

    public function profile($id = 0)
    {
        $user = $this->SystemUserModel->get_item_by_id($id);
        $this->template->build('profile');
    }


}