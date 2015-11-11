<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

// require_once( BASEPATH.'third_party/Smarty-3/SmartyBC.class.php' );
require_once( BASEPATH.'third_party/Smarty_3/SmartyBC.class.php' );
// die('call me');
class CI_Smarty extends SmartyBC {
	var $CI=NULL;
	var $js = array();
	var $css = array();
    var $css_ie = array();
	var $css_all_ie = array();
    var $script = array('js'=>null,'ready'=>null);
    var $tpl_vars = array();
    var $theme = 'default';
    var $theme_ui = NULL;

	public function __construct() {
		parent::__construct();
		$this->CI =& get_instance();
		$config =& get_config();
		$this->caching = false;
		$this->setTemplateDir( APPPATH. 'views' );
		$this->setCompileDir( APPPATH . 'compile' );
		$this->setConfigDir(BASEPATH . 'libraries/Smarty-3.1.21/configs' );
		$this->setCacheDir( BASEPATH . '../cache' );
		$this->loadPlugin('smarty_compiler_switch');

// 		if( !class_exists('SmartyPlugin') ){
// 			$this->CI->load->library('SmartyPlugin');
// 		}
// 		$methods = get_class_methods('SmartyPlugin' );
// 		foreach ($methods AS $plugin){
// 			if( $plugin !='__construct' ){
// 				$this->registerPlugin('function', $plugin, 'SmartyPlugin::'.$plugin);
// 			}

// 		}
		$this->theme();

		define('IMGPATH', BASEPATH.'../images/');
		define('IMGURL', $this->CI->config->item('images_url'));

	}

	public function useCached( $tpl, $data = null ) {
		if ( $this->isCached( $tpl, $data ) ) {
			$this->display( $tpl, $data );
			exit();
		}
	}

	var $useTemp = TRUE;
	var $layout = 'template';
	function view($resource_name, $params = array())   {
		$alang = array();

		if (strpos($resource_name, '.') === false) {
			$resource_name .= '.htm';
		}

		if (!is_file($this->template_dir[0] . $resource_name)) {
			show_error("template: [$resource_name] cannot be found.");
		}

		foreach ($this->js AS $k=>$file){
			$this->js[$k] = self::checkResoure($file);
		}

		foreach ($this->css AS $k=>$file){
			$this->css[$k] = self::checkResoure($file);
		}

        foreach ($this->css_ie AS $k=>$file){
			$this->css_ie[$k] = self::checkResoure($file);
		}

		foreach ($this->css_all_ie AS $k=>$file){
			$this->css_all_ie[$k] = self::checkResoure($file);
		}

		$data = array('view'=>$resource_name,
			'js'=>$this->js,
			'css'=>$this->css,
            'css_ie'=>$this->css_ie,
			'css_all_ie'=>$this->css_all_ie,
			'script'=>$this->script,
			'siteDir'=>$this->CI->config->item('base_url'),
			'imgURL'=>$this->CI->config->item('image_url').DS,
			'assetsURL'=>$this->CI->config->item('asset_url').'/assets/',
			'siteurl'=>$this->CI->config->item('base_url'),
		);


		if( !empty($this->tpl_vars) ){
			foreach ( $this->tpl_vars AS $index=>$val){
				$data[$index] = $val;
			}
		}

		if( isset($this->CI->title) ){
			$data['pagetitle'] = $this->CI->title;
		}



		$data = array_merge ( $data ,$params );

		if( $this->useTemp === FALSE ){
			return parent::display($resource_name,$data);
		}

		return parent::display('layout/'.$this->layout.'.html',$data);
	}
	function layout($file){
		$this->layout = $file;
	}
	public function theme($item=null){

		if( file_exists(APPPATH.'config/themes.php')  ){
			$file = APPPATH.'config/themes.php';
		} else {
			$file = null;
		}
// 		bug($file);die;
		if( $file == null ) return;

		include_once $file;

		if( !$item ) {
			$item = $theme['default'];
			$this->theme = $item;
		}


		if( isset($theme[$item]) ){
			if( isset($theme[$item]['css']) ){
				$this->css = $theme[$item]['css'];
			}

			if( isset($theme[$item]['js']) ){
				$this->js = $theme[$item]['js'];
			}
			if( isset($theme[$item]['layout']) ){
			    $this->layout = $theme[$item]['layout'];
			}


// 			$this->theme = $item;

		}

	}

	function checkResoure($file=NULL,$type='js'){
	    return $file;
// 		return ( ! preg_match('!^\w+://! i', $file)) ? ( str_replace('index.php/','',$this->CI->config->item('asset_url'))).$file : $file;
	}

	public function js($file){

		$this->js[] = $file;

		//bug($this->js); die;
	}
	public function css($file){
		$this->css[] = $file;
// 		die('add css');
		//bug($this->js); die;
	}

	public function jsscript($str=null){
		$this->script['js'].= $str;
	}
	public function jsready($str=null){
		$this->script['ready'].= $str;
	}

	function loadLibrariesPlugin($class=''){
		if( !$class ) return false;

		if( !class_exists($class) ){
			$this->CI->load->library($class);
		}

		$methods = get_class_methods( $class );
		foreach ($methods AS $plugin){
			if( $plugin !='__construct' ){
				$this->registerPlugin('function', $plugin, $class.'::'.$plugin);
			}

		}
	}

// 	function assign($index=null,$val=null){
// 		if( $index ){
// 			$this->tpl_vars[$index] = $val;
// 			parent::assign($index,$val);
// 		}


// 	}
}