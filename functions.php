<?php


function getWordsInTimeframe($db, $count, $start, $end)
{
    $output_array = array("start" => utf8_encode($start), "end" => utf8_encode($end), "data" => array());

    $result = mysqli_query($db, "SELECT *, sum(count) as count FROM words WHERE date >= " . $start . " AND date <= " . $end . " GROUP BY word ORDER BY count DESC LIMIT " . utf8_decode($count));
    while ($row = mysqli_fetch_array($result)) {
        array_push ($output_array["data"], array("word" => utf8_encode($row['word']), "count" => utf8_encode($row['count'])));
    }

    return json_encode($output_array);
}

function getWords($db, $count, $date = null, $search = null)
{
    if ($date != null)
        $dateQuery = "date = '" . utf8_decode($date) . "'";
    else
        $dateQuery = "1";

    if ($search != null)
        $searchQuery = "word LIKE '%" . utf8_decode($search) . "%'";
    else
        $searchQuery = "1";

    $output_array = array("date" => utf8_encode($date), "search" => utf8_encode($search), "data" => array());

    $result = mysqli_query($db, "SELECT *, sum(count) as count FROM words WHERE " . $dateQuery . " AND " . $searchQuery . " GROUP BY word ORDER BY count DESC LIMIT " . utf8_decode($count));
    while ($row = mysqli_fetch_array($result)) {
        array_push ($output_array["data"], array("word" => utf8_encode($row['word']), "count" => utf8_encode($row['count'])));
    }

    return json_encode($output_array);
}

function getArticles($db, $count, $search = null)
{
    if ($search != null)
        $result = mysqli_query($db, "SELECT * FROM artikel WHERE
                    title LIKE '% " . utf8_decode($search) . " %' OR
                    title LIKE '" . utf8_decode($search) . " %' OR
                    title LIKE '% " . utf8_decode($search) . "' OR

                    title LIKE '% " . utf8_decode($search) . "-%' OR
                    title LIKE '%-" . utf8_decode($search) . " %' OR

                    title LIKE '%-" . utf8_decode($search) . "-%' OR
                    title LIKE '" . utf8_decode($search) . "-%' OR
                    title LIKE '%-" . utf8_decode($search) . "' OR

                    description LIKE '% " . utf8_decode($search) . " %' OR
                    description LIKE '" . utf8_decode($search) . " %' OR
                    description LIKE '% " . utf8_decode($search) . "' OR

                    description LIKE '% " . utf8_decode($search) . "-%' OR
                    description LIKE '%-" . utf8_decode($search) . " %' OR

                    description LIKE '%-" . utf8_decode($search) . "-%' OR
                    description LIKE '" . utf8_decode($search) . "-%' OR
                    description LIKE '%-" . utf8_decode($search) . "'

                    ORDER BY time DESC LIMIT " . $count);
    else
        $result = mysqli_query($db, "SELECT * FROM artikel ORDER BY time DESC LIMIT " . utf8_decode($count));

    $output_array = array("search" => utf8_encode($search), "data" => array());

    while ($row = mysqli_fetch_array($result)) {
        array_push ($output_array["data"], array("title" => utf8_encode($row['title']), "description" => utf8_encode($row['description']), "link" => utf8_encode($row['link']), "date" => utf8_encode($row['time']), "source" => utf8_encode($row['source'])));
    }

    return json_encode($output_array);
}

function getChart($db, $word)
{
    $chart_dates =  array();
    $chart_values = array();

    $result = mysqli_query($db, "SELECT * FROM `words` WHERE word = '" . utf8_decode($word) . "' ORDER BY date");
    while ($row = mysqli_fetch_array($result)) {
        array_push ($chart_dates,  utf8_encode($row['date']));
        array_push ($chart_values,  utf8_encode($row['count']));
    }

    return json_encode(array("word" => utf8_encode($word), "data" => array("dates" => $chart_dates, "values" => $chart_values)));
}

?>