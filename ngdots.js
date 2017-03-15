"use strict";

var app = angular.module("dots_game", []);

app.controller("dots_ctrl", ["$scope", "$rootScope", "$timeout", "$interval", "select", "makeLine", "fill", "$filter", function ($scope, $rootScope, $timeout, $interval, select, makeLine, fill, $filter) {
	//application variables
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

/**********  reset button  **********/
	$scope.reset = function () {
		//reset the reset button text
		$("#reset_text").text("RESET");
		//reset gameboard start indication (used to start the time clock)
		$("#gameboard").removeClass("start");
		//reset scores
		$scope.my_score = $filter("reset_numbers")($scope.my_score);
		$scope.your_score = $filter("reset_numbers")($scope.your_score);
		//reset timer
		$scope.timer_mins = $filter("reset_numbers")($scope.timer_mins); 
		$scope.timer_secs = $filter("reset_numbers")($scope.timer_secs);
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
/**********  complete: reset button  **********/



/**********  start game when first dot is pressed  **********/
	//update timer every sec
	$interval(function () {
		if( $("#gameboard").hasClass("start") ){
			//update timer
			//convert the number for incrementing
			$scope.timer_mins = parseInt($scope.timer_mins);
			$scope.timer_secs = parseInt($scope.timer_secs);
			//increment secs by 1
			$scope.timer_secs++;
			//update clock if one min passes
			if($scope.timer_secs == 60){
				$scope.timer_secs = 0;
				$scope.timer_mins++;
			}
			//turn them ino two digit numbers
			$scope.timer_secs = $filter("double_digit")($scope.timer_secs);
			$scope.timer_mins = $filter("double_digit")($scope.timer_mins);
		}
	}, 1000);
/**********  complete: start game when first dot is pressed  **********/


	
	$interval(function () {
		//watch for score change and turn change
		$scope.my_score = parseInt($scope.my_score); 
		$scope.your_score = parseInt($scope.your_score);
		//get the number of highlighted boxes for each players (indicated by number of "me" and "you" classes)
		

		//I am trying to filter the score update but we cant referent elements within the filters
		//$scope.my_score = $filter("update_score")($scope.my_score, me);
		


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
		//indicate the turn play with opacity

		// if( $scope.count%2 == 1 ){
		// 	console.log("you");
		// 	$(".my_score").removeClass("opacity");
		// 	$(".your_score").removeClass("opacity");
		// 	$(".your_score").addClass("opacity");
		// } else if ( $scope.count%2 == 0 ) {
		// 	console.log("me");
		// 	$(".my_score").removeClass("opacity");
		// 	$(".your_score").removeClass("opacity");
		// 	$(".my_score").addClass("opacity");
		// }
		////////////////////////////////////////


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

app.controller("line_click", ["$scope", "whos_turn", "$filter", function($scope, whos_turn, $filter){
	$scope.track_turn = 0;
	
	//controller which edge is being clicked
	$scope.edge_click = function ($event){
		//get the position of the current grid square
		var this_position = $filter("this")($event);
		//get the position of the the adjadcent grid square from the line click
		var position = $filter("find")($event);
		//increment the child data attr to equal the number of lines the box has
		var data = $filter("increment")(data, this_position);
		//add the lines to the boxs
		//$(".grid[data="+this_position+"]").children(".checker").attr("data", data);
	}
}]);

app.controller("default", function ($scope) {
	$scope.name = "Dots";
	$scope.description = "play with a friend to see who can make the most squares";
});

app.controller("keep_score", function () {});

app.service("whos_turn", function () {
	this.is_it = function (x, cb) {
		x = parseInt(x);
		x++;
		//track turn
		if( x%2 == 0 ){
			//when x is even it's the your turn
			cb = "yours";
		} else {
			//when x is even it's my turn
			cb = "mine's";
		}
	}
});

app.service("add_title", function () {

});

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

app.service("fill", function ($timeout) {
	this.box = function (turn) {
		if( turn%2 == 1 ){
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

app.filter("this", function () {
	return function ($event) {
		var position = $event.target.attributes.data.nodeValue;
		position = parseInt(position); 
		return position;
	}
});

app.filter("find", function() {
	return function ($event) {
		//////
		var side;
		if($event.offsetY < 10) {
			//hightlight corresponding side
			side = "top";
			//console.log($scope.which_edge);
		}
		//if bottom edge is clicked highlight that edge and the edge of the box directly next to it
		if($event.offsetY > 80) {
			//hightlight corresponding side
			side = "bottom";
			//console.log($scope.which_edge);
		}
		//if right edge is clicked highlight that edge and the edge of the box directly next to it
		if($event.offsetX > 80) {
			//hightlight corresponding side
			side = "right";
			//console.log($scope.which_edge);
		}
		//if left edge is clicked highlight that edge and the edge of the box directly next to it
		if($event.offsetX < 10) {
			//hightlight corresponding side
			side = "left";
			//console.log($scope.which_edge);
		}
		//////
		if (side == "top"){
			//cache the top box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position - 8;
			return position;
		} else if (side == "right"){
			//cache the right box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position + 1;
			return position;
		} else if (side == "bottom"){
			//cache the bottom box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position + 8;
			return position;
		} else if (side == "left"){
			//cache the left box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position - 1;
			return position;
		} else {
			return "not a side";
		}
	};
});

app.filter("reset_numbers", function ($filter) {
	return function (score) {
		score = parseInt(score); 
		score = 0;
		score = $filter("double_digit")(score);
		return score
	}
});

app.filter("update_score", function ($filter) {
	return function (score, person) {
		score = parseInt(score); 
		//get the number of highlighted boxes for each players (indicated by number of "me" and "you" classes)
		score = $(".grid[class*="+person+"]").length;
		score = $filter("double_digit")(score);
	}
});