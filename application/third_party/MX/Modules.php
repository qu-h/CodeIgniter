<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

(defined('EXT')) OR define('EXT', '.php');

(defined('DS')) OR define('DS', DIRECTORY_SEPARATOR);

global $CFG;

/* get module locations from config settings or use the default module location and offset */
is_array(Modules::$locations = $CFG->item('modules_locations')) OR Modules::$locations = array(
	APPPATH.'modules/',
	BASEPATH.'../application/modules/'
);

define('SYSTEM_MODULE_PATH', realpath(BASEPATH."../application/modules") );

/* PHP5 spl_autoload */
spl_autoload_register('Modules::autoload');

/**
 * Modular Extensions - HMVC
 *
 * Adapted from the CodeIgniter Core Classes
 * @link	http://codeigniter.com
 *
 * Description:
 * This library provides functions to load and instantiate controllers
 * and module controllers allowing use of modules and the HMVC design pattern.
 *
 * Install this file as application/third_party/MX/Modules.php
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
class Modules
{
	public static $routes, $registry, $locations;

	/**
	* Run a module controller method
	* Output from module is buffered and returned.
	**/
	public static function run($module)
	{
		$method = 'index';

		if(($pos = strrpos($module, '/')) != FALSE)
		{
			$method = substr($module, $pos + 1);
			$module = substr($module, 0, $pos);
		}

		if($class = self::load($module))
		{
			if (method_exists($class, $method))	{
				ob_start();
				$args = func_get_args();
				$output = call_user_func_array(array($class, $method), array_slice($args, 1));
				$buffer = ob_get_clean();
				return ($output !== NULL) ? $output : $buffer;
			}
		}

		log_message('error', "Module controller failed to run: {$module}/{$method}");
	}

	/** Load a module controller **/
	public static function load($module)
	{
		(is_array($module)) ? list($module, $params) = each($module) : $params = NULL;

		/* get the requested controller class name */
		$alias = strtolower(basename($module));

		/* create or return an existing controller from the registry */
		if ( ! isset(self::$registry[$alias]))
		{

			/* find the controller */
			list($class) = CI::$APP->router->locate(explode('/', $module));

			/* controller cannot be located */
			if (empty($class)) return;

			/* set the module directory */
			$path = APPPATH.'controllers/'.CI::$APP->router->directory;

			/* load the controller class */
			$class = $class.CI::$APP->config->item('controller_suffix');

            $file = ucfirst($class);

            if( !file_exists($path.$file) ) {

                if( is_dir($system_module = realpath(SYSTEM_MODULE_PATH.DS.CI::$APP->router->directory)) ){
                    $path = $system_module.DS;
                } elseif ( is_dir($app_module = realpath(APPPATH."/modules/".CI::$APP->router->directory)) ){
                    $path = $app_module.DS;
                }

            }

			self::load_file($file, $path);

			/* create and register the new controller */
			$controller = ucfirst($class);
			self::$registry[$alias] = new $controller($params);
		}

		return self::$registry[$alias];
	}

	/** Library base class autoload **/
	public static function autoload($class)
	{
		/* don't autoload CI_ prefixed classes or those using the config subclass_prefix */
		if (strstr($class, 'CI_') OR strstr($class, config_item('subclass_prefix'))) return;

		/* autoload Modular Extensions MX core classes */
		if (strstr($class, 'MX_'))
		{
			if (is_file($location = dirname(__FILE__).'/'.substr($class, 3).EXT))
			{
				include_once $location;
				return;
			}
			show_error('Failed to load MX core class: '.$class);
		}

		/* autoload core classes */
		if(is_file($location = APPPATH.'core/'.ucfirst($class).EXT))
		{
			include_once $location;
			return;
		}

		/* autoload library classes */
		if(is_file($location = APPPATH.'libraries/'.ucfirst($class).EXT))
		{
			include_once $location;
			return;
		}
	}

	/** Load a module file **/
	public static function load_file($file, $path, $type = 'other', $result = TRUE)
	{
		$file = str_replace(EXT, '', $file);
		$location = $path.$file.EXT;

		if ($type === 'other')
		{
			if (class_exists($file, FALSE))
			{
				log_message('debug', "File already loaded: {$location}");
				return $result;
			}
			include_once $location;
		}
		else
		{
			/* load config or language array */
			include $location;

			if ( ! isset($$type) OR ! is_array($$type))
				show_error("{$location} does not contain a valid {$type} array");

			$result = $$type;
		}
		log_message('debug', "File loaded: {$location}");
		return $result;
	}

	/**
	* Find a file
	* Scans for files located within modules directories.
	* Also scans application directories for models, plugins and views.
	* Generates fatal error if file not found.
	**/
	public static function find($file, $module, $base=null)
	{
/*
 * can not return Module name upcase
 */
	    $file_in = $file;
		$segments = explode('/', $file);

		$file = array_pop($segments);
        $filenamebases = [$file,strtolower($file),ucfirst($file)];

		$file_ext = (pathinfo($file, PATHINFO_EXTENSION)) ? $file : $file.EXT;
        $extension_taget = pathinfo($file, PATHINFO_EXTENSION);
		$path = ltrim(implode('/', $segments).'/', '/');

		$module ? $modules[$module] = $path : $modules = array();

		if( is_dir($module) && is_dir($module.$base) ){

            list($path_check, $file_ext) = self::check_return_find($module.$base,$file_in);
            if( $path_check ){
                return [$path_check, $file_ext];
            }
        }


		if ( !empty($segments))
		{
			$modules[array_shift($segments)] = ltrim(implode('/', $segments).'/','/');
		}

		if( is_file($file_ext) ){
			$file_info = pathinfo($file_ext);
			return array($file_info["dirname"].DS, $file_info["basename"] ,null);
		}

//		foreach (Modules::$locations as $location => $offset) {
        foreach (Modules::$locations as $location) {

			foreach($modules as $module => $subpath) {
                $fullpath = $location.$module.DS.$base.$subpath;
                $path_check1 = realpath($module.'/'.$base.$subpath).DS;

			    if( !is_dir($fullpath) && !is_dir($path_check1) ){
			        continue;
                }

                if( is_file($path_check1.ucfirst($file_ext)) ){
			        return array($path_check1, ucfirst($file_ext));
			    }else if( is_file($path_check1.$file_ext) ){
			        return array($path_check1, $file_ext);
			    }

				$fullpath = realpath($fullpath)."/";
				if( strlen($fullpath) > 1 ){
                    //$files = glob($fullpath.'*['.EXT.']');
                    $files = glob($fullpath.'*');
                    if( !empty($files) ) foreach ($files AS $f){
                        $fname = pathinfo($f);
                        if( is_file($f) && strtolower($fname['filename'].EXT) == strtolower($file_ext) ){
                            return array($fullpath, $fname['filename'],$fname['extension']);
                        }
                    }
                }
//                if (($base == 'libraries/' OR $base == 'models/') AND is_file($fullpath.$file_ext) ) {
//                    return array($fullpath, $file);
//                } else
                if ( is_file($fullpath.$file_ext) ) {
                    /* load non-class files */
                    return array($fullpath, $file_ext,null);
                } else {
                    $segments = explode(DS, $file);
                    $file_in_name = array_pop($segments);

                    foreach (glob("$file.*") as $filename) {
                        $pathinfo = pathinfo($filename);
                        $ext = pathinfo($filename, PATHINFO_EXTENSION);
                        
                        if( $pathinfo["filename"]==$file_in_name AND strlen($pathinfo["filename"]) > 0 ){
  
                           return array($pathinfo["dirname"].DS, $pathinfo["basename"],$pathinfo["extension"]);
                        }
                    }
                }
			}
		}


		return array(FALSE, $file,null);
	}

	/**
	 * Return for Find a file
	 **/
	private static function check_return_find($path="",$fileCheck=""){

        $segments = explode('/', $fileCheck);
        if( count($segments) > 0 ){

            $fileCheck = array_pop($segments);
            $path = $path.ltrim(implode('/', $segments).'/', '/');
        }
        if( substr("$path", -1) != DS){
            $path .= DS;
        }
        foreach (glob("$path*") as $filename) {
            $pathinfo = pathinfo($filename);
            if( strtolower($pathinfo["filename"])==strtolower($fileCheck) AND strlen($pathinfo["filename"]) > 0 ){
                return array($pathinfo["dirname"].DS, $pathinfo["basename"],$pathinfo["extension"]);
            }
        }

        return array(FALSE, $fileCheck,null);
	}

	/** Parse module routes **/
	public static function parse_routes($module, $uri)
	{
		/* load the route file */
		if ( ! isset(self::$routes[$module]))
		{
			if (list($path) = self::find('routes', $module, 'config/'))
			{
				$path && self::$routes[$module] = self::load_file('routes', $path, 'route');
			}
		}

		if ( ! isset(self::$routes[$module])) return;

		/* parse module routes */
		foreach (self::$routes[$module] as $key => $val)
		{
			$key = str_replace(array(':any', ':num'), array('.+', '[0-9]+'), $key);

			if (preg_match('#^'.$key.'$#', $uri))
			{
				if (strpos($val, '$') !== FALSE AND strpos($key, '(') !== FALSE)
				{
					$val = preg_replace('#^'.$key.'$#', $val, $uri);
				}
				return explode('/', $module.'/'.$val);
			}
		}
	}

	public static function is_directory($directory,$module){
	    $moduleFullPath = null;
        foreach (glob($directory."/*",GLOB_ONLYDIR) as $dir) {
            $folderName = pathinfo($dir,PATHINFO_BASENAME);
            if( strtolower($folderName) == strtolower($module) ){
                $module = $folderName;
                $moduleFullPath = $dir;
            }
        }
        return [$module,$moduleFullPath];
    }
}