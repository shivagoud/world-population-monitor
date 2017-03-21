var app = angular.module('populationMonitorApp', []);

app.controller('chartCtrl',function($scope,$http) {
    $scope.message= "Hello world";
	$scope.populationData = ["Apple","Orage","Banana"];
	$scope.refresh = function(){
		//test with https://www.w3schools.com/angular/welcome.htm
		$http({
			method : "GET",
			url : $scope.url
		}).then(function(response) {
			console.log(response);
			$scope.populationData = response.data;
		},function(error){
			console.log("Error");
			console.log(error);
		});
	}
});