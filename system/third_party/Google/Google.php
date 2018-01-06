<?php (defined('BASEPATH')) OR exit('No direct script access allowed');

require_once 'vendor/autoload.php';
putenv('GOOGLE_APPLICATION_CREDENTIALS='.BASEPATH."third_party/Google/GiaiphapIct-3a4b012be576.json");
    
$client = new Google_Client();
$client->useApplicationDefaultCredentials();
$client->setScopes(['https://www.googleapis.com/auth/drive.metadata.readonly']);

//$service = new Google_Service_Books($client);
//$optParams = array('filter' => 'free-ebooks');
//$results = $service->volumes->listVolumes('Henry David Thoreau', $optParams);
//
//foreach ($results as $item) {
//    echo $item['volumeInfo']['title'], "<br /> \n";
//}

$q = "mimeType = 'application/vnd.google-apps.folder'";

$service = new Google_Service_Drive($client);
$parameters = array(
    'pageSize' => 10,
//    'q'=>$q

);

$dr_results = $service->files->listFiles($parameters);

foreach ($dr_results as $item) {
    echo $item->title, "<br /> \n";
}