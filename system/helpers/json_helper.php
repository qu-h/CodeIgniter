
<?php defined('BASEPATH') OR exit('No direct script access allowed');


function jsonData($data){
	header('Pragma: no-cache');
	header('Cache-Control: no-store, no-cache, must-revalidate');
	//header('Content-Disposition: inline; filename="files.json"');
	header('X-Content-Type-Options: nosniff');
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: OPTIONS, HEAD, GET, POST, PUT, DELETE');
	header('Access-Control-Allow-Headers: X-File-Name, X-File-Type, X-File-Size');
	echo json_encode($data);
	exit;
}