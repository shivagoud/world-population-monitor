var app = angular.module('populationMonitorApp', []);

app.controller('chartCtrl',function($scope,$http,$sce) {
    $scope.message= "Hello world";
	$scope.populationData = ["Apple","Orange","Banana"];
	$scope.refresh = function(){
		var url = "http://climatedataapi.worldbank.org/climateweb/rest/v1/country/mavg/tas/1980/1999/IND.json?callback=mycallback";
		$sce.trustAsResourceUrl(url);
		
		//global variable
		mycallback = function(res){
			console.log("success");
			$scope.populationData = res;
		}
		
		$http.jsonp(url)
		.then(function(response) {
			console.log(response);
		},function(error){
			console.log("Error");
			console.log(error);
		});
	}
});
