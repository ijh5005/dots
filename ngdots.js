"use strict";

var app = angular.module("box_game", []);

app.controller("box_ctrl", ["$scope", "$rootScope", "$timeout", "$interval", "$filter", "turn_update", function ($scope, $rootScope, $timeout, $interval, $filter, turn_update) {
	//application variables
		$scope.my_score = "00";
		$scope.your_score = "00";
		$scope.timer_mins = "00";
		$scope.timer_secs = "00";
        $scope.time = "2min";
		$scope.grid = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63];
		//used to indicate whos turn it is (even#: myturn, odd#: yourturn)
		$rootScope.whos_turn = 0;

	/**********  reset button  **********/
		$scope.reset = function () {
			//reset the reset button text
			$("#reset_text").text("RESET");
			//reset gameboard start indication (used to start the time clock)
			$("#gameboard").removeClass("start");
			//reset scores
			$scope.my_score = $filter("reset_numbers")($scope.my_score);
			$scope.your_score = $filter("reset_numbers")($scope.your_score);
            //reset start time
            $rootScope.timeSelect = true;
			//reset timer
            $rootScope.startGame = false;
			$scope.timer_mins = $filter("reset_numbers")($scope.timer_mins); 
			$scope.timer_secs = $filter("reset_numbers")($scope.timer_secs);
			//reset background and borders and other classes
			$(".grid").removeClass("myPoint")
                      .removeClass("yourPoint")
					  .css("border", "0.15em dashed #DDD")
					  .removeClass("you")
					  .removeClass("me");
		  	//reset the checkers
		  	$(".checker").attr("data", 0);
            //side checks
            $(".side").attr("data", "false");
		  	//reset turn opacity and turn variable
			$(".my_score").css("opacity", "1");
			$(".your_score").css("opacity", "0.4");
            $rootScope.whos_turn = 0;
		};
	/**********  complete: reset button  **********/



	/**********  start game when first line is pressed  **********/
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



	/**********  score updater  **********/
		$interval(function () {
		//watch for score change
			//get the number of highlighted boxes for each players (indicated by number of "me" and "you" classes)
			$scope.my_score = $(".grid[class*=my]").length;
			$scope.your_score = $(".grid[class*=your]").length;
			//turn the scores to double digit numbers
			$scope.my_score = $filter("double_digit")($scope.my_score);
			$scope.your_score = $filter("double_digit")($scope.your_score);
		//check for winner
			if(($scope.your_score + $scope.my_score) == 64){
				if($scope.your_score > $scope.my_score){
					$("#reset_text").text("Red Wins!");
				} else if($scope.your_score < $scope.my_score) {
					$("#reset_text").text("Green Wins!");
				} else {
					$("#reset_text").text("Draw!");
				}
			}
		}, 1000);
	/**********  complete: score updater  **********/

	

    /**********  mantain grid box dimensions / update turn indicator opacity  **********/
		$interval( function () {
            var gameWidth = $("#gameboard").width();
            var borderWidth = $(".grid").css("borderWidth");
            var gridWidth = gameWidth * 0.125;
			var gridHeight = gridWidth;
            $(".grid").css("width", gridWidth);
            $(".grid").css("height", gridHeight);
            
            //update turn
            turn_update.opacity($rootScope.whos_turn);
		}, 100);
	/**********  complete: mantain grid box width relative to height  **********/
    
}]);

app.controller("line_click", ["$scope", "$rootScope", "$filter", "$timeout", "line_click_border", "line_click_border_right" , "line_click_border_left", function($scope, $rootScope, $filter, $timeout, line_click_border, line_click_border_right , line_click_border_left){
    
    
    //function to fill the boxes
    $scope.fill = function (pos, posAdj) {
        if($rootScope.whos_turn%2 == 0){
            
            //fill in the box by adding the class yourPoint (check css for reference class)
            $(".grid[data=" + pos + "]").addClass("yourPoint");
            
            //fill the adjacent box if the child .check[data=4]
            if($(".grid[data="+posAdj+"]").children(".checker").attr("data") == 4){
                $scope.fillAdj(posAdj, "yourPoint");
            }
            
            //reset the turn so the player that scored can go again
            $rootScope.whos_turn--;
        } else {
            
            //fill in the box by adding the class myPoint (check css for reference class)
            $(".grid[data=" + pos + "]").addClass("myPoint");
            
            //fill the adjacent box if the child .check[data=4]
            if($(".grid[data="+posAdj+"]").children(".checker").attr("data") == 4){
                $scope.fillAdj(posAdj, "myPoint");
            }
            
            //fill in the box by adding the class yourPoint (check ss for reference)
            $rootScope.whos_turn--;
        }
    };
    //function to fill the boxes
    $scope.fillAdj = function (pos, scored) {
        $(".grid[data=" + pos + "]").addClass(scored);
    };
    
    
	//controller which edge is being clicked
	$scope.edge_click = function ($event){
        //start the game clock
        $rootScope.startGame = true;
		$("#gameboard").addClass("start");
        
        
		//get the position of the current grid square
		var this_position = $filter("this")($event);
		//get the position of the the adjacent grid square from the line click
		var adjacent_position = $filter("find")($event);
		//used to check if the side is already highlighted
		var side_check = $(".grid[data="+this_position+"]").children("#"+adjacent_position.side+"").attr("data");
		var side_check_other = $(".grid[data="+adjacent_position.data+"]").children("#"+adjacent_position.opposite+"").attr("data");
		//increment .checker data if side isn't already highlighted
		if( side_check == "false" ){
            //change turn when line is clicked (even#:1st player tun, odd#:2nd plyer turn) -> the expection to turn changes are handled in the box_ctrl
		    $rootScope.whos_turn++;
            console.log($rootScope.whos_turn);
            
            
			//cache increment number for this box
			var data = $filter("increment_value")(this_position);
            //cache increment number for adjacent box
			var dataAdj = $filter("increment_value")(adjacent_position.data);
            
            
			//increment the .checker data attr to indicate the number of lines the boxes have
			$(".grid[data="+this_position+"]").children(".checker").attr("data", data);
            //increment the .checker data attr for adjacent line to indicate the number of lines the boxes have
			$(".grid[data="+adjacent_position.data+"]").children(".checker").attr("data", dataAdj);
            
            
			//set the side data to false to prevent future .checker changes from this side
			$(".grid[data="+this_position+"]").children("#"+adjacent_position.side+"").attr("data", "true");
            //set the adjacent side data to false to prevent future .checker changes from this side
			$(".grid[data="+adjacent_position.data+"]").children("#"+adjacent_position.opposite+"").attr("data", "true");

            
			//peform line click on current box
			line_click_border.change(adjacent_position.side, this_position);
            
            
			//define the right and left side boxes as a boolean corresponding to the data attrs of the grid boxes (.grid[data = this_position])
			var rightSideBoxes = this_position == 7 || this_position == 15 || this_position == 23 || this_position == 31 || this_position == 39 || this_position == 47 || this_position == 55 || this_position == 63;
		    var leftSideBoxes = this_position == 0 || this_position == 8 || this_position == 16 || this_position == 24 || this_position == 32 || this_position == 40 || this_position == 48 || this_position == 56;
            
            
			//only include right/left options on other box if the box is not on the edge
			if(rightSideBoxes){
				//if box if on the right edge -> these are all the right edge boxes
                line_click_border_left.change(adjacent_position.opposite, adjacent_position.data);
                
                if(adjacent_position.side == "right"){
                    //undo (decrement) the data increment on the next box -> the next box (according to the data attr value) should be the opposite (left) edge box
                    $(".grid[data="+adjacent_position.data+"]").children(".checker").attr("data", dataAdj - 1);
                    //set the adjacent side data to false to prevent future .checker changes from this side
			        $(".grid[data="+adjacent_position.data+"]").children("#"+adjacent_position.opposite+"").attr("data", "false");
                }
			} else if(leftSideBoxes){
				//if box if on the left edge -> these are all the left edge boxes
				line_click_border_right.change(adjacent_position.opposite, adjacent_position.data);
                
                if(adjacent_position.side == "left"){
                    //undo (decrement) the data increment on the next box -> the next box (according to the data attr value) should be the opposite (right) edge box
                    $(".grid[data="+adjacent_position.data+"]").children(".checker").attr("data", dataAdj - 1);
                    //set the adjacent side data to false to prevent future .checker changes from this side
                    $(".grid[data="+adjacent_position.data+"]").children("#"+adjacent_position.opposite+"").attr("data", "false");
                }
			} else {
				//if box is in the middle -> these are all the middle boxes
				line_click_border.change(adjacent_position.opposite, adjacent_position.data);
			}
            
            //fill this box if the child .check[data=4]
            if($(".grid[data="+this_position+"]").children(".checker").attr("data") == 4){
                $scope.fill(this_position, adjacent_position.data);
            } else if ($(".grid[data="+adjacent_position.data+"]").children(".checker").attr("data") == 4) {                
            	
                //cache a var to check for a side box check
                var leftSideCheck = leftSideBoxes && (adjacent_position.side == "left");
                var rightSideCheck = rightSideBoxes && (adjacent_position.side == "right");
                var onEdgeSide = leftSideCheck || rightSideCheck;
                
                //this does not execute if the box is on the edge
                if(!onEdgeSide){
                    if($rootScope.whos_turn%2 == 0){
                        //fill the adjacent box
                        $scope.fillAdj(adjacent_position.data, "yourPoint");
                        //reset the turn so the player that scored can go again
                        $rootScope.whos_turn--;
                    } else {
                        //fill the adjacent box
                        $scope.fillAdj(adjacent_position.data, "myPoint");
                        //fill in the box by adding the class yourPoint (check ss for reference)
                        $rootScope.whos_turn--;
                    }
                }
            }
		}
	}
}]);

app.service("line_click_border", function () {
    //change corresponding border color
	this.change = function (side, position) {
		if (side == "top"){
			$(".grid[data="+position+"]").css("borderTopColor", "blue");
		} else if (side == "right") {
			$(".grid[data="+position+"]").css("borderRightColor", "blue");
		} else if (side == "bottom") {
			$(".grid[data="+position+"]").css("borderBottomColor", "blue");
		} else if (side == "left") {
			$(".grid[data="+position+"]").css("borderLeftColor", "blue");
		}
	};
});

app.service("line_click_border_right", function () {
    //change corresponding border color
	this.change = function (side, position) {
		if (side == "top"){
			$(".grid[data="+position+"]").css("borderTopColor", "blue");
		} else if (side == "bottom") {
			$(".grid[data="+position+"]").css("borderBottomColor", "blue");
		} else if (side == "left") {
			$(".grid[data="+position+"]").css("borderLeftColor", "blue");
		} else {
			console.log("on edge");
		}
	};
});

app.service("line_click_border_left", function () {
	this.change = function (side, position, thisPosition, thisSide) {
		if (side == "top"){
			$(".grid[data="+position+"]").css("borderTopColor", "blue");
		} else if (side == "right") {
			$(".grid[data="+position+"]").css("borderRightColor", "blue");
		} else if (side == "bottom") {
			$(".grid[data="+position+"]").css("borderBottomColor", "blue");
		} else {
			console.log("on edge");
		}
	};
});

app.service("turn_update", function () {
	this.opacity = function (turn_number){
		if (turn_number%2 == 1){
			$(".my_score").css("opacity", 0.4);
			$(".your_score").css("opacity", 1);
		} else if (turn_number%2 == 0){
			$(".my_score").css("opacity", 1);
			$(".your_score").css("opacity", 0.4);
		}
	}
});

app.filter("increment_value", function ($timeout) {
	return function (position) {
        var x = $(".grid[data="+position+"]").children(".checker").attr("data");
        x = parseInt(x);
        x++;
        return x;
	}
});

app.filter("double_digit", function () {
	return function (x) {
		if( parseInt(x) < 10 ){
			x = "0" + x;
		}
		return x;
	};
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
		var side;
        //cache var to account for the screen size when offsets are compared
        var gameWidth = $("#gameboard").width();
        var gridWidthComparer = gameWidth * 0.125 * 0.8;
        //check the side for a click based off of offset and .grid box size
		if($event.offsetY < 10) {
			//hightlight corresponding side
			side = "top";
		}
		//if bottom edge is clicked highlight that edge and the edge of the box directly next to it
		if($event.offsetY > gridWidthComparer) {
			//hightlight corresponding side
			side = "bottom";
		}
		//if right edge is clicked highlight that edge and the edge of the box directly next to it
		if($event.offsetX > gridWidthComparer) {
			//hightlight corresponding side
			side = "right";
		}
		//if left edge is clicked highlight that edge and the edge of the box directly next to it
		if($event.offsetX < 10) {
			//hightlight corresponding side
			side = "left";
		}
		///////////////////////////////////
		if (side == "top"){
			//cache the top box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position - 8;
			var object = { side: "top", data: position, opposite: "bottom" };
			return object;
		} else if (side == "right"){
			//cache the right box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position + 1;
			var object = { side: "right", data: position, opposite: "left" };
			return object;
		} else if (side == "bottom"){
			//cache the bottom box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position + 8;
			var object = { side: "bottom", data: position, opposite: "top" };
			return object;
		} else if (side == "left"){
			//cache the left box data attr
			var position = $event.target.attributes.data.nodeValue;
			position = parseInt(position);
			position = position - 1;
			var object = { side: "left", data: position, opposite: "right" };
			return object;
		} else {
			return -1;
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