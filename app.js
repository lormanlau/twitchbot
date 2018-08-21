const tmi = require('tmi.js');
const oAuth = require('./config.js')
const Discord = require('discord.io')

const bot = new Discord.Client({
   token: oAuth.token,
   autorun: true
});

bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case "giveaway":
            addGiveaway(options.channels[0], args[0]);
                break;
            case "cleargiveaway":
                clearGiveaway(options.channels[0]);
                break;
            case "pickwinner":
                pickWinner(options.channels[0]);
                break;
            case "message":
                setMessages(options.channels[0], message.substring(9, message.length));
                break;
            case "clearmessage":
                clearMessage(options.channels[0], message);
                break;
            case "updatedc":
                updateDeathCount(options.channels[0], message);
                break;
            case "delete":
                say(channel, "/timeout " + array[1] + " 1");
                break;
            default:
                break;
            }
     }
});


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
    channels: ["azumayaaru"]
}

var storage = {}
var autoMessage = {}
var autoMessageText = {}

var mail = ["sale", "male", "fail", "pale", "snail", "ale", "bail", "kale", "grail", "quail", "nail", "hail", "scale", "stale", "rail", "tail", "tale", "veil", "whale", "yale", "trail", "jail"]
var s = ["MorphinTime", "MorphinTime", "MorphinTime", "TheIlluminati", "", "CoolStoryBob", "TwitchUnity"]
var r = ["MorphinTime", "CoolStoryBob", "CoolStoryBob", "CoolStoryBob", "TwitchUnity", "TheIlluminati"]
var h = ["MorphinTime", "TwitchUnity", "TwitchUnity", "TwitchUnity", "CoolStoryBob", "TheIlluminati"]
var g = ["TheIlluminati", "TheIlluminati", "TheIlluminati", "TwitchUnity", "CoolStoryBob", "MorphinTime"]


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

client.on("join", function(channel, username, self){
    if (self) {
        storage[channel] = {
            "command": null,
            "entries": [],
            "active": true,
            "death_count": 0
        }
    };
});

client.on("whisper", function(from, userstate, message, self){

})

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
            clearMessage(channel, message);
            break;
        case "!updatedc":
            updateDeathCount(channel, message);
        case "!delete":
            say(channel, "/timeout " + array[1] + " 1");
        default:
            break;
    }
}

function userCommands(channel, message, username){
    if (message.charAt(0) == "!") {
        let temp = message.split(" ");
        let command = temp[0].substring(1, temp[0].length);
        if (storage[channel]["command"] != null){
            let giveawaycommand = storage[channel]["command"];
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
            case "nm":
                noMercy(channel);
                break;
            case "adread":
                say(channel, "cone no bang go me wha go ran no sponsor no tech yo de oh core re shi mass");
                break;
            case "roll":
                dndRoll(channel, message, username);
                break;
            case "deathcount":
            case "dc":
                say(channel, "Death Count: " + storage[channel]["death_count"]);
                break;
            case "energy":
                say(channel, "༼ つ ◕_◕ ༽つ " + channel.substring(1, channel.length).toUpperCase() + " TAKE MY ENERGY ༼ つ ◕_◕ ༽つ")
                break;
            case "ohno":
                say(channel, "OH NO, OH NO, OH NO, OH NO");
                break;
            case "maplesatori":
                checkMonday(channel);
                break;
            case "awoo":
                say(channel, "https://clips.twitch.tv/PhilanthropicImportantMilkAMPEnergy");
                break;
            case "riphp":
                say(channel, "https://clips.twitch.tv/ArtisticViscousClamOptimizePrime");
                break;
            case "awoooo":
                say(channel, "!sr https://www.youtube.com/watch?v=eGslweDOihs")
            default:
                break;
        }
    }
}

function setMessages(channel, message){
    say(channel, message);
    if(autoMessage[channel] != null) {
        autoMessageText[channel].push(message);
        autoMessage[channel].push(setInterval(function(){ say(channel, message); }, 5000 * 60));
    } else {
        autoMessage[channel] = [];
        autoMessageText[channel] = [];
        autoMessageText[channel].push(message);
        autoMessage[channel].push(setInterval(function(){ say(channel, message); }, 5000 * 60));
    }
}

function updateDeathCount(channel, message){
    let count = message.split(" ")[1];
    if (!isNaN(count)){
        storage[channel] = {
            death_count: count
        };
        storage[channel]["death_count"] = count;
        say(channel, "Death Count: " + storage[channel]["death_count"]);
    }
}

function clearMessage(channel, message){
    if (autoMessage[channel].length == 0){
        say(channel, "No message currently active");
        return
    }
    var temp = message.split(" ");
    if (!isNaN(temp[1])) {
        say(channel, autoMessageText[channel][temp[1]] + " has been cleared")
        clearInterval(autoMessage[channel][temp[1]]);
        autoMessage[channel].splice(parseInt(temp[1]), 1)
        autoMessageText[channel].splice(parseInt(temp[1]), 1)
    } else if (temp[1] == "all"){
        say(channel, "All messages have been cleared");
        
        for (var i = 0; i < autoMessage[channel].length; i++){
            clearInterval(autoMessage[channel][i])
            autoMessage[channel].splice(i,1);
            autoMessageText[channel].splice(i,1);
        }
    } else {
        let reply = "";
        for (var interval in autoMessage[channel]) {
            reply += interval + ". " + autoMessageText[channel][interval]; 
        }
        if (reply != "") {
            say(channel, "!clearmessage <nummber>");
            say(channel, reply);
        }  
    }
}

function checkMonday(channel) {
    var d = new Date();
    if (d.getDay() != 1) {
        say(channel, "It's not monday");
    } else {
        say(channel, "!sr https://www.youtube.com/watch?v=jfZOvQnsBq0&t=1s");
    }
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
        storage[channel]["command"] = command;
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
    var temp = message.substring(6, message.length);
    var s = username + " has rolled: ";
    var rolls = "("
    var total = 0;
    var dices = 1;
    var sides = 1;
    var extra = 0;
    if (temp == "") {
        total = rollDice(20)
        rolls += total + ")";
        s += total + " " + rolls
        say(channel, s);
    } else if (!isNaN(temp)) {
        total = rollDice(parseInt(temp))
        rolls += total + ")"
        s += total + " " + rolls
        say(channel, s);
    } else {
        switch(temp){
            case "g":
                var side = rollHarryDice(g);
                say(channel, username + " rolled: " + side);
                break;
            case "h":
                var side = rollHarryDice(h);
                say(channel, username + " rolled: " + side);
                break;
            case "r":
                var side = rollHarryDice(r);
                say(channel, username + " rolled: " + side);
                break;
            case "s":
                var side = rollHarryDice(s);
                say(channel, username + " rolled: " + side);
                break;
            default:
                var command = temp.split("d");
                if (command.length == 2) {
                    if (command[1].includes("+")){
                        var add = command[1].split("+")
                        if (add.length == 2 && !add.some(isNaN) && !isNaN(command[0])){
                            extra = add[1]
                            sides = add[0]
                            if (command[0] != ""){
                                dices = command[0]
                            }
                        } else {
                            return
                        }
                    } else if (command[1].includes("-")){
                        var sub = command[1].split("-")
                        if (sub.length == 2 && !sub.some(isNaN) && !isNaN(command[0])){
                            extra = -sub[1]
                            sides = sub[0]
                            if (command[0] != ""){
                                dices = command[0]
                            }
                        } else {
                            return
                        }
                    } else {
                        if (command.length == 2 && !command.some(isNaN)){
                            sides = command[1]
                            if(command[0] != "") {
                                dices = command[0]
                            }
                        } else {
                            return
                        }
                    }

                    if (dices == 0 || sides == 0){
                        return;
                    }

                    for (var i = 0; i < dices - 1; i++){ 
                        var roll = rollDice(sides)
                        total += roll
                        rolls += roll + " "
                    }
                    var roll = rollDice(sides)
                    total += roll + parseInt(extra)
                    if (extra != 0) {
                        rolls += roll + ") " + extra
                    } else {
                        rolls += roll + ")"
                    }
                    if (total > 0) {
                        s += total + " " + rolls
                    } else {
                        s += "0 " + rolls
                    }
                    
                }
                say(channel, s);
        }   
    }
}

function rollHarryDice(dice){
    var i = Math.floor((Math.random() * 6))
    return dice[i];
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

