var socket = io();

socket.on('updateOnline', function(data) {
    if (data) {
        document.getElementById('players').innerHTML = "";
        for (var i = 0; i < data.length; i++) {
            document.getElementById('players').innerHTML += data[i] + '</br>';
        };
    };
});

socket.on('getRanking', function(data) {
    document.getElementById('ranking').innerHTML = data;
});

socket.on('chat', function(data) {
    document.getElementById('chat_test').innerHTML += data + "</br>";
    //Move scrolling to bottom
    document.getElementById('chat_test').scrollTop = document.getElementById('chat_test').scrollHeight;
});

function SetOnline(username) {
    socket.emit('addPlayer', username)
};

function SetOffline(username) {
    var player = { socket: socket, username: username };
    socket.emit('removePlayer', player)
};

// This function fetches player names
function loadPlayers() {
    socket.emit('getPlayers');
};

// This function fetches the rankings
function loadRanking() {
    socket.emit('getRanking');
};

// Used for chat functionality
function Chat() {
    //If messagebox is not empty
    if (document.getElementById('chat_message').value != "") {
        CheckSession(function(username) {
            if (username) {
                data = username + ": " + document.getElementById('chat_message').value;
                socket.emit('chat', data);
                document.getElementById('chat_message').value = "";
            } else {
                alert('Please log in first.');
            };
        });
    };
};