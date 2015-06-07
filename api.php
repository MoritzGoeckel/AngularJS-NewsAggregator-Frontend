<?php

header('Content-Type: application/json; charset=utf-8');

include("dbconnect.php");
include("functions.php");

if($_GET['mode'] == "words" && isset($_GET['count']))
{
    echo(getWords($con, $_GET['count'], $_GET['date'], $_GET['search']));
    //Example: api.php?mode=words&count=10&search=haus&date=20141120
}
elseif($_GET['mode'] == "articles" && isset($_GET['count']))
{
    echo(getArticles($con, $_GET['count'], $_GET['search']));
    //Example: api.php?mode=articles&count=10&search=haus&date=20141120
}
elseif($_GET['mode'] == "chart" && isset($_GET['word']))
{
    echo(getChart($con, $_GET['word']));
    //Example: http://minutus.de/news/api.php?mode=chart&word=is
}
elseif($_GET['mode'] == "timeframe" && isset($_GET['start']) && isset($_GET['end']) && isset($_GET['count']))
{
    echo(getWordsInTimeframe($con, $_GET['count'], $_GET['start'], $_GET['end']));
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