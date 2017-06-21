<?php if ( ! defined('BASEPATH') ) exit( 'No direct script access allowed' );

// require_once( BASEPATH.'third_party/Smarty-3/SmartyBC.class.php' );
require_once( BASEPATH.'third_party/Smarty_3/SmartyBC.class.php' );

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
// 		$this->CI =& get_instance();
		$config =& get_config();
		$this->caching = false;
// 		$this->setTemplateDir( APPPATH. 'views' );
		$this->setCompileDir( APPPATH . 'compile' );
// 		$this->setConfigDir(BASEPATH . 'libraries/Smarty-3.1.21/configs' );
		$this->setCacheDir( BASEPATH . '../cache' );
		$this->loadPlugin('smarty_compiler_switch');


		if ( ! defined('IMGPATH') ) define('IMGPATH', BASEPATH.'../images/');
		
		$siteconfig = config_item("site");
		if( !empty($siteconfig) ){
		    $this->assign("config", $siteconfig);
		}

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


		$data = array('view'=>$resource_name);


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

		        list($path, $_view) = Modules::find($file_name, APPPATH, 'views/');

		        if ($path != FALSE)
		            break;
		    }

		}
		if ( $path === FALSE )
		{
		    if( file_exists($_view) ){
		        $pathinfo = pathinfo($_view);
		        $this->setTemplateDir( $pathinfo['dirname'] );
		        return parent::fetch($_view);
		    }
		    $segments = explode('/', $resource_name);
// bug($resource_name);
// 		    unset($segments)
		    $path = ltrim(implode('/', $segments).'/', '/');
		    bug("path = $path && view = $_view");
die('smarty 113 : check app');
// 		    if( file_exists(APPPATH."views/$resource_name") ){

// 		    }
		} else {
		    $this->setTemplateDir( $path );

		    return parent::fetch("$path$_view");
		}






}
	function layout($file){
		$this->layout = $file;
	}
	var $theme_config = null;
	public function theme($item=null){


	}

	function checkResoure($file=NULL,$type='js'){
	    return $file;
// 		return ( ! preg_match('!^\w+://! i', $file)) ? ( str_replace('index.php/','',$this->CI->config->item('asset_url'))).$file : $file;
	}

	public function js($file){
		$this->js[] = $file;
	}
	public function add_js($file){
	    $assets_dir = config_item("assets_dir");
	    $theme_url = config_item("theme_url");
	    if( substr($file,0,2) == '//' OR substr($file,0,4) == 'http' ){
	        $this->js[] = $file;
	    } elseif( file_exists($assets_dir."js/$file")  ){
	        $file = realpath($assets_dir."js/$file");
	        $file = str_replace(realpath($assets_dir), NULL, $file);
	        $this->js[] = $theme_url.str_replace(array('\\'), '/', $file);
	    } else {
	        $this->js[] = site_url($file);
	    }

	}
	public function css($file){
		$this->css[] = $file;
	}
	public function add_css($file){
	    $assets_dir = config_item("assets_dir");
	    $theme_url = config_item("theme_url");
	    if( substr($file,0,2) == '//' OR substr($file,0,4) == 'http' ){
	        $this->css[] = $file;
	    } elseif( file_exists($assets_dir."css/$file")  ){
	        $file = realpath($assets_dir."css/$file");
	        $file = str_replace(realpath($assets_dir), NULL, $file);
	        $this->css[] = $theme_url.str_replace(array('\\'), '/', $file);
	    } else {
	        $this->css[] = $file;
	    }

// 	    $this->css[] = $file;
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

// 	function assign($index=null,$val=null){
// 		if( $index ){
// 			$this->tpl_vars[$index] = $val;
// 			parent::assign($index,$val);
// 		}


// 	}
}