<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/*
| -------------------------------------------------------------------
|  Google API Configuration
| -------------------------------------------------------------------
|
| To get API details you have to create a Google Project
| at Google API Console (https://console.developers.google.com)
|
|  client_id         string   Your Google API Client ID.
|  client_secret     string   Your Google API Client secret.
|  redirect_uri      string   URL to redirect back to after login.
|  application_name  string   Your Google application name.
|  api_key           string   Developer key.
|  scopes            string   Specify scopes
*/
//$config['google_client_id']        = env('APP_CLIENT_ID');
//$config['google_client_secret']    = env('APP_CLIENT_SECRET');
//$config['google_redirect_uri']     = 'http://admin.giaiphapict.com/admin/oauth-google';
//$config['google_application_name'] = 'Login to GiaiPhapICT.com';
//$config['google_api_key']          = '';
//$config['google_scopes']           = [];

$config['google_client_id']=env('APP_CLIENT_ID');
$config['google_client_secret']=env('APP_CLIENT_SECRET');
$config['google_redirect_url']= base_url().'oauth-google';
//dd($config['google']);