var App = angular.module('app', []);

App.controller('searchController', ['$scope', '$http', function($scope, $http) {

    function getParam()
    {
        if(String(window.location).indexOf('#') != -1) {
            var urlParts = String(window.location).split('#');
            return urlParts[urlParts.length - 1];
        }
        else
            return null;
    }

    function getToday()
    {
        var date = new Date();

        var m = String(date.getMonth() + 1);
        if(m.length == 1)
            m = 0 + '' + m;

        var d = String(date.getDate());
        if(d.length == 1)
            d = 0 + '' + d;

        return String(date.getFullYear()) + '' + m + '' + d;
    }

    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.filterEven = function (index) {
        return function (item) {
            return index++ % 2 == 1;
        };
    };

    $scope.useWord = function (word) {
        console.log("Word: " + word);

        $scope.current_word = word;

        if(word != null)
        {
            $scope.createChart();
            $scope.headline = "Artikel zu "+ capitaliseFirstLetter(word);
        }
        else
        {
            $scope.headline = "Aktuelle Artikel";
        }

        $scope.downloadWords();
        $scope.downloadArticles();
    }

    $scope.downloadWords = function ()
    {
        var url = 'http://minutus.de/news/api.php?mode=words&count=88&date=' + getToday(); //Heute

        console.log(url);

        if($scope.word_search != null && $scope.word_search != "")
            url = 'http://minutus.de/news/api.php?mode=words&count=88&search=' + $scope.word_search;

        $http.get(url)
            .then(function (res) {
                res.data.data.unshift({word:'dummy', count:'null!'}); //Weil 0 weder odd noch even ist!
                $scope.words = res.data;
            });
    }

    $scope.downloadArticles = function ()
    {
        var url = 'http://minutus.de/news/api.php?mode=articles&count=41';
        if($scope.current_word != null && $scope.current_word != "")
            url = 'http://minutus.de/news/api.php?mode=articles&count=23&search=' + $scope.current_word;

        $http.get(url)
            .then(function (res) {
                $scope.articles = res.data;
            });
    }

    $scope.createChart = function ()
    {
        if($scope.current_word != null && $scope.current_word != "") {
            $http.get('http://minutus.de/news/api.php?mode=chart&word=' + $scope.current_word)
                .then(function (res) {

                    var chartData = "[";
                    for(i = 0; i < res.data.data.dates.length; i++)
                    {
                      var item = '{ "x": ' + i + ", " + ' "y": ' + res.data.data.values[i] + "}";
                      if(i < res.data.data.dates.length - 1)
                        item += ", ";
                      chartData += item;
                    }
                    chartData += "]";

                    console.log("Chartdata: " + chartData);

                    var chart = new Chart("chartCanvas");

                    chart.setData(chartData);
                    chart.redraw();
                });
        }
    }

    $scope.useWord(getParam());
}]);
