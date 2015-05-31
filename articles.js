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

    $scope.useWord = function (word) {
        console.log("Word: " + word);

        $scope.current_word = word;

        if(word != null)
        {
            $scope.headline = "Artikel zu "+ capitaliseFirstLetter(word);
        }
        else
        {
            $scope.headline = "Aktuelle Artikel";
        }
        $scope.downloadArticles();
    }
    
	function makeTwoDigits(integer)
	{
		if(integer <= 9)
			integer = '0' + integer;
		
		return integer;
	}
	
	function formatDate(str)
	{								
		var match = String(str).match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
		var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
						
		var weekday = new Array(7);
		weekday[0] = "So";
		weekday[1] = "Mo";
		weekday[2] = "Di";
		weekday[3] = "Mi";
		weekday[4] = "Do";
		weekday[5] = "Fr";
		weekday[6] = "Sa";
				
		return weekday[date.getDay()] + " " + makeTwoDigits(date.getDate()) + "." + makeTwoDigits(date.getMonth() + 1) + ".";
	}
	
    $scope.downloadArticles = function ()
    {
        var url = 'http://minutus.de/news/api.php?mode=articles&count=600';
        if($scope.current_word != null && $scope.current_word != "")
            url = 'http://minutus.de/news/api.php?mode=articles&count=600&search=' + $scope.current_word;

        $http.get(url)
            .then(function (res) {
				for(var i=0;i<res.data.data.length;i++)
				{
					res.data.data[i].formatDate = formatDate(res.data.data[i].date);
				}
                $scope.articles = res.data;
            });
    }

    $scope.useWord(getParam());
}]);

