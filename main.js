var app = angular.module('populationMonitorApp', []);

app.controller('chartCtrl',function($scope,$http,$sce) {
    $scope.message= "Mouse over the bubbles to see the country code and population";
	$scope.populationData = { "IN": {
				"SP.POP.TOTL": 1295291543,
				"SP.DYN.LE00.IN": 68.0138048780488,
				"NY.GDP.PCAP.CD": 1576.81766887286
			}, "PK": {
				"SP.POP.TOTL": 185044286,
				"SP.DYN.LE00.IN": 66.1833658536585,
				"NY.GDP.PCAP.CD": 1320.55354981784
			}};
	
	var indicators = ["SP.POP.TOTL","NY.GDP.PCAP.CD","SP.DYN.LE00.IN"];
	$scope.refresh = function(){
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
				countries[country_id][indicator_id] = +value;
				
				if(index==0){
					for(i=0;i<3;i++)
						if(indicator_id==indicators[i])
							callback_success[i] = true;
				}
			});
			if(callback_success[0]&&callback_success[1]&&callback_success[2]){
				console.log(countries);
				$scope.message = "Loaded data from World Bank server...";
				$scope.populationData = "";
				$scope.drawPopulationChart(countries);
			}
		}
		
		indicators.forEach(function(ind){
			var url_end = "?date=2014:2014&per_page=500&format=jsonP&prefix=get_population_data";
			$http.jsonp(url_prefix + ind + url_end);
		});
		
	}

	
	$scope.drawPopulationChart = function(data){
		
		var dataset = [];
		for (var x in data) {
			if(data[x][indicators[2]]<10)
				console.log("zero life, skipping ",data[x]);
			else if(data[x][indicators[0]]<1000000)
				console.log("very low population, skipping", data[x]);
			else{
				data[x]["country"]=x;
				dataset.push(data[x]);
			}
		}
		
		var width=800,height=500,margin=50;
		var svg = d3.select("#svgPopulation").attr("width", width).attr("height", height); 
		svg.selectAll("*").remove();
	 
		var x = d3.scaleLinear().domain(d3.extent(dataset, function (d){  
				return d[indicators[1]];
			}))
			.range([0, width-2*margin]);  // Range maps the domain to values from 0 to the width  (used to space out the visualization)
		var y = d3.scaleLinear().domain(d3.extent(dataset, function (d){  
				return d[indicators[2]];
			}))
			.range([0, height-2*margin]);		
		var r = d3.scaleLinear().domain(d3.extent(dataset, function (d){  
				return d[indicators[0]];
			}))
			.range([5, 40]);
			
		console.log(x.domain(),x.range());
		console.log(y.domain(),y.range());
		console.log(r.domain(),r.range());
		
			
		svg.append("g").attr("class", "x axis").attr("transform", "translate("+margin+"," + (y.range()[1]+margin) + ")");  
		svg.append("g").attr("class", "y axis").attr("transform", "translate(" + margin + ","+margin+")");
		
		svg.append("text")  
		.attr("fill", "blue")  
		.attr("text-anchor", "end")  
		.attr("x", width / 2)  
		.attr("y", height - 0.2*margin)  
		.text("GDP per capita");

		svg.append("text")  
		.attr("fill", "red")
		.attr("text-anchor", "middle")
		.attr("transform", "translate("+(0.25*margin)+","+(0.5*height)+")rotate(-90)")   
		.text("Life expectancy");

		
		var xAxis = d3.axisBottom(x).ticks(15,"s");
		var yAxis = d3.axisLeft(y).ticks(10,",f");
		
		svg.selectAll("g.x.axis").call(xAxis);
		svg.selectAll("g.y.axis").call(yAxis);
		
		svg.append("g").attr("transform", "translate(" + margin + ","+margin+")")
		.selectAll("circle")
		.data(dataset)
		.enter().append("circle")
		.attr("cx",function(d) {
			return x(d[indicators[1]]);
		})
		.attr("cy",function(d) {
			return y(d[indicators[2]]);
		})
		.attr("r",function(d) {
			return r(d[indicators[0]]);
		})
		.attr("fill","rgba(0,255,0,0.3)")
		.append("svg:title")
		.text(function(d) { 
			return d["country"]+"("+d[indicators[0]]+")"; 
		});

	}
	
	$scope.drawPopulationChart($scope.populationData);
	
});
