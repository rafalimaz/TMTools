function loadCounter(){
	chrome.storage.local.get('token', function (result) {
		if(result.token){
			getCounter(result.token);
		} else {
			chrome.tabs.getSelected(null, function(tab){
				chrome.tabs.sendMessage(tab.id, {type: 'csrf-token'}, getCounter);
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
		alert("Error getting games. Token invalid");
		return;
	}
	
	$.ajax({  
		type: 'GET',
        url: "http://terra.snellman.net/app/list-games?mode=user&status=running&csrf-token=" + token,  
        success: function(jsonObj) 
		{
			var count = 0;
			var link = "http://terra.snellman.net";
			var games = jsonObj.games;
			chrome.storage.local.get('alert', function (result) {
				for (var i = 0; i < games.length; i++){
					if(games[i].action_required == 1 ||  games[i].unread_chat_messages > 0){
						count += 1;
						if(count == 1){
							link += games[i].link;
							if(!audio) {
								audio = new Audio("alert.mp3");
							}
							if(result.alert){
								audio.play();
							}
						}
					}
				}
				
				if(audio && count == 0){
					audio.pause();
				}				
				chrome.storage.local.set({'link': link });
				chrome.browserAction.setBadgeText({text: count.toString()});
			});
		},
		error: function(data) {
			console.log("Error getting games. " + data);
			chrome.browserAction.setBadgeText({text: '0'});
		}
    });
}

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        switch (request.directive) {
        case "popup-click":
			if(request.stopSound){
				audio.pause();
			} 			
            sendResponse({}); // sending back empty response to sender
            break;
        default:
            // helps debug when request directive doesn't match
            alert("Unmatched request of '" + request + "' from script to background.js from " + sender);
        }
    }
);

$(document).ready(function() {
	chrome.browserAction.setBadgeText({text: "..."});
	setInterval(function(){ loadCounter(); }, 30000);
});