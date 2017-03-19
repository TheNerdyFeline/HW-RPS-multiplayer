var chatroom = firebase.database().ref(key);

chatroom.on('value', function (snapshot) {
    updateUI(snapshot.val());
});

//On Click Send function.
$("#send").click(function () {
    // Get the inputted message using jquery
    var message = $('#message-input').val();
    // Clear the input box
    $('#message-input').val('');

    // Get current time
    var time = new Date().toLocaleTimeString();

    //push the new message object into Firebase using the reference variable
    chatroom.push({
        username: curUser,
        message: message,
        time: time
    });

    // return false in to stop page from reloading
    return false;
});


function newMessage(message, username, time) {
    var position;
    if (curUser === player1Name) {
        position = 'left';
    }
    else {
        position = 'right';
    }

    $('.messages > ul').append($("<li class='li-" + position + "'><span class='li-message'>" + message + "</span><span class='li-username'>- " + username + " | " + time + "</span></li>"));
    $(".messages").animate({scrollTop: $(this)[0].scrollHeight}, 1000);
}

function scrollToBottom() {
    $(".messages").animate({scrollTop: $(this)[0].scrollHeight}, 1000);
}


function updateUI(messages) {
    $('.messages > ul').html('');


    for (var key in messages) {
        var message = messages[key];
        var isCurUser = curUser == message.username;

        newMessage(messages[key].message, messages[key].username, messages[key].time);
    }

    scrollToBottom();
}
