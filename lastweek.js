var App = angular.module('lastweek', []);

App.controller('showDataController', ['$scope', '$http', function($scope, $http) {

    function getParam()
    {
        if(String(window.location).indexOf('#') != -1) {
            var urlParts = String(window.location).split('#');
            return urlParts[urlParts.length - 1];
        }
        else
            return null;
    }

    $scope.getToday = function()
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

    $scope.getTodayMinus = function(days)
    {
        var date = new Date();
        date.setDate(date.getDate() - days);

        var m = String(date.getMonth() + 1);
        if(m.length == 1)
            m = 0 + '' + m;

        var d = String(date.getDate());
        if(d.length == 1)
            d = 0 + '' + d;

        return String(date.getFullYear()) + '' + m + '' + d;
    }

    $scope.getDayMinus = function(days)
    {
        var date = new Date();
        date.setDate(date.getDate() - days);

        var weekday = new Array(7);
        weekday[0]=  "So";
        weekday[1] = "Mo";
        weekday[2] = "Di";
        weekday[3] = "Mi";
        weekday[4] = "Do";
        weekday[5] = "Fr";
        weekday[6] = "Sa";

        return weekday[date.getDay()] + " " + date.getDate() + "." + (date.getMonth() + 1) + ".";
    }

    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.downloadWords = function (date)
    {
        var url = 'http://minutus.de/news/api.php?mode=words&count=30&date=' + date; //Heute

        $http.get(url)
            .then(function (res) {
                $scope.words[date] = res.data;
            });
    }
	
	$scope.downloadWordsAllWeek = function ()
    {
        var url = 'http://minutus.de/news/api.php?mode=timeframe&count=43&start=' + $scope.getTodayMinus(6) +'&end=' + $scope.getTodayMinus(0); //Heute

        $http.get(url)
            .then(function (res) {
                $scope.words[0] = res.data;
            });
    }

    $scope.words = new Array();

	$scope.downloadWordsAllWeek();
    for (i = 0; i < 7; i++) {
        $scope.downloadWords($scope.getTodayMinus(i));
    }
}]);

