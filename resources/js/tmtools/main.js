var blue = "rgb(96, 192, 240)";
var red = "rgb(240, 128, 128)";
var green = "rgb(128, 240, 128)";
var yellow = "rgb(240, 240, 128)";
var black = "rgb(64, 64, 64)";
var brown = "rgb(176, 128, 64)";
var gray = "rgb(192, 192, 192)";
var white = "rgb(224, 240, 255)";
var orange = "rgb(240, 192, 96)";
var transparent = "rgb(255, 235, 205)";

var fontDark = "rgb(192, 192, 192)";
var fontLight = "rgb(0, 0, 0)";


function Faction(name, color) {
    this.name = name;
	this.color = color;
	this.font = color === black ? fontDark : fontLight;
}

var factions = {
	alchemists: new Faction("Alchemists", black),
	auren: new Faction("Auren", green),
	chaosmagicians: new Faction("Chaos Magicians", red),
	cultists: new Faction("Cultists", brown),
	darklings: new Faction("Darklings", black),
	dwarves: new Faction("Dwarves", gray),
	engineers: new Faction("Engineers", gray),
	fakirs: new Faction("Fakirs", yellow),
	giants: new Faction("Giants", red),
	halflings: new Faction("Halflings", brown),
	mermaids: new Faction("Mermaids", blue),
	nomads: new Faction("Nomads", yellow),
	swarmlings: new Faction("Swarmlings", blue),
	witches: new Faction("Witches", green),
	acolytes: new Faction("Acolytes", orange),
	dragonlords: new Faction("Dragonlords", orange),
	icemaidens: new Faction("Ice Maidens", white),
	yetis: new Faction("Yetis", white),
	riverwalkers: new Faction("Riverwalkers", transparent),
	shapeshifters: new Faction("Shapeshifters", transparent),
	all: new Faction("All", blue),
} 

document.addEventListener('DOMContentLoaded', function () {
});

function soundAlertClick(e){
	var checked = document.querySelector('#soundAlert').checked;
	chrome.storage.local.set({'alert':  checked});
	chrome.extension.sendMessage({directive: "popup-click" , stopSound: !checked }, function(response) { });
	$('#soundUpdate').prop("disabled", !checked);
}

function replayEnabledClick(e){
	var checked = document.querySelector('#replayEnabled').checked;
	chrome.storage.local.set({'replay':  checked});
}

function opponentsFilterClick(e){
	var checked = document.querySelector('#cbxOpponentsFilter').checked;
	chrome.storage.local.set({'opponentsFilter':  checked});
}

function lastMovesClick(e){
	var checked = document.querySelector('#cbxLastMoves').checked;
	chrome.storage.local.set({'lastMoves':  checked});
}

function playLinkClick(e) {
    chrome.extension.sendMessage({directive: "popup-click", stopSound: true}, function(response) { });
}

function playerNameFocusOut(e) {
	var playerName = document.querySelector('#playerName').value;
	chrome.storage.local.set({'playerName':  playerName});
}

function soundUpdateFocusOut(e) {
	var soundUpdate = document.querySelector('#soundUpdate').value;
	if (validateSoundUpdate(soundUpdate)) {
		chrome.storage.local.set({'soundUpdate':  soundUpdate});
		chrome.extension.sendMessage({directive: "update-sound", stopSound: false}, function(response) { });
	} else {
		chrome.storage.local.get('soundUpdate', function (result) {
			document.querySelector('#soundUpdate').value = (result.soundUpdate == undefined ? 30 : result.soundUpdate);
		});
	}
}

function validateSoundUpdate(soundUpdate) {
	if (isNaN(parseInt(soundUpdate))) {
		alert("Update rate must be an integer.");
		return false;
	} 
	
	if (parseInt(soundUpdate) < 30) {
		alert("Update rate must be at least 30s.");
		return false;
	}
	
	return true;
}

function factionClick(e) {	
	chrome.tabs.getSelected(null, function(tab){
		var type = document.querySelector('#byPlayer').checked ? "player" : "popup";
		var player = document.querySelector('#playerName').value;
        chrome.tabs.sendMessage(tab.id,{type: type, faction: e.target.id, sameLine: document.querySelector('#sameLine').checked, player: player}, loadChart);
		chrome.browserAction.setBadgeText({text: e.target.id == "All" ? "All" : e.target.id.charAt(0).toUpperCase()});
    });
}

var round;
function loadChart(chartData) {
	var factionData = chartData.data;
	var isLedger = chartData.ledger;
	var data = [];
	var all = false;
	
	if(chartData.oneLeech){
		document.querySelector("#oneLeech").innerHTML = chartData.oneLeech;
		document.querySelector("#oneLeechSpan").style.visibility = "visible";
	} else {
		document.querySelector("#oneLeechSpan").style.visibility = "hidden";
	}
	
	if(chartData.multLeech){
		document.querySelector("#multLeech").innerHTML = chartData.multLeech;
		document.querySelector("#multLeechSpan").style.visibility = "visible" ;
	} else {
		document.querySelector("#multLeechSpan").style.visibility = "hidden";
	}
	
	var maxScore = 0;
	var minScore = 9999;
	for (var key in factionData) {
		if (factionData.hasOwnProperty(key)) {
			var dataPoints = [];
			var score;
			for(var i = 0; i < factionData[key].length; i++){
				score = parseInt(factionData[key][i].score);
				maxScore = score > maxScore ? score : maxScore;
				minScore = score < minScore ? score : minScore;
				var marker = isLedger ? getRoundMarker(factionData[key][i].game, factions[key].color) : getPositionMarker(factionData[key][i].position, factions[key].color);
				dataPoints.push({
					x: i+1,
					y: score,
					indexLabel: isLedger ? marker.label : factionData[key][i].position,
					color: factions[key].color,
					toolTipContent: "Game: <a target='_blank' href = " + factionData[key][i].gameLink + " >" + factionData[key][i].game + "</a><br/>VP: {y}<br/>" + 
					(isLedger ? factionData[key][i].action : "Position: {indexLabel}") + "<br/>Faction: " + factions[key].name,
					markerType: marker.type,
					markerColor: marker.color,
					markerSize: marker.size
				});
			}
			round = null;
			data.push({
			  type: "spline",
			  showInLegend: true,
			  name: factions[key].name,
			  color: factions[key].color,
			  dataPoints: dataPoints,
			  indexLabelFontSize: 13
			});
			if(key == "all"){
				all = true;
			}
		}
	}
	var maximum = Math.ceil((maxScore+1)/20)*20;
	var minimum = Math.ceil(minScore/20)*20;
	chart = new CanvasJS.Chart("chartContainer", {
		    animationEnabled: true,
			creditHref: "",
			creditText: "",
			exportEnabled: true,
			title:{
				text: "Score History",
				fontFamily: "sans-serif",
				fontSize: 16,
				fontWeight: "normal"
			},
			axisX:{
				interval: isLedger ? 10 : (all ? 20 : 1)
			},
			axisY:{
				interval: 20,
				maximum: maximum,
				minimum: isLedger ? 0 : (minScore > 0 ? minimum - 20 : 0)
			},
			data: data
		});
	chart.render();
}

function getRoundMarker(nextRound, color) {
	if (nextRound != round) {
		round = nextRound;
		return { type: "circle", color: color, size: 10, label: nextRound};
	} 
	return { type: "", color: "", size: "", label: ""};
}

function getPositionMarker(position, color) {
	if (position == 1) {
		return { type: "triangle", color: "green", size: 10, label: position};
	} 
	return { type: "cross", color: "red", size: "8", label: position};
}

$(document).ready(function(){
	chrome.storage.local.get('playLink', function (result) {
		$('#playLink').attr("href", result.playLink == undefined ? "" : result.playLink);
    });
	
	chrome.storage.local.get('playerName', function (result) {
		$('#playerName').val(result.playerName == undefined ? "" : result.playerName);
	});
	
	chrome.storage.local.get('soundUpdate', function (result) {
		$('#soundUpdate').val(result.soundUpdate == undefined ? 30 : result.soundUpdate);
	});
	
	chrome.storage.local.get('filter', function (result) {
		var value = (result.filter == undefined ? "bySite" : result.filter);
		$('input:radio[name=filter]').filter('[value=' + value + ']').prop('checked', true);
		$('#playerName').prop("disabled", value == "bySite");
	});
	
	chrome.storage.local.get('alert', function (result) {
		var alert = (result.alert == undefined ? true : result.alert);
		$('#soundAlert').prop('checked', alert);
		$('#soundUpdate').prop("disabled", !alert);
	});
	
	chrome.storage.local.get('replay', function (result) {
		$('#replayEnabled').prop('checked', result.replay == undefined ? true : result.replay);
	});
	
	chrome.storage.local.get('opponentsFilter', function (result) {
		$('#cbxOpponentsFilter').prop('checked', result.opponentsFilter == undefined ? true : result.opponentsFilter);
	});
	
	chrome.storage.local.get('lastMoves', function (result) {
		$('#cbxLastMoves').prop('checked', result.lastMoves == undefined ? true : result.lastMoves);
	});

	$("#byPlayer").change(function(){
		$('#playerName').prop("disabled", false);
		chrome.storage.local.set({'filter': "byPlayer" });
	});
	
	$("#bySite").change(function(){
		$('#playerName').prop("disabled", true);
		chrome.storage.local.set({'filter': "bySite" });
	});
	
	var divs = document.querySelectorAll('.factions div');
	for (var i = 0; i < divs.length; i++) {
		divs[i].addEventListener('click', factionClick);
	}
	
	document.getElementById('playLink').addEventListener('click', playLinkClick);
	document.getElementById('playerName').addEventListener('focusout', playerNameFocusOut);
	document.getElementById('soundAlert').addEventListener('click', soundAlertClick);
	document.getElementById('soundUpdate').addEventListener('focusout', soundUpdateFocusOut);
	document.getElementById('replayEnabled').addEventListener('click', replayEnabledClick);
	document.getElementById('cbxOpponentsFilter').addEventListener('click', opponentsFilterClick);
	document.getElementById('cbxLastMoves').addEventListener('click', lastMovesClick);
});