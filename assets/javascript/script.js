// declare variables
var weapons = ["rock", "paper", "scissors"];
var player1 =  false;
var player2 = false;
var player1Choose = false;
var player2Choose = false;
var hasKey = false;
// var to ref database
var database = firebase.database();


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
	    var players = newGame.child("players");
	    players.set({
		player1: {
		    name: "Waiting for player",
		    wins: 0 + " ",
		    losses: 0 + " ",
		    choice: " "
		},
		player2: {
		    name: "Waiting for Player",
		    wins: 0 + " ",
		    losses: 0 + " ",
		    choice: " "
		}
	    }); // close players set
	    hasKey = true;
	    $("#startModal").modal("hide");
	} else
	    $("startModal").modal("hide");
    } // close startNewGame

        // submit name function
    function newPlayer() {
        if (!player1 && !player2) {  
	    // save name to database
	    var newName = $("#playerName").val("");
	    database.ref(players).child(players.player1).update(name: newName);
	    player1 = true;
	} else if (player1 && !player2) {
	    player2 = true;
	    // save name to database
	    database.ref("players/player2").update({name: newName});
	    $("#playerName").val("");
	    $("form").hide();
	    chooseWeapon();
	}
    }; // close newPlayer

    function chooseWeapon() {
	for (var i = 0; i < weapons.length; i++) {
	    var choice1 = $("<button class='p1'>");
	    choice1.attr("value", weapons[i]);
	    $(".choices1").append(choice1);

	    var choice2 = $("<button class='p2'>");
	    choice2.attr("value", weapons[i]);
	    $(".choices2").append(choice2);
	}
    }; // close chooseWeapon

    function gamePlay() {
	if(!player1Choose && !player2Choose){
	    
	}
}
    
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
    
    





    // play game funtion
    // each player chooses weapon
    // check who wins, tell players, adjust counters

}); // close ready function
