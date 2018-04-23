<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

require_once( BaseAppPath.'third_party/Smarty_3/SmartyBC.class.php' );

class CI_Smarty extends SmartyBC {

    var $CI=NULL;
	var $js = array();
	var $css = array();
    var $css_ie = array();
	var $css_all_ie = array();
    var $script = array('js'=>null,'ready'=>null,'header'=>'');
    var $tpl_vars = array();
    var $theme = 'default';


	public function __construct() {
		parent::__construct();

		$this->caching = false;
		$this->setCompileDir( APPPATH . 'compile' );
		$this->setCacheDir( BASEPATH . '../cache' );
		$this->loadPlugin('smarty_compiler_switch');
		if ( ! defined('IMGPATH') ) define('IMGPATH', BASEPATH.'../images/');

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
        if( is_array($params) && !empty($params) ) foreach ($params AS $k=>$d){
            $this->assign($k, $d);
        }
        if( !empty($this->script['ready']) ){
            $this->assign('js_ready', $this->script['ready']);
        }
        if( !empty($this->script['header']) ){
            $this->assign('js_header', $this->script['header']);
        }

        $ci = get_instance();

        list($path, $_view) = Modules::find($resource_name, $ci->router->class,"views/",true );
        if( $path === FALSE ){
            list($path, $_view) = Modules::find($resource_name, $ci->router->module,"views/",true );
        }
        //bug($ci->router);
        //bug("smarty 55 ==== path:".$path." modulue:find ".$ci->router->class);
        //bug($ci->router);

        //die($resource_name);
        if( $path === FALSE ){
            list($path, $_view) = Modules::find($resource_name, SYSTEM_MODULE_PATH );
        }

		if( $path === FALSE ){
            list($path, $_view) = Modules::find($resource_name,APPPATH.'views/',null,true);
        }

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



		        if ($path != FALSE)
		            break;
		    }

		}

		if ( $path === FALSE )
		{
		    $segments = explode('/', $resource_name);
		    $path = ltrim(implode('/', $segments).'/', '/');
		    bug("path:$path resouce_name:$resource_name template:$path$_view");
            //die('smarty 168 : check app');

		} else {
            //$this->setTemplateDir($path);
            $this->assign("tplPath", $path);
//            bug("set temDir:$path");
        }
//bug("show view $path$_view");
		return parent::fetch("$path$_view");




}
	function layout($file){
		$this->layout = $file;
	}
	var $theme_config = null;
	public function theme($item=null){

// 		if( file_exists(APPPATH.'config/themes.php')  ){
// 			$file = APPPATH.'config/themes.php';
// 		} else {
// 			$file = null;
// 		}

// 		if( $file == null ) return;

// 		include_once $file;
// 		if ( !$this->theme_config ){
// 		    $this->theme_config = $theme;
// 		}


// 		if( !$item ) {
// 			$item = $this->theme_config['default'];
// 			$this->theme = $item;
// 		}


// 		if( isset($this->theme_config[$item]) ){
// 			if( isset($this->theme_config[$item]['css']) ){
// 				$this->css = $this->theme_config[$item]['css'];
// 			}

// 			if( isset($this->theme_config[$item]['js']) ){
// 				$this->js = $this->theme_config[$item]['js'];
// 			}
// 			if( isset($this->theme_config[$item]['layout']) ){
// 			    $this->layout = $this->theme_config[$item]['layout'];
// 			}

// 		}

// 		if( $this->theme ){
// 		    $theme_function = $this->theme."_theme";
// 		    $theme_file = BASEPATH.'third_party/Smarty_3/themes/'.$this->theme.'.php';

// 		    if( !class_exists($theme_function) && file_exists($theme_file)){
//     			include $theme_file;
//     		}

//     		if( class_exists($theme_function) ){
//     		    $methods = get_class_methods($theme_function);

//     		    foreach ($methods AS $plugin){

//     		        if( $plugin !='__construct' ){
//     		        				$this->registerPlugin('function', $plugin, "$theme_function::".$plugin);
//     		        }

//     		    }
//     		}

// 		}

	}

	function checkResoure($file=NULL,$type='js'){
	    return $file;
// 		return ( ! preg_match('!^\w+://! i', $file)) ? ( str_replace('index.php/','',$this->CI->config->item('asset_url'))).$file : $file;
	}

	public function js($file){
		$this->js[] = $file;
	}
	public function add_js($file){
	    $this->js[] = $file;
	}
	public function css($file){
		$this->css[] = $file;
	}
	public function add_css($file){
	    $this->css[] = $file;
	}

	public function jsscript($str=null){
		$this->script['js'].= $str;
	}
	public function js_ready($str=null){
		$this->script['ready'].= $str;
	}

	public function js_header($str=null){
	    $this->script['header'].= $str;
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

}