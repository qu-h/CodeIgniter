<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/** load the CI class for Modular Extensions **/
require dirname(__FILE__).'/Base.php';

/**
 * Modular Extensions - HMVC
 *
 * Adapted from the CodeIgniter Core Classes
 * @link	http://codeigniter.com
 *
 * Description:
 * This library replaces the CodeIgniter Controller class
 * and adds features allowing use of modules and the HMVC design pattern.
 *
 * Install this file as application/third_party/MX/Controller.php
 *
 * @copyright	Copyright (c) 2015 Wiredesignz
 * @version 	5.5
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 **/

/**
 * Class MX_Controller
 * @property CI_Config $config
 * @property CI_URI $uri
 * @property CI_Input $input
 */
class MX_Controller
{
	public $autoload = array();
	var $model, $load;
    var $url_suffix = 'html';
    var $page_title_species='';
    var $msg, $fields = [];

	public function __construct()
	{
		$class = str_replace(CI::$APP->config->item('controller_suffix'), '', get_class($this));
//		log_message('debug', $class." MX_Controller Initialized");
		Modules::$registry[strtolower($class)] = $this;

		/* copy a loader instance and initialize */
		$this->load = clone load_class('Loader');
		$this->load->initialize($this);

		/* autoload module items */
		$this->load->_autoloader($this->autoload);
	}

	public function __get($class)
	{
		return CI::$APP->$class;
	}

	public function formFill($id){
        if ($this->input->post()) {
            $data = array();
            foreach ($this->fields as $name => $field) {
                $this->fields[$name]['value'] = $data[$name]= $this->input->post($name);
                if( !isset($field['type']) ){
                    $field['type'] = 'text';
                }
                switch ($field['type']){
                    case 'publish':
                        $data[$name] = ( $data[$name] =='on' || $data[$name] =='1' );
                        break;
                }
            }
            $add = $this->model->update($data);
            $this->fieldFillRow($id);

            if( $add ){

            }
        } else {
            $this->fieldFillRow($id);
        }
    }

    private function fieldFillRow($id){
        $item = $this->model->where('id',$id)->get_row();
        foreach ($this->fields AS $field=>$val){
            if( isset($item->$field) ){
                $this->fields[$field]['value']=$item->$field;
            }
        }
    }
}