function loadCounter(){
	chrome.storage.local.get('token', function (result) {
		if (result.token) {
			getCounter(result.token);
		} else {
			chrome.tabs.query({"active": true}, function(tabs) {
				var tabId = tabs[0].id;
				chrome.tabs.sendMessage(tabId, {type: 'csrf-token'}, getCounter);
			});
		}
    });
}

var audio;
function getCounter(token)
{
	if(token){
		chrome.storage.local.set({'token': token});
	} else {
		return;
	}
	
	$.ajax({  
		type: 'GET',
        url: "https://terra.snellman.net/app/list-games?mode=user&status=running&csrf-token=" + token,
        success: function(jsonObj) 
		{
			var count = 0;
			var link = "https://terra.snellman.net";
			var games = jsonObj.games;
			chrome.storage.local.get('alert', function (result) {
				for (var i = 0; i < games.length; i++){
					if(games[i].action_required == 1 ||  games[i].unread_chat_messages > 0){
						count += 1;
						if(count == 1){
							link += games[i].link;
							if(!audio) {
								audio = new Audio("resources/sound/alert.mp3");
							}
							if(result.alert == undefined || result.alert){
								audio.play();
							}
						}
					}
				}
				
				if(audio && count == 0){
					audio.pause();
				}				
				chrome.storage.local.set({'playLink': link });
				chrome.browserAction.setBadgeText({text: count.toString()});
			});
		},
		error: function(data) {
			console.log("Error getting games. " + data);
			chrome.browserAction.setBadgeText({text: 'Error'});
			chrome.storage.local.remove("token");
		}
    });
}

var alertInterval;
function updateSound(){
	if(alertInterval) {
		clearInterval(alertInterval);
	}
	chrome.storage.local.get('soundUpdate', function (result) {
		var soundUpdate = (result.soundUpdate == undefined ? 30 : result.soundUpdate);		
		alertInterval = setInterval(function(){ loadCounter(); }, parseInt(soundUpdate) * 1000);
	});
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
        case "popup-click":
			if(audio && request.stopSound){
				audio.pause();
			} 			
            sendResponse({});
            break;
		case "update-sound": 
			updateSound();
			sendResponse({});
			break;
        default:
            alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);

$(document).ready(function() {
	chrome.browserAction.setBadgeText({text: "..."});	
	updateSound();
});