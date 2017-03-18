<?php defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * CodeIgniter Template Class
 *
 * Build your CodeIgniter pages much easier with partials, breadcrumbs, layouts and themes
 *
 * @package			CodeIgniter
 * @subpackage		Libraries
 * @category		Libraries
 * @author			Philip Sturgeon
 * @license			http://philsturgeon.co.uk/code/dbad-license
 * @link			http://getsparks.org/packages/template/show
 */

class Template
{
	private $_module = '';
	private $_controller = '';
	private $_method = '';

	private $_theme = NULL;
	private $_theme_path = NULL;
	private $_layout = FALSE; // By default, dont wrap the view with anything
	private $_layout_subdir = ''; // Layouts and partials will exist in views/layouts
	// but can be set to views/foo/layouts with a subdirectory

	private $_title = '';
	private $_metadata = array();

	private $_partials = array();

	private $_breadcrumbs = array();

	private $_title_separator = ' | ';

	private $_parser_enabled = TRUE;
	private $_parser_body_enabled = TRUE;

	private $_theme_locations = array();

	private $_is_mobile = FALSE;

	// Minutes that cache will be alive for
	private $cache_lifetime = 0;

	private $_ci;

	private $_data = array();

	/**
	 * Constructor - Sets Preferences
	 *
	 * The constructor can be passed an array of config values
	 */
	function __construct($config = array())
	{
		$this->_ci =& get_instance();

		if ( ! empty($config))
		{
			$this->initialize($config);
		}

		log_message('debug', 'Template class Initialized');
	}

	// --------------------------------------------------------------------

	/**
	 * Initialize preferences
	 *
	 * @access	public
	 * @param	array
	 * @return	void
	 */
	function initialize($config = array())
	{
		foreach ($config as $key => $val)
		{
			if ($key == 'theme' AND $val != '')
			{
				$this->set_theme($val);
				continue;
			}

			$this->{'_'.$key} = $val;
		}

		// No locations set in config?
		if ($this->_theme_locations === array())
		{
			// Let's use this obvious default
// 			$this->_theme_locations = array  (SYSTEM_MODULE_PATH . 'themes/');
		}

		// Theme was set
		if ($this->_theme)
		{
			$this->set_theme($this->_theme);
		}

		// If the parse is going to be used, best make sure it's loaded
		if ($this->_parser_enabled === TRUE)
		{
			class_exists('CI_Parser') OR $this->_ci->load->library('parser');
		}

		// Modular Separation / Modular Extensions has been detected
		if (method_exists( $this->_ci->router, 'fetch_module' ))
		{
			$this->_module 	= $this->_ci->router->fetch_module();
		}

		// What controllers or methods are in use
		$this->_controller	= $this->_ci->router->fetch_class();
		$this->_method 		= $this->_ci->router->fetch_method();

		// Load user agent library if not loaded
		class_exists('CI_User_agent') OR $this->_ci->load->library('user_agent');

		// We'll want to know this later
		$this->_is_mobile	= $this->_ci->agent->is_mobile();
	}

	// --------------------------------------------------------------------

	/**
	 * Magic Get function to get data
	 *
	 * @access	public
	 * @param	  string
	 * @return	mixed
	 */
	public function __get($name)
	{
		return isset($this->_data[$name]) ? $this->_data[$name] : NULL;
	}

	// --------------------------------------------------------------------

	/**
	 * Magic Set function to set data
	 *
	 * @access	public
	 * @param	  string
	 * @return	mixed
	 */
	public function __set($name, $value)
	{
		$this->_data[$name] = $value;
	}

	// --------------------------------------------------------------------

	/**
	 * Set data using a chainable metod. Provide two strings or an array of data.
	 *
	 * @access	public
	 * @param	  string
	 * @return	mixed
	 */
	public function set($name, $value = NULL)
	{
		// Lots of things! Set them all
		if (is_array($name) OR is_object($name))
		{
			foreach ($name as $item => $value)
			{
				$this->_data[$item] = $value;
			}
		}

		// Just one thing, set that
		else
		{
			$this->_data[$name] = $value;
		}

		return $this;
	}

	// --------------------------------------------------------------------

	/**
	 * Build the entire HTML output combining partials, layouts and views.
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */
	public function build($view, $data = array(), $return = FALSE) {
		// Set whatever values are given. These will be available to all view files
		is_array($data) OR $data = (array) $data;
		// Merge in what we already have with the specific data
		$this->_data = array_merge($this->_data, $data);


		if( !array_key_exists('fields', $this->_data) AND isset($this->_ci->form) ){
		    $this->_ci->smarty->assign("fields", $this->_ci->form->fields);
		}

		// We don't need you any more buddy
		unset($data);
		if (empty($this->_title)) {
			$this->_title = $this->_guess_title();
		}

		// Output template variables to the template
		$template['title']	= $this->_title;
		$template['breadcrumbs'] = $this->_breadcrumbs;
		$template['metadata']	= implode("\n\t\t", $this->_metadata);
		$template['partials']	= array();

		// Assign by reference, as all loaded views will need access to partials
		$this->_data['template'] =& $template;

		foreach ($this->_partials as $name => $partial) {
			// We can only work with data arrays
			is_array($partial['data']) OR $partial['data'] = (array) $partial['data'];

			//If it uses a view, load it
			if (isset($partial['view'])) {
				$template['partials'][$name] = $this->_find_view($partial['view'], $partial['data']);
			} else {  // Otherwise the partial must be a string
				if ($this->_parser_enabled === TRUE) {
					$partial['string'] = $this->_ci->parser->parse_string($partial['string'], $this->_data + $partial['data'], TRUE, TRUE);
				}
				$template['partials'][$name] = $partial['string'];
			}
		}

		// Disable sodding IE7's constant cacheing!!
		$this->_ci->output->set_header('Expires: Sat, 01 Jan 2000 00:00:01 GMT');
		$this->_ci->output->set_header('Cache-Control: no-store, no-cache, must-revalidate');
		$this->_ci->output->set_header('Cache-Control: post-check=0, pre-check=0, max-age=0');
		$this->_ci->output->set_header('Last-Modified: ' . gmdate( 'D, d M Y H:i:s' ) . ' GMT' );
		$this->_ci->output->set_header('Pragma: no-cache');

		// Let CI do the caching instead of the browser
		$this->_ci->output->cache($this->cache_lifetime);

		// Test to see if this file
		$this->_body = $this->_find_view($view, array(), $this->_parser_body_enabled);
// 		if( is_null(trim($this->_body)) ){
// 		    list($view_path, $file_view) = Modules::find($view.'.htm','views/');
// 		    $this->_body = self::_load_view($file_view, array(), $return, $view_path );
// 		    bug($file_view);
// 		}


		// Want this file wrapped with a layout file?
// 		bug($this->_layout);die;
		if ($this->_layout)
		{

			// Added to $this->_data['template'] by refference
			$template['body'] = $this->_body;
			// Find the main body and 3rd param means parse if its a theme view (only if parser is enabled)

// 			if( !is_null($app_path=realpath(APPPATH.'views/layouts')) ){
// 			    $file_view = $this->_layout;
// 			    foreach (glob("$app_path/$file_view.*") AS $file_name){
// 			        if( is_null($file_path) ){
//                         $file_path = $file_name;
//                         break;
//                     }
//                 }

// 			}
			list($layout_path, $layout_view) = Modules::find($this->_layout.'.htm',APPPATH.'views/layouts');

			if( $layout_path != FALSE ){
			    $this->_body =  self::_load_view($layout_view, $this->_data, $return, $layout_path );
			}

			list($layout_path, $layout_view) = Modules::find('layouts/'.$this->_layout,  self::_find_view_folder() );

			if( $layout_path != FALSE ){
			    $this->_body =  self::_load_view('layouts/'.$this->_layout, $this->_data, $return, $layout_path);
			}

			list($layout_path, $layout_view) = Modules::find('layouts/views/'.$this->_layout,  SYSTEM_MODULE_PATH."/" );

			if( $layout_path != FALSE ){
			    $this->_body =  self::_load_view('layouts/views/'.$this->_layout, $this->_data, $return, $layout_path );
			}

// 			if( file_exists(SYSTEM_MODULE_PATH.'/layouts/views/'.$this->_layout) ){
// 			    $this->_body =  self::_load_view('layouts/views/'.$this->_layout, $this->_data, $this->_parser_body_enabled, SYSTEM_MODULE_PATH."/" );

// 			}elseif( file_exists(VIEWPATH.'layouts/'.$this->_layout) ){
// 			    $this->_body =  self::_load_view('layouts/'.$this->_layout, $this->_data, $this->_parser_body_enabled, self::_find_view_folder());

// 			} else {
// 			    $this->_body =  self::_find_view("layouts/".$this->_layout, $this->_data);
// 			}



		}

		// Want it returned or output to browser?
		if ( !$return)
		{
			$this->_ci->output->set_output($this->_body);
		}

		return $this->_body;
	}

	/**
	 * Set the title of the page
	 *
	 * @access	public
	 * @param	string
	 * @return	void
	 */
	public function title()
    {
        if (func_num_args() >= 1)
        {
            $title_segments = func_get_args();
            $this->_title = implode($this->_title_separator, $title_segments);
        }

        return $this;
    }


	/**
	 * Put extra javascipt, css, meta tags, etc before all other head data
	 *
	 * @access	public
	 * @param	 string	$line	The line being added to head
	 * @return	void
	 */
	public function prepend_metadata($line)
	{
		array_unshift($this->_metadata, $line);
		return $this;
	}


	/**
	 * Put extra javascipt, css, meta tags, etc after other head data
	 *
	 * @access	public
	 * @param	 string	$line	The line being added to head
	 * @return	void
	 */
	public function append_metadata($line)
	{
		$this->_metadata[] = $line;
		return $this;
	}


	/**
	 * Set metadata for output later
	 *
	 * @access	public
	 * @param	  string	$name		keywords, description, etc
	 * @param	  string	$content	The content of meta data
	 * @param	  string	$type		Meta-data comes in a few types, links for example
	 * @return	void
	 */
	public function set_metadata($name, $content, $type = 'meta')
	{
		$name = htmlspecialchars(strip_tags($name));
		$content = htmlspecialchars(strip_tags($content));

		// Keywords with no comments? ARG! comment them
		if ($name == 'keywords' AND ! strpos($content, ','))
		{
			$content = preg_replace('/[\s]+/', ', ', trim($content));
		}

		switch($type)
		{
			case 'meta':
				$this->_metadata[$name] = '<meta name="'.$name.'" content="'.$content.'" />';
			break;

			case 'link':
				$this->_metadata[$content] = '<link rel="'.$name.'" href="'.$content.'" />';
			break;
		}

		return $this;
	}


	/**
	 * Which theme are we using here?
	 *
	 * @access	public
	 * @param	string	$theme	Set a theme for the template library to use
	 * @return	void
	 */
	public function set_theme($theme = NULL)
	{
		$this->_theme = $theme;
		foreach ($this->_theme_locations as $location)
		{
// 		    bug($location.$this->_theme);
			if ($this->_theme AND file_exists($location.$this->_theme))
			{
				$this->_theme_path = realpath(rtrim($location.$this->_theme.'/')).DS;
				break;
			}
		}
// 		bug($this->_theme_path);
		/*
		 * 160823 QuanNH add Smarty Plugin
		 */

		if( $this->get_theme_path() != "" ){
		    $this->_ci->config->load( $this->get_theme_path()."config.php" );

            $this->_data['assets_dir'] = $this->_ci->config->item('assets_dir');
            $this->_data['assets_url'] = $this->_ci->config->item('assets_url');
            $theme_url = $this->_ci->config->item('theme_url');
            $assets_dir = $this->_ci->config->item('assets_dir');
		    $theme_css = $this->_ci->config->item('css');
		    if( !empty($theme_css) ) foreach ($theme_css AS $css){
		        add_css($css);
		    }

		    $css_loggedin = $this->_ci->config->item('css_loggedin');
		    if( !empty($css_loggedin) && $this->_ci->session->userdata('uid'))
		        foreach ($css_loggedin AS $css){
		          add_css($css);
		    }

		    $theme_js = $this->_ci->config->item('js');
		    if( !empty($theme_js) ) foreach ($theme_js AS $js){
		        add_js($js);

		    }

		    $js_loggedin = $this->_ci->config->item('js_loggedin');
		    if( !empty($js_loggedin) && $this->_ci->session->userdata('uid'))
	        foreach ($js_loggedin AS $js){
		        add_js($js);
		    }
		}
		if( property_exists($this->_ci, 'smarty') ){
		    $this->_ci->smarty->theme = $theme;
		}

		if( $this->_theme AND is_dir($this->_theme_path) ){

		    if( file_exists($smart_func = $this->_theme_path."smarty_func.php") AND property_exists($this->_ci, 'smarty') ){
		        include_once $smart_func;
		        $ui_class_name = $this->_theme.'_ui';

		        $reflection = new ReflectionClass($ui_class_name);

		        $methods = $reflection->getMethods(ReflectionMethod::IS_STATIC);

// 		        $func1 = $reflection->getMethod('func1')

// 		        $methods = get_class_methods($ui_class_name);
		        foreach ($methods AS $plugin){

// 		            if( $plugin !='__construct' AND $reflection->getMethod($plugin)->isStatic() ){
                    if( !isset($this->_ci->smarty->registered_plugins['function']) OR  !array_key_exists($plugin->name, $this->_ci->smarty->registered_plugins['function']) ) {
		                $this->_ci->smarty->registerPlugin('function', $plugin->name, $ui_class_name.'::'.$plugin->name);
		            }
// 		            bug($this->_ci->smarty->registered_plugins);die;
		        }
		    }

		}

		return $this;
	}

	/**
	 * Get the current theme path
	 *
	 * @access	public
	 * @return	string The current theme path
	 */
	public function get_theme_path()
	{
		return $this->_theme_path;
	}


	/**
	 * Which theme layout should we using here?
	 *
	 * @access	public
	 * @param	string	$view
	 * @return	void
	 */
	public function set_layout($view, $_layout_subdir = '')
	{
		$this->_layout = $view;

		$_layout_subdir AND $this->_layout_subdir = $_layout_subdir;

		return $this;
	}

	/**
	 * Set a view partial
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @param	boolean
	 * @return	void
	 */
	public function set_partial($name, $view, $data = array())
	{
		$this->_partials[$name] = array('view' => $view, 'data' => $data);
		return $this;
	}

	/**
	 * Set a view partial
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @param	boolean
	 * @return	void
	 */
	public function inject_partial($name, $string, $data = array())
	{
		$this->_partials[$name] = array('string' => $string, 'data' => $data);
		return $this;
	}


	/**
	 * Helps build custom breadcrumb trails
	 *
	 * @access	public
	 * @param	string	$name		What will appear as the link text
	 * @param	string	$url_ref	The URL segment
	 * @return	void
	 */
	public function set_breadcrumb($name, $uri = '')
	{
		$this->_breadcrumbs[] = array('name' => $name, 'uri' => $uri );
		return $this;
	}

	/**
	 * Set a the cache lifetime
	 *
	 * @access	public
	 * @param	string
	 * @param	string
	 * @param	boolean
	 * @return	void
	 */
	public function set_cache($minutes = 0)
	{
		$this->cache_lifetime = $minutes;
		return $this;
	}


	/**
	 * enable_parser
	 * Should be parser be used or the view files just loaded normally?
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	void
	 */
	public function enable_parser($bool)
	{
		$this->_parser_enabled = $bool;
		return $this;
	}

	/**
	 * enable_parser_body
	 * Should be parser be used or the body view files just loaded normally?
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	void
	 */
	public function enable_parser_body($bool)
	{
		$this->_parser_body_enabled = $bool;
		return $this;
	}

	/**
	 * theme_locations
	 * List the locations where themes may be stored
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	array
	 */
	public function theme_locations()
	{
		return $this->_theme_locations;
	}

	/**
	 * add_theme_location
	 * Set another location for themes to be looked in
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	array
	 */
	public function add_theme_location($location)
	{
		$this->_theme_locations[] = $location;
	}

	/**
	 * theme_exists
	 * Check if a theme exists
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	array
	 */
	public function theme_exists($theme = NULL)
	{
		$theme OR $theme = $this->_theme;

		foreach ($this->_theme_locations as $location)
		{
			if (is_dir($location.$theme))
			{
				return TRUE;
			}
		}

		return FALSE;
	}

	/**
	 * get_layouts
	 * Get all current layouts (if using a theme you'll get a list of theme layouts)
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	array
	 */
	public function get_layouts()
	{
		$layouts = array();

		foreach(glob(self::_find_view_folder().'layouts/*.*') as $layout)
		{
			$layouts[] = pathinfo($layout, PATHINFO_BASENAME);
		}

		return $layouts;
	}


	/**
	 * get_layouts
	 * Get all current layouts (if using a theme you'll get a list of theme layouts)
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	array
	 */
	public function get_theme_layouts($theme = NULL)
	{
		$theme OR $theme = $this->_theme;

		$layouts = array();

		foreach ($this->_theme_locations as $location)
		{
			// Get special web layouts
			if( is_dir($location.$theme.'/views/web/layouts/') )
			{
				foreach(glob($location.$theme . '/views/web/layouts/*.*') as $layout)
				{
					$layouts[] = pathinfo($layout, PATHINFO_BASENAME);
				}
				break;
			}

			// So there are no web layouts, assume all layouts are web layouts
			if(is_dir($location.$theme.'/views/layouts/'))
			{
				foreach(glob($location.$theme . '/views/layouts/*.*') as $layout)
				{
					$layouts[] = pathinfo($layout, PATHINFO_BASENAME);
				}
				break;
			}
		}

		return $layouts;
	}

	/**
	 * layout_exists
	 * Check if a theme layout exists
	 *
	 * @access	public
	 * @param	 string	$view
	 * @return	array
	 */
	public function layout_exists($layout)
	{
		// If there is a theme, check it exists in there
		if ( ! empty($this->_theme) AND in_array($layout, self::get_theme_layouts()))
		{
			return TRUE;
		}

		// Otherwise look in the normal places
		return file_exists(self::_find_view_folder().'layouts/' . $layout . self::_ext($layout));
	}

	// find layout files, they could be mobile or web
	private function _find_view_folder()
	{
		if ($this->_ci->load->get_var('template_views'))
		{
			return $this->_ci->load->get_var('template_views');
		}

		// Base view folder
		$view_folder = APPPATH.'views/';

		// Using a theme? Put the theme path in before the view folder
		if ( ! empty($this->_theme))
		{
			$view_folder = $this->_theme_path.'views/';
		}

		// Would they like the mobile version?
		if ($this->_is_mobile === TRUE AND is_dir($view_folder.'mobile/'))
		{
			// Use mobile as the base location for views
			$view_folder .= 'mobile/';
		}

		// Use the web version
		else if (is_dir($view_folder.'web/'))
		{
			$view_folder .= 'web/';
		}

		// Things like views/admin/web/view admin = subdir
		if ($this->_layout_subdir)
		{
			$view_folder .= $this->_layout_subdir.'/';
		}

		// If using themes store this for later, available to all views
		$this->_ci->load->vars('template_views', $view_folder);

		return $view_folder;
	}

	// A module view file can be overriden in a theme
	private function _find_view($view, array $data, $parse_view = TRUE)
	{
		// Only bother looking in themes if there is a theme

		if ( ! empty($this->_theme))
		{
			foreach ($this->_theme_locations as $location)
			{
				$theme_views = array(
					$this->_theme . '/views/modules/' . $this->_module . '/' . $view,
					$this->_theme . '/views/' . $view
				);

				foreach ($theme_views as $theme_view)
				{
					if (file_exists($location . $theme_view . self::_ext($theme_view)))
					{
						return self::_load_view($theme_view, $this->_data + $data, $parse_view, $location);
					}
				}
			}
		}

// 		foreach (Modules::$locations AS $module_local=>$val){

// 		    if ( realpath($module_path = $module_local.DS.$this->_module.DS.'views')   ){
// 		        bug($module_path);
// 		        $file_path = $module_path.DS.$view;
// 		    }
// 		}


		// Not found it yet? Just load, its either in the module or root view
		return self::_load_view($view, $this->_data + $data, $parse_view);
	}

	public function view($view, $data=NULL, $parse_view = TRUE){
        return self::_find_view($view, (array)$data,$parse_view);
	}

	private function _load_view($view, array $data, $parse_view = TRUE, $override_view_path = NULL)
	{
	    //!realpath(APPPATH."views/$view.php");

	    if(  property_exists($this->_ci, 'smarty') ){
	        $file_path = NULL;

	        if( is_null($file_path) ){
	            if( file_exists($override_view_path.$view) ){
	                $file_path = $override_view_path.$view;
	            } elseif ( file_exists(APPPATH."views/$view") ){
	                $file_path = APPPATH."views/$view";
	            }
	        }
	        if( is_null($file_path) ){
	            $module_check = substr($view, 0,strpos($view, '/'));
	            $file_view = substr($view, strpos($view, '/')+1);

	            foreach (Modules::$locations AS $local=>$val){
	                if ( !is_null($module_path= realpath($local.DS.$module_check.DS.'views')) ){
	                    foreach (glob("$module_path/$file_view.*") AS $file_name){
	                        if( is_null($file_path) ){
	                            $file_path = $file_name;
	                            break;
	                        }
	                    }
	                }
	            }
	        }

	        if( is_null($file_path) ){
	            foreach (Modules::$locations AS $local=>$val){
    	            if ( realpath($module_path = $local.DS.$this->_module.DS.'views')  ){
    	                foreach (glob("$module_path/$view.*") AS $filename){
                            if( !is_null($file_path) ){
                                $file_path = $module_path.DS.$view;
                                break;
                            }
    	                }
    	            }
    	        }
	        }

	        if( is_null($file_path)){
	            $module_current = get_instance()->router->class;
	            foreach (Modules::$locations AS $local=>$val){
	                if ( ($module_path = realpath($local."/$module_current/views") ) != FALSE ){
	                    $file_path = $module_path.DS.$view;
	                }
	            }

	        }

	        if( is_null($file_path) ){
	            $file_path = $view;

	        }

// 	        $file_path = realpath($file_path);

	        return $this->_ci->smarty->view($file_path,$data);
	    }

		// Sevear hackery to load views from custom places AND maintain compatibility with Modular Extensions
		if ($override_view_path !== NULL) {
			if ($this->_parser_enabled === TRUE AND $parse_view === TRUE) {
				// Load content and pass through the parser
				$content = $this->_ci->parser->parse_string($this->_ci->load->file( $override_view_path.$view.self::_ext($view), TRUE ), $data);
			} else {
				$this->_ci->load->vars($data);
				// Load it directly, bypassing $this->load->view() as ME resets _ci_view
				$content = $this->_ci->load->file( $override_view_path.$view.self::_ext($view), TRUE );
			}

		} else { // Can just run as usual
			// Grab the content of the view (parsed or loaded)
			if ($this->_parser_enabled === TRUE AND $parse_view === TRUE){
			    // Parse that bad boy
			    $content = $this->_ci->parser->parse($view, $data, TRUE);

			} else {
			    // None of that fancy stuff for me!
			    $content = $this->_ci->load->view($view, $data, TRUE);
			}

		}

		return $content;
	}

	private function _guess_title()
	{
		$this->_ci->load->helper('inflector');

		// Obviously no title, lets get making one
		$title_parts = array();

		// If the method is something other than index, use that
		if ($this->_method != 'index')
		{
			$title_parts[] = $this->_method;
		}

		// Make sure controller name is not the same as the method name
		if ( ! in_array($this->_controller, $title_parts))
		{
			$title_parts[] = $this->_controller;
		}

		// Is there a module? Make sure it is not named the same as the method or controller
		if ( ! empty($this->_module) AND ! in_array($this->_module, $title_parts))
		{
			$title_parts[] = $this->_module;
		}

		// Glue the title pieces together using the title separator setting
		$title = humanize(implode($this->_title_separator, $title_parts));

		return $title;
	}

	private function _ext($file)
	{
		return pathinfo($file, PATHINFO_EXTENSION) ? '' : '.php';
	}
}

// END Template class