<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

/* load MX core classes */
require_once dirname(__FILE__).'/Lang.php';
require_once dirname(__FILE__).'/Config.php';

class CI extends CI_Controller
{
	public function __construct() {
		parent::__construct();
	}
}

/* create the application object */
new CI;