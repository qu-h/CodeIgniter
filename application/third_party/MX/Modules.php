<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

(defined('EXT')) OR define('EXT', '.php');
(defined('DS')) OR define('DS', DIRECTORY_SEPARATOR);

global $CFG;

/* get module locations from config settings or use the default module location and offset */
is_array(Modules::$locations = $CFG->item('modules_locations')) OR Modules::$locations = array(
	APPPATH.'modules/' => '../modules/',
    BASE_APP_PATH.'modules/' => "",
    APPPATH.'../modules/' => '../../modules/',
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
     * @param $module
     * @return false|mixed|string
     */
	public static function run($module)
	{
		$method = 'index';

		if(($pos = strrpos($module, '/')) != FALSE)
		{
			$method = substr($module, $pos + 1);
			$module = substr($module, 0, $pos);
		}

		if( ($class = self::load($module)) && method_exists($class, $method))	{
            ob_start();
            $args = func_get_args();
            $output = call_user_func_array(array($class, $method), array_slice($args, 1));
            $buffer = ob_get_clean();
            return ($output !== NULL) ? $output : $buffer;
		} else {
		    dd("can not run module:$module",'Module:run 81');
        }

		log_message('error', "MX/Modules ".__LINE__.": Module controller failed to run: {$module}/{$method}");
	}

    /**
     * Load a module controller
     * @param $module
     */
	public static function load($module)
	{
        if (version_compare(phpversion(), '7.2', '<')) {
            (is_array($module)) ? list($module, $params) = each($module) : $params = NULL;
        } else {
            if( is_array($module) ){
                $params  = reset($module);
                $module = key($module);
            } else {
                $params = NULL;
            }
        }
        log_message('DEBUG', "MX/Modules::load ".__LINE__.": module: {$module}");

		/* get the requested controller class name */
		$alias = strtolower(basename($module));

		/* create or return an existing controller from the registry */
		if ( ! isset(self::$registry[$alias]))
		{
			/* find the controller */
			list($class) = CI::$APP->router->locate(explode('/', $module));
            $moduleController = CI::$APP->router->directory;
			/* controller cannot be located */

			if (empty($class))
			    return;

			/* set the module directory */
			$path = APPPATH.'controllers/'.$moduleController;
			/* load the controller class */
			$class = $class . CI::$APP->config->item('controller_suffix');

            $file = ucfirst($class);

            if( !file_exists($path.$file) ) {
                foreach (Modules::$locations AS $modulePath => $moduleOffset){
                    if( is_dir("$modulePath/$moduleController") ){
                        $path = realpath("$modulePath/$moduleController").DS;
                    }
                }
                //$path = SYSTEM_MODULE_PATH.DS.CI::$APP->router->directory;
            }

			self::load_file($file, $path);
			/* create and register the new controller */
			$controller = ucfirst($class);

			self::$registry[$alias] = new $controller($params);

			$fileModel = $controller."Model";
			$fileModelPath = $path."../models/";
			if( file_exists($fileModelPath.$fileModel.".php") ){
                self::load_file($fileModel, $fileModelPath);
                self::$registry[$alias]->model = new $fileModel();
//			    dd("controller = $controller ".$fileModel);
            }
//			dd("file : $file, path : $path",false);
		} else {
		    //bug(self::$registry,"has registry alias:$alias");
        }

		return self::$registry[$alias];
	}

    /**
     * Library base class autoload
     * @param $class
     */
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
            //bug("module::load_file location=$location");
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
	public static function find($file, $module, $base=null,$returnBaseName=false)
	{
	    $fileNameDebug = 'logindsds';
	    $file_in = $file;

	    if( file_exists($file) ){
	        $fileInfo = pathinfo($file);
	        return [$fileInfo['dirname'].DS,$fileInfo['basename']];
        }
		$segments = explode('/', $file);

		$file = array_pop($segments);
		$file_ext = (pathinfo($file, PATHINFO_EXTENSION)) ? $file : $file.EXT;
        $extension_taget = pathinfo($file, PATHINFO_EXTENSION);
		$path = ltrim(implode('/', $segments).'/', '/');

		$module ? $modules[$module] = $path : $modules = array();

		if ( ! empty($segments))
		{
			$modules[array_shift($segments)] = ltrim(implode('/', $segments).'/','/');
		}

		foreach (Modules::$locations as $location => $offset) {
		    $folders = self::sub_directorys($location);

			foreach($modules as $module => $subpath) {
			    if( !is_dir($location.$module) ){
                    list($moduleFolder,$modulePath) = self::is_directory($location,$module);
                    if( $moduleFolder ){
                        $module = $moduleFolder;
                    }
                    if( $file_in == $fileNameDebug ) {
                        //list($fileCheck,$pathCheck) = Modules::is_file_in_dir($location.$module.DS.$base,$file,$returnBaseName);
                        bug("check real location:$location module:$module moduleFolder=$moduleFolder base:$base file_in:$file_in");
                    }
                }
                $fileCheck = null;
			    if( $file_in == $fileNameDebug ){
                    $path = $location.$module.DS.$subpath.DS.$base;
                }

                if( is_dir($location.$subpath.DS.$base) ){
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($location.$subpath.DS.$base,$file,$returnBaseName);
                    //bug('246');
                } else if ( is_dir($checkDir=$location.$module.DS.$base.$subpath) ) {
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($checkDir,$file,$returnBaseName);
                    if( $fileCheck ){
                        return [$pathCheck,$fileCheck];
                    }
                }

                if( is_dir($location.$module) ){
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($location.$module.DS.$base,$file,$returnBaseName);
                } else if ( is_dir($module) ){
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($module.DS.$base,$file,$returnBaseName);
                } else {
                    if( $file_in == $fileNameDebug ) {
                        bug("check ====".__LINE__." :$location module:$module $moduleFolder");
                    }
                }

                if( !$fileCheck ){
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($module,$file_in,$returnBaseName);
                }
			    //if( in_array($module,$folders) ){


                if( $file_in == $fileNameDebug ) {
                    bug("======= check 264: dir=".$location.$module.DS.$base." file=$fileCheck");
                    if( is_dir(($checkDir=$location.$module.DS.$base) ) ){
                        list($fileCheck,$pathCheck) = Modules::is_file_in_dir($checkDir,$file,$returnBaseName);
                        if( $file_in == $fileNameDebug ) {
                            bug("278 fileCheck=$fileCheck checkDir=$checkDir");
                        }
                    }
                }
                    if( $fileCheck ){
                        return [$pathCheck,$fileCheck];
                    }

                //}

                if( is_dir($module.DS.$subpath) ){
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($module.DS.$subpath,$file);
                    if( $fileCheck ){
                        return [$pathCheck,$fileCheck];
                    }

                }
                $realPath = $module."/$subpath/$subpath";

			    if( $realPath ){
                    list($fileCheck,$pathCheck) = Modules::is_file_in_dir($realPath,$file,$returnBaseName);
                    //bug("===check readpath module 252 pathCheck=$pathCheck fileCheck=$fileCheck");
                    if( $fileCheck ){
                        return [$pathCheck,$fileCheck];
                    }
                }

                $path_check1 = $module.'/'.$base.$subpath;

			    if( is_file($path_check1.ucfirst($file_ext)) ){
			        return array($path_check1, ucfirst($file_ext));
			    }

				$fullpath = $location.$module.'/'.$base.$subpath;
				$fullpath = realpath($fullpath)."/";


                if (($base == 'libraries/' OR $base == 'models/') AND is_file($fullpath.ucfirst($file_ext))) {
                    return array($fullpath, ucfirst($file));
                } else if ( is_file($fullpath.$file_ext) ) { /* load non-class files */
                    return array($fullpath, $file_ext);
                }


			}
		}
		return array(FALSE, $file);
	}

	/**
	 * Return for Find a file
	 **/
	private function check_return_find(){

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

    static function sub_directorys($path){
        $folders = [];
        foreach (glob($path."/*",GLOB_ONLYDIR) as $dir) {
            $folderName = pathinfo($dir,PATHINFO_BASENAME);
            $folders[] = $folderName;
        }
        return $folders;
    }

    public static function is_file_in_dir($path,$file,$returnBaseName=false){
        $moduleFullPath = $module = FALSE;

        foreach (glob($path."/*") as $dir) {
            $folderName = pathinfo($dir);
            if( strtolower($folderName['filename']) == strtolower($file) ){
                $module = $returnBaseName ? $folderName['basename'] : $folderName['filename'];
                $moduleFullPath = realpath($folderName['dirname']).DS;
            }
        }

        if( strlen($module) < 1 ){
            $filescheck = glob($path."/$file.*");

            if( !empty($filescheck) ){
                foreach ($filescheck as $dir) {
                    if( strlen($module) > 0 ){
                        break;
                    }
                    $folderName = pathinfo($dir);
                    $module = $returnBaseName ? $folderName['basename'] : $folderName['filename'];
                    $moduleFullPath = realpath($folderName['dirname']).DS;
                }
            }
        }
        return [$module,$moduleFullPath];
    }

    static function getRealPathApp($path){
	    $from = str_replace([DIRECTORY_SEPARATOR,"\\"],DS,APPPATH);
	    $from = realpath($from);
	    $from = explode(DS,$from);
        $path = str_replace([DIRECTORY_SEPARATOR,"\\"],DS,$path);
        $path = realpath($path);
        $path = explode(DS,$path);

        $modulePath = $diff = "";

        foreach ($path AS $index=>$name){
            if( array_key_exists($index,$from) && $from[$index] == $name ){

            } else {
                $modulePath .= DS.$name;
                if( array_key_exists($index,$from) ){
                    $diff .= "..".DS;
                }
            }
        }

        $modulePath = substr($modulePath, 1);
        $diffPath = $diff.$modulePath.DS;

        if( is_dir(APPPATH.$diffPath) ){
            return "../$diffPath";
        }

        return false;
    }
}