chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	switch(message.type) {
		case "popup":
			var gameData = getGameData(message);
			sendResponse(gameData);
			break;
		case "csrf-token":
			sendResponse(getCSRFToken());
			break;
		case "player":
			getGamesInfo(message, sendResponse);
			break;
	}
	return true;
});

function getGamesInfo(message, sendResponse){
	chrome.storage.local.get('token', function (result) {
		var token;
		if(!result.token){
			token = getCSRFToken();
			if(!token) {
				alert("Error getting games. Token invalid");
				return;
			}
		}
		
		$.ajax({  
			type: 'POST',
			url: "http://terra.snellman.net/app/list-games",
			data: {
				"mode": "other-user",
				"status": "finished",
				"args": message.player,
				"csrf-token": token				
			},
			success: function(jsonObj) 
			{
				var factionData = {};
				var ledger;
				var oneLeech = 0;
				var multLeech = 0;
				var games = jsonObj.games;
				var sameLine = message.faction == "all" ? message.sameLine : false;
				for (var i = 0; i < games.length; i++){
					var match = games[i].role == message.faction || message.faction == "all";
					if (match && games[i].role.indexOf("player") == -1){
						var faction = sameLine ? "all" : games[i].role;
						if(!factionData[faction]){
							factionData[faction] = [];
						}
						if(games[i].aborted == 0){
							factionData[faction].push({score: games[i].vp.toString(), position: games[i].rank.toString(), game: games[i].id, gameLink: 'http://terra.snellman.net' + games[i].link, dropped: games[i].dropped != 0});
						}
					}
				}
				
				for (var key in factionData) {
					if (factionData.hasOwnProperty(key)) {
						factionData[key].reverse();
					}
				}
				sendResponse({data: factionData, ledger: ledger != undefined, oneLeech: oneLeech, multLeech: multLeech});
			},
			error: function(data) {
				console.log("Error getting games. " + data);
			}
		});
	});
}

function getCSRFToken() {
    var match = document.cookie.match(/csrf-token=([^ ;]+)/);
    if (match) {
        return match[1];
    } else {
        return undefined;
    }
}

function getGameData(message){
	var lines = [];
	var ledger = document.querySelector('#ledger');
	var your_finished = document.querySelector('#yourgames-finished');
	var player_finished = document.querySelector('#games-finished');
	var sameLine = message.faction == "all" ? message.sameLine : false;
	if(ledger){
		var button = document.querySelectorAll('#ledger button')[0];
		if(button){
			button.click();
		}
		lines = document.querySelectorAll('#ledger tr');
	} else if(your_finished){
		lines = document.querySelectorAll('#yourgames-finished tr');	
	} else if(player_finished){
		lines = document.querySelectorAll('#games-finished tr');	
	}
	
	var factionData = {};
	if(lines.length < 2) {
		alert("There are no games to be filtered. Please open a game or load finished games of some player.");
	} else {
		lines[0].scrollIntoView();
		var lastRoundLine = lines[0];
		var maxMoves = 0;
		var oneLeech = 0;
		var multLeech = 0;
		for(var i=0; i<lines.length; i++) {
			var content = "";
			var match = false;
			var faction = "";
			var logMatch = false;			
			if(ledger){
				content = lines[i].children[0].innerHTML;
				for(var j=1; j<7; j++){
					logMatch = logMatch || lines[i].id == "round" + j + "income";
					if(logMatch || lines[i].id == "scoringfirecult"){
						lastRoundLine = lines[i];
						updateMoves(factionData, maxMoves);	
						break;
					}
				}
				match = (content && content.indexOf(message.faction) != -1) || logMatch || message.faction == "all";
			} else {
				content = lines[i].children[1] ? lines[i].children[1].innerHTML : undefined;
				match = (content && content.indexOf(message.faction) != -1) || message.faction == "all";
			}
			
			lines[i].style.display = match ? "table-row" : "none";
			
			if(match){
				if(ledger && lines[i].children[2] && lines[i].children[2].innerHTML.indexOf("VP") != -1){					
					var scoreData = lines[i].children[2].innerHTML.split(" ");
					var faction = lines[i].children[0] ? lines[i].children[0].innerHTML : undefined;
					var leech = lines[i].children[9] ? lines[i].children[9].innerHTML : undefined;
					var game = lastRoundLine.children[1].innerHTML.split(" ");
					var gameLink = lastRoundLine.children[2].children[0].href;
					var action = lines[i].children[14] ? lines[i].children[14].innerHTML : undefined;
				
					if(faction){
						if(!factionData[faction]){
							factionData[faction] = [];
						}
						factionData[faction].push({score: scoreData[0], game: (game[0] == "Scoring" ? game[0] : game[0] + " " + game[1]), gameLink: gameLink, action: action});
						maxMoves = Math.max(maxMoves, factionData[faction].length);
					}
					
					if(leech && action){
						if(action.lastIndexOf("Leech 1", 0) === 0){
							oneLeech+= parseInt(leech.split("+")[1]);
						} else if(action.lastIndexOf("Leech", 0) === 0){
							multLeech+= parseInt(leech.split("+")[1]);
						}
					} 
				}
				else if(!ledger && lines[i].children[6] && lines[i].children[6].innerHTML.indexOf("vp") != -1){
					var scoreData = lines[i].children[6].innerHTML.split(" ");					
					var faction = sameLine ? "all" : (lines[i].children[1] ? lines[i].children[1].children[0].innerHTML : undefined);
					var game = lines[i].children[0] ? lines[i].children[0].innerHTML : undefined;
					var gameLink = lines[i].children[1] ? lines[i].children[1].children[0].href : undefined;
						
					if(faction){
						if(!factionData[faction]){
							factionData[faction] = [];
						}
						factionData[faction].push({score: scoreData[0], position: scoreData[2].substring(1, scoreData[2].length-1), game: game, gameLink: gameLink});
					}
				}
			}
		}
		if(ledger){
			updateMoves(factionData, maxMoves);
		} else {
			for (var key in factionData) {
				if (factionData.hasOwnProperty(key)) {
					factionData[key].reverse();
				}
			}
		}
	}		
	return {data: factionData, ledger: ledger != undefined, oneLeech: oneLeech, multLeech: multLeech};
}

function updateMoves(factionData, maxMoves){
	for (var key in factionData) {	
		if (factionData.hasOwnProperty(key)) {
			var length = factionData[key].length;
			if(length < maxMoves){
				var lastMove = factionData[key][length-1]
				for(var k = length; k < maxMoves; k++){
					factionData[key].push(lastMove);
				}
			}
		}
	}
}

var gameData;
function loadGame(newGameName){
	chrome.storage.local.get('gameData', function(result) {	
		chrome.storage.local.get('currentGameName', function(result) {	
			chrome.storage.local.get('token', function (result) {
				var token;
				if(!result.token){
					token = getCSRFToken();
					if(!token) {
						alert("Error getting game info. Token invalid");
						return;
					}
				}
				
				$.ajax({  
					type: 'POST',
					async: false,
					url: "http://terra.snellman.net/app/view-game/",
					data: {
						"csrf-token": token,
						"game": newGameName
					},
					success: function(jsonObj) {
						gameData = jsonObj;
						currentGameName = newGameName;
						setupHeader();
						chrome.storage.local.set({'gameData': gameData});
						chrome.storage.local.set({'currentGameName': newGameName});
					}
				});
			});
		});
	});
}

function setupHeader(){	
	var url = window.location.href;
	var maxRow = gameData.ledger.length;	
	var hrefNext, hrefNext, row, prevRow, nextRow;	
    var urlParts = url.split("/");
	var chosen = urlParts[5];
	var faction;
	
	if (chosen != undefined && isFaction(chosen)) {		
		if (url.indexOf("max-row") != -1) {
			urlParts = url.split("=");
			row = parseInt(urlParts[1]);			
		} else {
			row = gameData.ledger.length-1;
		}
		
		for (var i = row - 1; i > -1; i--) { 
			if (gameData.ledger[i].faction == chosen) {
				prevRow = i;
				faction = chosen;
				break;
			}
		}
		
		for (var i = row + 1; i < gameData.ledger.length; i++) { 
			if (gameData.ledger[i].faction == chosen) {
				nextRow = i;
				faction = chosen;
				break;
			}
		}
	}
		
	if (url.indexOf("max-row") != -1) {
		url = url.split("=");
		row = parseInt(url[1]);
		hrefPrev = url[0] + "=" + (prevRow ? prevRow : (row - 1));
		hrefNext = url[0] + "=" + (nextRow ? nextRow : Math.min((row + 1), maxRow));
	} else {
		row = maxRow;
		hrefPrev = url + "/max-row=" + (row - 1);
		hrefNext = url;
	}	
	
	var jsInitChecktimer = setInterval(checkForJS_Finish, 111);
    function checkForJS_Finish () {
		var lastLogTD;
		if (faction != null) {
			if (("#ledger") != undefined) {
				lastLogTD = $("#ledger td:first-child:contains('" + faction + "')").last().parent().html();			
				if (lastLogTD == undefined) {
					lastLogTD = "<td>Log history not found, please go next</td>";
				}
			}
			
		} else {
			lastLogTD = $($("#ledger tr").last()[0]).html();
		}
		
        if (lastLogTD != undefined) {
            clearInterval (jsInitChecktimer);
		    setHeaderReplay(hrefPrev, hrefNext, lastLogTD)
        }
    }
}

function isFaction(faction) {
	var factions = ["alchemists", "auren", "chaosmagicians", "cultists", "darklings", "dwarves","engineers","fakirs","giants","halflings","mermaids","nomads",
	"swarmlings",	"witches","acolytes","dragonlords","icemaidens","yetis","riverwalkers","shapeshifters"];
	return factions.indexOf(faction) >= 0;	
}

function setHeaderReplay(hrefPrev, hrefNext, lastLogTD) {
	var description = '<table><tr><td>Replay[<a id="prev" href="' + hrefPrev + '">Prev</a>/<a id="next" href="' + hrefNext + '">Next</a>]&nbsp&nbsp' + "</td>" + lastLogTD + "</tr></table>";
	var replayCss = "margin-bottom: 5px;background-color: #eee;padding: 5px;border-style: solid;border-width: 1px;max-width: 1045px;";
	$('#header').after($('<div id="replay" style="'+ replayCss + '">' + description + '</div>'));
}

function setupReplayLinks(){
	var url = window.location.href;
	var parts = url.split("/");	
	if(parts[3] == "faction" || parts[3] == "game") {
		loadGame(parts[4]);
	}
}

function loadReplayInfo() {
	chrome.storage.local.get('replay', function(result) {
		var replay = (result.replay == undefined ? true : result.replay);
		if(replay) {
			setupReplayLinks();
			chrome.storage.local.set({'replay': replay });
		}
	});
}

$(function() {
	loadReplayInfo();
});