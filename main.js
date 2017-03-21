var app = angular.module('populationMonitorApp', []);

app.controller('chartCtrl',function($scope,$http,$sce) {
    $scope.message= "Hello world";
	$scope.populationData = ["Apple","Orange","Banana"];
	$scope.refresh = function(){
		var indicators = ["SP.POP.TOTL","NY.GDP.PCAP.CD","SP.DYN.LE00.IN"];
		var countries = {};
		var loaded  = false;
		var url_prefix  = "http://api.worldbank.org/countries/all/indicators/";
		$sce.trustAsResourceUrl(url_prefix);
		
		//global variable
		callback_success=[false,false,false];
		get_population_data = function(res){
			console.log("success");
			res[1].forEach(function(entry,index) {
				var country_id = entry["country"]["id"];
				var indicator_id = entry["indicator"]["id"];
				var value = entry["value"];
				if(countries[country_id] === undefined)
					countries[country_id] = {};
				countries[country_id][indicator_id] = value;
				
				if(index==0){
					for(i=0;i<3;i++)
						if(indicator_id==indicators[i])
							callback_success[i] = true;
				}
			});
			if(callback_success[0]&&callback_success[1]&&callback_success[2]){
				console.log(countries);
				$scope.populationData = countries;
			}
		}
		
		indicators.forEach(function(ind){
			var url_end = "?date=2014:2014&per_page=500&format=jsonP&prefix=get_population_data";
			$http.jsonp(url_prefix + ind + url_end);
		});
		
	}
});
