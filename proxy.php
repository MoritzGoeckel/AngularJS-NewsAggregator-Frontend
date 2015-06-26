<?php

//Caching
require_once("phpfastcache/phpfastcache.php");
phpFastCache::setup("storage","auto");
$cache = phpFastCache();

function url_get_contents ($Url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $Url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);
    curl_close($ch);
    return $output;
}

if(isset($_GET['url'])){
    $url = urldecode($_GET['url']);

    $queryId = $_GET['url'];
    $output = $cache->get($queryId);
    if($output == null) {
         if(ini_get('allow_url_fopen'))
            $output = file_get_contents($url);
        elseif(function_exists('curl_init'))
    	    $output = url_get_contents ($url);
        else
	        $output = "allow_url_fopen and curl are not enabled on the server. Enable at least one of these for the proxy to work.";   
        
        $cache->set($queryId, $output, 60 * 60);
    }
    echo $output;
}
else {
    echo "Kein url parameter gefunden";
}

?>