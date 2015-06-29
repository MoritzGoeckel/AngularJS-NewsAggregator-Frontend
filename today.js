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

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    $scope.filterEven = function (index) {
        return function (item) {
            return index++ % 2 == 1;
        };
    };
    
    $scope.downloadPictures = function(word){
        //Make the word web friendly :)
        var webFriendlyWord = word;
        webFriendlyWord = webFriendlyWord.toLowerCase();
        webFriendlyWord = webFriendlyWord.replace("ß", "ss");
        webFriendlyWord = webFriendlyWord.replace("ö", "oe");
        webFriendlyWord = webFriendlyWord.replace("ü", "ue");
        webFriendlyWord = webFriendlyWord.replace("ä", "ae");
        
        //Build the uri
        var uri = "http://api.tumblr.com/v2/tagged?tag=" + webFriendlyWord + "&api_key=fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4";
        uri = encodeURIComponent(uri); //Encode it
        uri = "proxy.php?url=" + uri; //Route it thought the proxy for chaching and the browser security settings
        
        //Handle the response by putting the urls into an array
        $.get( uri, function( str ) {
            var picturesUrls = []; 
            
            //parse the data from tumblr
            data = JSON.parse(str);
            if(data.meta.status == 200)
            {
                for (responseItemIndex = 0; (responseItemIndex < data.response.length && picturesUrls.length < 20); ++responseItemIndex) {
                    for (photoIndex = 0; (data.response[responseItemIndex].photos != null && photoIndex < data.response[responseItemIndex].photos.length); ++photoIndex)
                    {
                        var sizes = data.response[responseItemIndex].photos[photoIndex];
                        for (sizeIndex = 0; sizeIndex < sizes.alt_sizes.length; ++sizeIndex) 
                        {
                            var height = sizes.alt_sizes[sizeIndex].height;
                            if(height >= 150 && height <= 400)
                            {
                                picturesUrls.push(sizes.alt_sizes[sizeIndex].url);
                                break;
                            }
                        }
                    }
                }
                
                $scope.pictures = picturesUrls;
            }
        });
    };

    $scope.useWord = function (word) {
        console.log("Word: " + word);

        $scope.current_word = word;

        if(word != null)
        {
            $scope.createChart();
            $scope.headline = "Artikel zu "+ capitaliseFirstLetter(word);
            document.getElementById("chartCanvas").style.height = "155px";
            $scope.downloadPictures(word);
        }
        else
        {
            $scope.headline = "Aktuelle Artikel";
            document.getElementById("chartCanvas").style.height = "0px";
        }

        $scope.downloadWords();
        $scope.downloadArticles();
    }

    $scope.downloadWords = function ()
    {
        var url = 'http://minutus.de/news/api.php?mode=words&count=88&date=' + getToday(); //Heute

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
                      var dateStr = res.data.data.dates[i];
                      var date = new Date(dateStr.substr(0, 4), dateStr.substr(4, 2), dateStr.substr(6, 2), 0, 0, 0, 0);
                      
                      var timestamp = (date.getTime() / 1000);
                      
                      var item = '{ "x": ' + timestamp + ", " + ' "y": ' + res.data.data.values[i] + "}";
                      if(i < res.data.data.dates.length - 1)
                        item += ", ";
                      chartData += item;
                    }
                    chartData += "]";
                    
                    var chart = new Chart("chartCanvas");

                    chart.setData(chartData);
                    chart.redraw();
                });
        }
    }

    //Init
    $scope.useWord(getParam());
}]);
