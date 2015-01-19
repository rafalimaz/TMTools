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

function alertClick(e){
	var checked = document.querySelector('#soundAlert').checked;
	chrome.storage.local.set({'alert':  checked});
	chrome.extension.sendMessage({directive: "popup-click" , stopSound: !checked }, function(response) { });
}

function playClick(e) {
    chrome.extension.sendMessage({directive: "popup-click", stopSound: true}, function(response) { });
}

function click(e) {	
	chrome.tabs.getSelected(null, function(tab){
		var type = document.querySelector('#byPlayer').checked ? "player" : "popup";
		var player = document.querySelector('#playerName').value;
        chrome.tabs.sendMessage(tab.id,{type: type, faction: e.target.id, sameLine: document.querySelector('#sameLine').checked, player: player}, loadChart);
		chrome.browserAction.setBadgeText({text: e.target.id == "All" ? "All" : e.target.id.charAt(0).toUpperCase()});
    });
}

function flowClick(e) {
	chrome.tabs.getSelected(null, function(tab){
	    chrome.tabs.sendMessage(tab.id, {type: e.target.id});
		chrome.browserAction.setBadgeText({text: e.target.id});
	});
}

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
	
	for (var key in factionData) {	
		if (factionData.hasOwnProperty(key)) {
			var dataPoints = [];	
			for(var i = 0; i < factionData[key].length; i++){
				dataPoints.push({
					x: i+1, 
					y: parseInt(factionData[key][i].score), 
					indexLabel: isLedger ? "" : factionData[key][i].position,
					color: factions[key].color,
					toolTipContent: "Game: <a target='_blank' href = " + factionData[key][i].gameLink + " >" + factionData[key][i].game + "</a><br/>VP: {y}<br/>" + 
					(isLedger ? factionData[key][i].action : "Position: {indexLabel}") + "<br/>Faction: " + factions[key].name,
				});
			}
			data.push({
			  type: "line",
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
	chart = new CanvasJS.Chart("chartContainer", {
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
				maximum: 220,
				minimum: isLedger ? 0 : 20
			},
			data: data
		});
	chart.render();
}

$(document).ready(function(){
	chrome.storage.local.get('link', function (result) {
		if(result.link){
			document.querySelector('#playLink').href = result.link;
		}
    });
	
	var divs = document.querySelectorAll('.factions div');
	for (var i = 0; i < divs.length; i++) {
		divs[i].addEventListener('click', click);
	}
	document.getElementById('playLink').addEventListener('click', playClick);
	document.getElementById('soundAlert').addEventListener('click', alertClick);
	
	chrome.storage.local.get('alert', function (result) {
		if(result.alert == undefined){
			chrome.storage.local.set({'alert': true });
			result.alert = true;
		}
		document.getElementById('soundAlert').checked = result.alert;
	});
});