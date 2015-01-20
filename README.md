# TMTools

**TMTools** is a helpfull chrome extension for Snellman's Terra Mystica moderator website. Its is designed to provide some features which are still not implemented on original website like more sound alerts and more flexible filters. Also provides some graphs and statistics to help newcomers evaluate their overall improvement on the game.

### Motivation

The main motivation for building this extension was the need to improve my gameplay. I started to see games from best players of the site and one day I saw a very interesting game from the knowed great player [Xevoc](http://terra.snellman.net/player/Xevoc), the [Petri20](http://terra.snellman.net/game/Petri20). In this game he crossed the 200VP barrier and for me that was the best that I could reach. As my objective was study only his moves I created a simple script (javascript) to filter the log. So that helped me a lot to improve my overall gameplay with [Engineers](http://www.terra-mystica-spiel.de/en/voelker.php?show=8).

### Usage Instructions

#### Installation

In order to use TMTools, download [TMTools](https://github.com/rafalimaz/TMTools/archive/master.zip) zip file (`https://github.com/rafalimaz/TMTools/archive/master.zip`) and follow these steps:

1. Extract the contents somewhere
2. In Chrome, open [chrome://extensions/](chrome://extensions/)
3. Click + Developer mode
4. Click Load unpacked extension…
5. Navigate to the extracted folder and click OK (`..\TMTools-master\TMTools-master`)
6. Log into [Terra Mystica Website](http://terra.snellman.net) (`http://terra.snellman.net/`)
7. An active games counter should appear on browser

#### Main features

1. Filter games and graphics
  * **By player**: player should open the extension, provide a player name and click on some faction. It will show match data on a graph.
  * **By site** (finished games): User should open a finished games page of some player that shows a list with all games played. After this, the user should open the extension. By clicking on a faction it will filter that list showing only games for this specific faction. Also a graph is showed with these games.
  * **By site** (game log): User should open a game (active or finished). After this, the user should open the extension. By clicking on a faction that is current in play it will filter the log showing only moves from that faction. Also a graph is showed with these moves and score history for that faction.

2. Browser Notification
  * A **counter** of the games which it is the player's turn appears on the extention browser button. Also there is a **got to site** link that opens the first opened game for the player.
 
3. Sound Alert
  * If enabled, a **sound alert** will play every time that is some games which is the player's turn according to the update rate in seconds that is set (default is 30 seconds).


