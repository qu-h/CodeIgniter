<?php (defined('BASEPATH')) OR exit('No direct script access allowed');


class CI
{
	public static $APP;

	public function __construct() {

		/* assign the application instance */
		self::$APP = CI_Controller::get_instance();

	}
}

/* create the application object */
new CI;