"use strict";

var app = angular.module("dots_game", []);

app.controller("dots_ctrl", ["$scope", "$rootScope", "$timeout", "$interval", "select", "makeLine", "fill", "$filter", function ($scope, $rootScope, $timeout, $interval, select, makeLine, fill, $filter) {
	$scope.name = "Dots";
	$scope.my_score = "00";
	$scope.your_score = "00";
	$scope.timer_mins = "00";
	$scope.timer_secs = "00";
	$scope.grid = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];
	$scope.dot = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80];
	$scope.count = 0;
	$scope.first_selection;
	$scope.second_selection;
	$scope.turn = 0;
	$scope.reset = function () {
		//reseet the reset text
		$("#reset_text").text("RESET");
		//reset gameboard
		$("#gameboard").removeClass("start");
		//reset score
		$scope.my_score = parseInt($scope.my_score); 
		$scope.your_score = parseInt($scope.your_score);
		$scope.my_score = 0;
		$scope.your_score = 0;
		$scope.my_score = $filter("double_digit")($scope.my_score);
		$scope.your_score = $filter("double_digit")($scope.your_score);
		//reset timer
		$scope.timer_mins = parseInt($scope.timer_mins); 
		$scope.timer_secs = parseInt($scope.timer_secs);
		$scope.timer_mins = 0; 
		$scope.timer_secs = 0;
		$scope.timer_secs = $filter("double_digit")($scope.timer_secs);
		$scope.timer_mins = $filter("double_digit")($scope.timer_mins);
		//reset background and borders and other classes
		$(".grid").css("backgroundColor", "#111")
				  .css("border", "0.25em dashed #000")
				  .removeClass("you")
				  .removeClass("me");
	  	//reset the checkers
	  	$(".checker").attr("data", 0);
	  	//reset dot classes
	  	$(".dot").attr("class", "dot");
	};

	//start game when first dot is pressed
	$interval(function () {
		if( $("#gameboard").hasClass("start") ){
			//update time clock
			$scope.timer_mins = parseInt($scope.timer_mins); 
			$scope.timer_secs = parseInt($scope.timer_secs);
			$scope.timer_secs++;
			if($scope.timer_secs == 60){
				$scope.timer_secs = 0;
				$scope.timer_mins++;
			}
			$scope.timer_secs = $filter("double_digit")($scope.timer_secs);
			$scope.timer_mins = $filter("double_digit")($scope.timer_mins);
		}
	}, 1000);
	
	$interval(function () {
		//$filter("update")($scope.my_score, me);
		//watch for score change
		$scope.my_score = parseInt($scope.my_score); 
		$scope.your_score = parseInt($scope.your_score);
		$scope.my_score = $(".grid[class*=me]").length;
		$scope.your_score = $(".grid[class*=you]").length;
		$scope.my_score = $filter("double_digit")($scope.my_score);
		$scope.your_score = $filter("double_digit")($scope.your_score);
		if(($scope.your_score + $scope.my_score) == 64){
			if($scope.your_score > $scope.my_score){
				$("#reset_text").text("Red Wins!");
			} else {
				$("#reset_text").text("Green Wins!");
			}
		}
	}, 1000);
	//on dot click
	$scope.select = function ($event) {
		$("#gameboard").addClass("start");
		$scope.count++;
		select.dot($event, $scope.count);
		if($scope.count == 1){
			$scope.first_selection = $event;
		}
		if($scope.count == 2){
			$scope.second_selection = $event;
			makeLine.on_box($event, $scope.first_selection, $scope.second_selection);
			fill.box();
			$timeout( function () {
				$scope.count = 0;
			}, 100);

			//check to see who gets the point
			$timeout( function () {
				var firstValue = $scope.first_selection.target.attributes.data.nodeValue;
				fill.box($scope.turn);

				if($(".dot[data="+firstValue+"]").hasClass("wrong")) {						
					//console.log("wrong");
				} else {
					$scope.turn++;
					if ( $(".grid").hasClass("fill") ) {
						$scope.turn--;
					}
				}
			}, 200);
		}
	};
}]);

app.service("select", function ($timeout) {
	this.dot = function ($event, count) {
		if(count == 1){
			//get data value of target
			var target = $event.target.attributes.data.nodeValue;
			$(".dot[data="+target+"]").css("background", "radial-gradient(circle at 0.66em 0.66em, #01D7D0, #000)");
		} else if (count == 2) {
			var target = $event.target.attributes.data.nodeValue;
			$(".dot[data="+target+"]").css("background", "radial-gradient(circle at 0.66em 0.66em, #01D7D0, #000)");
			$timeout( function () {
				$(".dot").css("background", "radial-gradient(circle at 0.66em 0.66em, #405FE5, #000)");
			}, 500);
		}
	};
});

app.service("makeLine", function ($filter, $timeout) {
	this.on_box = function ($event, first, second) {
		var firstValue = first.target.attributes.data.nodeValue;
		var secondValue = second.target.attributes.data.nodeValue;
		var difference = Math.abs(parseInt(firstValue) - parseInt(secondValue));
		var addition = parseInt(firstValue) + parseInt(secondValue);
		var smaller_number;
		//vertical reference used to make side bars
		var vertical = [
			{first:1,second:0},
			{first:2,second:1},
			{first:3,second:2},
			{first:4,second:3},
			{first:5,second:4},
			{first:6,second:5},
			{first:7,second:6},
			{first:8,second:7},
			{first:17,second:16}
		];
		//horizontal reference used to make top/bottom bars
		var horizontal = [
			{second:0},
			{first:9,second:1},
			{first:10,second:2},
			{first:11,second:3},
			{first:12,second:4},
			{first:13,second:5},
			{first:14,second:6},
			{first:15,second:7},
			{first:16},
		];

		//check to see if dots have already been used
		if($(".dot[data="+firstValue+"]").hasClass(secondValue) ||	$(".dot[data="+secondValue+"]").hasClass(firstValue)){
			$(".dot[data="+firstValue+"]").css("background", "radial-gradient(circle at 0.66em 0.66em, red, #000)").addClass("wrong");
			$(".dot[data="+secondValue+"]").css("background", "radial-gradient(circle at 0.66em 0.66em, red, #000)").addClass("wrong");
			$timeout( function () {
				$(".dot[data="+firstValue+"]").removeClass("wrong");
				$(".dot[data="+secondValue+"]").removeClass("wrong");
			}, 1000);
		} else {
			$(".dot[data="+firstValue+"]").addClass(secondValue);
			$(".dot[data="+secondValue+"]").addClass(firstValue);
			if((addition == 17 || addition == 35 || addition == 53 || addition == 71 
			|| addition == 89 || addition == 107 || addition == 125 || addition == 143)
			&& difference == 1){
				console.log("not a match");
			} else {
				if( (difference == 1) || (difference == 9) ){
					//find smaller number
					if ( ( parseInt(firstValue) - parseInt(secondValue) ) < 0 ){
						smaller_number = firstValue;
					} else {
						smaller_number = secondValue;
					}
					//find the position array index to use as reference					
					var row = Math.floor(smaller_number/9);
					//continue finding line to make
					if( difference == 1){
						if(smaller_number < 9){
							//if the box is on the top edge...
							var bottom_square = smaller_number - horizontal[row].second;
							$(".grid[data="+bottom_square+"]").css("borderTopColor", "#405FE5");
							//increment the child data -> when it reaches 4 the box will change color
							var data = $filter("increment")(data, bottom_square);
							//set the new data value
							$(".grid[data="+bottom_square+"]").children(".checker").attr("data", data);
						} else if(smaller_number > 71){
							//if the box is on the bottom edge...
							var top_square = smaller_number - horizontal[row].first;
							$(".grid[data="+top_square+"]").css("borderBottomColor", "#405FE5");
							//increment the child data -> when it reaches 4 the box will change color
							var data = $filter("increment")(data, top_square);
							//set the new data value
							$(".grid[data="+top_square+"]").children(".checker").attr("data", data);
						} else {
							//if the box is in the middle
							var top_square = smaller_number - horizontal[row].first;
							var bottom_square = smaller_number - horizontal[row].second;
							$(".grid[data="+bottom_square+"]").css("borderTopColor", "#405FE5");
							$(".grid[data="+top_square+"]").css("borderBottomColor", "#405FE5");
							//increment the child data -> when it reaches 4 the box will change color
							var data = $filter("increment")(data, bottom_square);
							var data2 = $filter("increment")(data, top_square);
							$(".grid[data="+bottom_square+"]").children(".checker").attr("data", data);
							$(".grid[data="+top_square+"]").children(".checker").attr("data", data2);
						}
					} else {					
						if(smaller_number%9 == 0){
							//if the box is on the left edge
							var right_square = smaller_number - vertical[row].second;
							$(".grid[data="+right_square+"]").css("borderLeftColor", "#405FE5");
							//increment the child data -> when it reaches 4 the box will change color
							var data = $filter("increment")(data, right_square);
							$(".grid[data="+right_square+"]").children(".checker").attr("data", data);
						} else if(smaller_number%9 == 8){
							//if the box is on the right edge
							var left_square = smaller_number - vertical[row].first;
							$(".grid[data="+left_square+"]").css("borderRightColor", "#405FE5");
							//increment the child data -> when it reaches 4 the box will change color
							var data = $filter("increment")(data, left_square);
							$(".grid[data="+left_square+"]").children(".checker").attr("data", data);
						} else {
							//if the box is in the middle
							var left_square = smaller_number - vertical[row].first;
							var right_square = smaller_number - vertical[row].second;
							$(".grid[data="+left_square+"]").css("borderRightColor", "#405FE5");
							$(".grid[data="+right_square+"]").css("borderLeftColor", "#405FE5");
							//increment the child data -> when it reaches 4 the box will change color
							var data = $filter("increment")(data, left_square);
							var data2 = $filter("increment")(data, right_square);
							$(".grid[data="+left_square+"]").children(".checker").attr("data", data);
							$(".grid[data="+right_square+"]").children(".checker").attr("data", data2);		
						}
					}
				}
			}
		}
	}
});

app.service("fill", function ($timeout, $rootScope) {
	this.box = function (turn) {
		if( turn%2 == 1 ){
			$rootScope.your_score++;
			$(".grid").children(".checker[data=4]").parent(".fill").css("background-color", "#C12B5F").addClass("you");
		} else if ( turn%2 == 0 ) {
			$(".grid").children(".checker[data=4]").parent(".fill").css("background-color", "#14AFD2").addClass("me");
		}
	};
});

app.filter("increment", function ($timeout) {
	return function (data, position) {
		var data = $(".grid[data="+position+"]").children(".checker").attr("data");
		data = parseInt(data);
		data++;
		if(data == 4){
			$(".grid[data="+position+"]").addClass("fill");
			$timeout( function () {
				$(".grid[data="+position+"]").removeClass("fill");
			}, 1000);
		}
		return data;
	}
});

app.filter("double_digit", function () {
	return function (x) {
		if( parseInt(x) < 10 ){
			x = "0" + x;
		}
		return x;
	};
})

app.filter("update", function ($filter) {
	// return function (x, person) {
	// 	x = parseInt(x); 
	// 	x = $(".grid[class*=me]").length;
	// 	x = $filter("double_digit")(x);
	// 	return x;
	// }
});