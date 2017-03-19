// declare variables
var weapons = ["rock", "paper", "scissors"];
var player1 =  false;
var player2 = false;
var player1Choose = false;
var player2Choose = false;
var hasKey = false;
// var to ref database
var database = firebase.database();
var key;
var player1Choice = "";
var player2Choice = "";
var p1Name, p2Name;



$(document).ready(function() {
    // modal to start new game session
    $("#startModal").modal({backdrop: true});
    
    // start game function
    function startNewGame() {
	// save info to database
	// push new session to create key
	// set each player with wins loss and name
	// use update to adjust counters
	
	if(!hasKey){
	    //var newGame = database.ref();
	    var newGame = database.ref().push("newGame");
	    key = newGame.toString().split('/')[3];
	    var players = newGame.child("players");
	    players.set({
		player1: {
		    name: "Waiting for player",
		    wins: 0,
		    losses: 0,
		    choice: " "
		},
		player2: {
		    name: "Waiting for Player",
		    wins: 0,
		    losses: 0,
		    choice: " "
		}
	    }); // close players set
	    hasKey = true;
	    $("#startModal").modal("hide");
	    return key;
	} else {
	    $("startModal").modal("hide");
	    return key;
	}
    } // close startNewGame

    // submit name function
    function newPlayer() {
	startNewGame();
        if (!player1 && !player2) {
	    p1Name = $("#playerName").val().trim();
	    // save name to database
	    database.ref(key + "/players/player1").update({name: p1Name});
	    $("#playerName").val("");
	    player1 = true;
	} else if (player1 && !player2) {
	    p2Name = $("#playerName").val().trim();
	    player2 = true;
	    // save name to database
	    database.ref(key + "/players/player2").update({name: p2Name});
	    $("#playerName").val("");
	    $("form").hide();
	    chooseWeapon();
	}
    } // close newPlayer

    // create button for players to choose weapon
    function chooseWeapon() {
	$("#choice1").empty();
	$("#choice2").empty();
	$("#result").empty();
	for (var i = 0; i < weapons.length; i++) {
	    var choice1 = $("<button class='p1'>");
	    choice1.attr("value", weapons[i]);
	    choice1.text(weapons[i]);
	    choice1.after($("<br>"));
	    $(".choices1").append(choice1);

	    var choice2 = $("<button class='p2'>");
	    choice2.attr("value", weapons[i]);
	    choice2.text(weapons[i]);
	    choice2.after($("<br>"));
	    $(".choices2").append(choice2);
	}
    } // close chooseWeapon

    
    // check who wins, tell players, adjust counters
    function gamePlay() {
	if(player1Choose && player2Choose){
	    database.ref(key + "/players/player1").update({choice: player1Choice});
	    database.ref(key + "/players/player2").update({choice: player2Choice});
	    if (player1Choice === player2Choice){
		$("#result").text("Tie!");
	    } else if (player1Choice === "rock"){
		if (player2Choice === "paper") {
		    $("#result").text(p2Name +  " wins!");
		    p2IncWins();
		    p1IncLoss();
		} else if (player2Choice === "scissors") {
		    $("#result").text(p1Name + " wins!");
		    p1IncWins();
		    p2IncLoss();
		}
		
	    } else if (player1Choice === "paper"){
		if (player2Choice === "scissors") {
		    $("#result").text(p2Name +  " wins!");
		    p2IncWins();
		    p1IncLoss();
		} else if (player2Choice === "rock") {
		    $("#result").text(p1Name + " wins!");
		    p1IncWins();
		    p2IncLoss();
		}
		
	    } else if (player1Choice === "scissors"){
		if (player2Choice === "rock") {
		    $("#result").text(p2Name +  " wins!");
		    p2IncWins();
		    p1IncLoss();
		} else if (player2Choice === "paper") {
		    $("#result").text(p1Name + " wins!");
		    p1IncWins();
		    p2IncLoss();
		}
	    }
	   
	    player1Choose = false;
	    player2Choose = false;
	    setTimeout (function() {
		chooseWeapon();
	    }, 3000);
	}// close if statment

    } // close gamePlay

    

    // change counters
    function p1IncWins() {
	var p1Wins = database.ref(key + "/players/player1/wins");
	p1Wins.transaction(function(currentWins) {
	    return currentWins+1;
	});

    };

    function p2IncWins() {
	var p2Wins = database.ref(key + "/players/player2/wins");
	p2Wins.transaction(function(currentWins){
	    return currentWins+1;
	});
	
    };

    function p1IncLoss() {
	var p1Loss = database.ref(key + "/players/player1/losses");
	p1Loss.transaction(function(currentLoss){
	    return currentLoss+1;
	});
	
    };

    function p2IncLoss() {
	var p2Loss = database.ref(key + "/players/player2/losses");
	p2Loss.transaction(function(currentLoss){
	    return currentLoss+1;
	});
	
    };

    
    
    // update firebase when child changed
    database.ref().on("child_changed", function(childSnapshot) {
	location.hash = childSnapshot.key;
	$("#P1").html(childSnapshot.val().players.player1.name);
	$("#P2").html(childSnapshot.val().players.player2.name);
	$("#choice1").html(childSnapshot.val().players.player1.choice);
	$("#choice2").html(childSnapshot.val().players.player2.choice);
	$("#wins1").html(childSnapshot.val().players.player1.wins);
	$("#wins2").html(childSnapshot.val().players.player2.wins);
	$("#loss1").html(childSnapshot.val().players.player1.losses);
	$("#loss2").html(childSnapshot.val().players.player2.losses);
	

    }, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
    });


    

    // start click function
    $("#start").on("click", function() {
	startNewGame();
    });
    
    $("#submit").on("click", function() {
	event.preventDefault();
	newPlayer();
    });

    $(document).on("click", ".p1", function() {
	player1Choice = $(this).prop("value");
	player1Choose = true;
	gamePlay();
	$(".choices1").empty();
	
    });
    
    $(document).on("click", ".p2", function() {
	player2Choice = $(this).prop("value");
	player2Choose = true;
	gamePlay();
	$(".choices2").empty();

    });  

}); // close ready function
