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
//     var $theme = 'default';
//     var $theme_ui = NULL;

	public function __construct() {
		parent::__construct();
// 		$this->CI =& get_instance();
		$config =& get_config();
		$this->caching = false;
// 		$this->setTemplateDir( APPPATH. 'views' );
		$this->setCompileDir( APPPATH . 'compile' );
// 		$this->setConfigDir(BASEPATH . 'libraries/Smarty-3.1.21/configs' );
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
// 		$this->theme();

		define('IMGPATH', BASEPATH.'../images/');
// 		define('IMGURL', $this->CI->config->item('images_url'));

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

// 		if (strpos($resource_name, '.') === false) {
// 			$resource_name .= '.htm';
// 		}

// 		if (!is_file($this->template_dir[0] . $resource_name)) {
// 			show_error("template: [$resource_name] cannot be found.");
// 		}

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
// 			'js'=>$this->js,
// 			'css'=>$this->css,
//             'css_ie'=>$this->css_ie,
// 			'css_all_ie'=>$this->css_all_ie,
// 			'script'=>$this->script,
// 			'siteDir'=>$this->CI->config->item('base_url'),
// 			'imgURL'=>$this->CI->config->item('image_url').DS,
// 			'assetsURL'=>$this->CI->config->item('asset_url').'/assets/',
// 			'siteurl'=>$this->CI->config->item('base_url'),
		);


// 		if( !empty($this->tpl_vars) ){
// 			foreach ( $this->tpl_vars AS $index=>$val){
// 				$data[$index] = $val;
// 			}
// 		}

// 		if( isset($this->CI->title) ){
// 			$data['pagetitle'] = $this->CI->title;
// 		}


// 		$data = array_merge ( $data ,$params );
        if( is_array($params) && !empty($params) ) foreach ($params AS $k=>$d){
            $this->assign($k, $d);
        }
//         bug($params);
// bug($this->tpl_vars);
		$ci = get_instance();


		list($path, $_view) = Modules::find($resource_name, SYSTEM_MODULE_PATH );
		if( $path === FALSE) {
		    $resource_ext = pathinfo($resource_name, PATHINFO_EXTENSION);
		    foreach (array('.html','.htm') AS $ext){
		        if( $resource_ext ){
		            $file_name = str_replace($resource_ext, $ext, $resource_name);
		        } else {
		            $file_name = $resource_name.$ext;
		        }

		        list($path, $_view) = Modules::find($file_name, SYSTEM_MODULE_PATH, 'views/');
		        if ($path != FALSE)
		            break;
		    }

		}
		if ($path != FALSE)
		{
		    return parent::fetch("$path$_view");
		}

}
	function layout($file){
		$this->layout = $file;
	}
	var $theme_config = null;
	public function theme($item=null){

		if( file_exists(APPPATH.'config/themes.php')  ){
			$file = APPPATH.'config/themes.php';
		} else {
			$file = null;
		}

		if( $file == null ) return;

		include_once $file;
		if ( !$this->theme_config ){
		    $this->theme_config = $theme;
		}


		if( !$item ) {
			$item = $this->theme_config['default'];
			$this->theme = $item;
		}


		if( isset($this->theme_config[$item]) ){
			if( isset($this->theme_config[$item]['css']) ){
				$this->css = $this->theme_config[$item]['css'];
			}

			if( isset($this->theme_config[$item]['js']) ){
				$this->js = $this->theme_config[$item]['js'];
			}
			if( isset($this->theme_config[$item]['layout']) ){
			    $this->layout = $this->theme_config[$item]['layout'];
			}

		}

		if( $this->theme ){
		    $theme_function = $this->theme."_theme";
		    $theme_file = BASEPATH.'third_party/Smarty_3/themes/'.$this->theme.'.php';
		    if( !class_exists($theme_function) && file_exists($theme_file)){
    			include $theme_file;
    		}

    		if( class_exists($theme_function) ){
    		    $methods = get_class_methods($theme_function);

    		    foreach ($methods AS $plugin){

    		        if( $plugin !='__construct' ){
    		        				$this->registerPlugin('function', $plugin, "$theme_function::".$plugin);
    		        }

    		    }
    		}

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