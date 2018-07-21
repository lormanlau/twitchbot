const tmi = require('tmi.js');
const oAuth = require('./config.js')

const options = {
    options: {
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: oAuth.username,
        password: oAuth.oauth
    },
    channels: ["azumayaaru", "fluidnexus"]
}

var storage = {}
var autoMessage = {}

var mail = ["sale", "male", "fail", "pale", "snail", "ale", "bail", "kale", "grail", "quail", "nail", "hail", "scale", "stale", "rail", "tail", "tale", "veil", "whale", "yale", "trail", "jail"]

var client = new tmi.client(options);
client.connect();

client.on("chat", function (channel, user, message, self) {
    if (user.username == channel.substring(1, channel.length)){
        adminCommands(channel, message);
        userCommands(channel, message, user.username);
    } else if (user.mod){
        adminCommands(channel, message);
        userCommands(channel, message, user.username);
    } else {
        userCommands(channel, message, user.username);
    }
});

function say(channel, message) {
    client.action(channel, message);
};

function adminCommands(channel, message){
    let array = message.split(" ");
    switch (array[0]){
        case "!giveaway":
            addGiveaway(channel, array[1]);
            break;
        case "!cleargiveaway":
            clearGiveaway(channel);
            break;
        case "!pickwinner":
            pickWinner(channel);
            break;
        case "!message":
            setMessages(channel, message.substring(9, message.length));
            break;
        case "!clearmessage":
            clearMessage(channel)
        default:
            break;
    }
}

function setMessages(channel, message){
    autoMessage[channel] = setInterval(function(){ say(channel, message); }, 1000);
}

function clearMessage(channel){
    clearInterval(autoMessage[channel]);
}

function pickWinner(channel) {
    if (storage[channel]){
        let temp = storage[channel]
        let array = temp["entries"];
        let winner = Math.floor(Math.random() * array.length);
        say(channel, "The winner is: " + array[winner] +  "!");
    } else {
        say(channel, "No giveaway is currently active");
    }
}

function addGiveaway(channel, command){
    if (storage[channel]) {
        say(channel, "There is already a giveaway in progress, please clear with !cleargiveaway");
    } else {
        var temp = {
            "command": command,
            "entries": [],
            "active": true
        }
        storage[channel] = temp;
        say(channel, "Giveaway is now active, Type !" + command + " to enter.")
    }
}

function clearGiveaway(channel) {
    if (storage[channel]){
        delete storage[channel]
        say(channel, "Giveaway has closed");
    } else {
        say(channel, "No giveaway is currently active");
    }
}

function userCommands(channel, message, username){
    if (message.charAt(0) == "!") {
        let temp = message.split(" ");
        let command = temp[0].substring(1, temp[0].length);
        if (storage[channel] != null){
            let temp2 = storage[channel];
            let giveawaycommand = temp2["command"];
            switch(command) {
                case giveawaycommand:
                    registerToGiveaway(channel, username);
                    break;
                
            }
        }
        switch(command) {
            case "mail":
                newMail(channel);
                break;
            case "nomercy":
                noMercy(channel);
                break;
            case "adread":
                say(channel, "cone no bang go me wha go ran no sponsor no tech yo de oh core re shi mass");
                break;
            case "roll":
                dndRoll(channel, message, username);
                break;
            case "deathcount":
                say(channel, "Deathcount: 11")
                break;
            case "takemyenergy":
                say(channel, "༼ つ ◕_◕ ༽つ " + channel.substring(1, channel.length).toUpperCase() + " TAKE MY ENERGY ༼ つ ◕_◕ ༽つ")
                break;
        }
    }
}


function noMercy(channel){
    const words = ["NO MERCY!", "THANKS FOR THIS!", "GET ME SOME SPIRIT!", "THIS IS GETTING DICEY!", "LET'S SHARE!", "LOOK ALIVE!", "LETS GO!", "THAT WASN'T THE PLAN"];
    var i = Math.floor(Math.random() * words.length);
    say(channel, words[i]);
}

function newMail(channel){
    var i = Math.floor(Math.random() * mail.length);
    say(channel, "NEW " + mail[i].toUpperCase() + " HAS ARRIVED!");
}

function dndRoll(channel, message, username) {
    var temp = message.split(" ");
    var s = username + " has rolled: ";
    if (temp.length == 1) {
        s += rollDice(20);
    } else {
        var command = temp[1].split("d");
        if (command.length == 2 && !command.some(isNaN)) {
            if(command[0] != "") {
                if (command[0] == 0 || command[1] == 0){
                    return;
                }
                for (var i = 0; i < command[0]; i++){ 
                    s += rollDice(command[1]) + " ";
                }
            } else {
                s += rollDice(command[1]);
            }
        } else {
            return;
        }
    }
    say(channel, s);
}

function rollDice(sides){
    if (sides == 0) {
        return 0;
    }
    var i = Math.floor((Math.random() * sides) + 1);
    return i;
}

function registerToGiveaway(channel, username){
    let array = storage[channel].entries;
    if (array.includes(username)){
        return;
    } else {
        if (storage[channel].active) {
            storage[channel].entries.push(username);
            say(channel, username + " successfully joined the giveaway");
        }
    }
}

