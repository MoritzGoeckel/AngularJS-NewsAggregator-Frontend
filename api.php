<?php

header('Content-Type: application/json; charset=utf-8');

//Caching
require_once("phpfastcache/phpfastcache.php");
phpFastCache::setup("storage","auto");
$cache = phpFastCache();

include("dbconnect.php");
include("functions.php");

//Example: api.php?mode=words&count=10&search=haus&date=20141120
if($_GET['mode'] == "words" && isset($_GET['count']))
{
    $queryId = $_GET['count'] . "_" . $_GET['date'] . "_" . $_GET['search'];
    $output = $cache->get($queryId);
    if($output == null) {
        $output = getWords($con, $_GET['count'], $_GET['date'], $_GET['search']);
        $cache->set($queryId, $output, 60 * 60);
    }
    echo($output);
}
//Example: api.php?mode=articles&count=10&search=haus&date=20141120
elseif($_GET['mode'] == "articles" && isset($_GET['count']))
{
    $queryId = $_GET['count'] . "_" . $_GET['search'];
    $output = $cache->get($queryId);
    if($output == null) {
        $output = getArticles($con, $_GET['count'], $_GET['search']);
        $cache->set($queryId, $output, 60 * 60);
    }
    echo($output);
}
//Example: http://minutus.de/news/api.php?mode=chart&word=is
elseif($_GET['mode'] == "chart" && isset($_GET['word']))
{
    $queryId = $_GET['word'];
    $output = $cache->get($queryId);
    if($output == null) {
        $output = getChart($con, $_GET['word']);
        $cache->set($queryId, $output, 60 * 60 * 6);
    }
    echo($output);
}
elseif($_GET['mode'] == "timeframe" && isset($_GET['start']) && isset($_GET['end']) && isset($_GET['count']))
{
    $queryId = $_GET['count'] . "_" . $_GET['start'] . "_" . $_GET['end'];
    $output = $cache->get($queryId);
    if($output == null) {
        $output = getWordsInTimeframe($con, $_GET['count'], $_GET['start'], $_GET['end']);
        $cache->set($queryId, $output, 60 * 60);
    }
    echo($output);
}
else
{
    ?>

    Example: api.php?mode=words&count=10&search=haus&date=20141120<br />
    Example: api.php?mode=articles&count=10&search=haus&date=20141120<br />
    Example: api.php?mode=chart&word=is
	Example: api.php?mode=timeframe&count=10&start=20141120&end=2141121

    <?php
}

?>