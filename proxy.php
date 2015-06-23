<?php

if(isset($_GET['url'])){
    $url = urldecode($_GET['url']);
    echo file_get_contents($url);
}
else {
    echo "Kein url parameter gefunden";
}

?>