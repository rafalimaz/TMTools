# TMTools

**TMTools** is a helpfull chrome extension for Snellman's Terra Mystica moderator [website](http://terra.snellman.net). Its is designed to provide some features which are still not implemented on original website like more sound alerts and more flexible filters. Also provides some graphs and statistics to help newcomers evaluate their overall improvement on the game. If you have suggestions, doubts or other stuff just contact [me](https://github.com/rafalimaz)

### Motivation

The main motivation for building this extension was the need to improve my gameplay. I started to see games from best players of the site and one day I saw a very interesting game from the known great player [Xevoc](http://terra.snellman.net/player/Xevoc), the [Petri20](http://terra.snellman.net/game/Petri20). In this game he crossed the 200VP barrier and for me that was the best that I could reach. As my objective was study only his moves I created a simple script (javascript) to filter the log. So that helped me a lot to improve my overall gameplay with [Engineers](http://www.terra-mystica-spiel.de/en/voelker.php?show=8) (I went from an average of 110VP to a respectable 174VP on a 3 player [game](http://terra.snellman.net/game/TheInvestors))

### Installation

##### Chrome Web Store

In order to use TMTools just install the extension from [Chrome Web Store](https://chrome.google.com/webstore/detail/tm-tools/jandhnpfekgdcklcgfcljmijgbgnchni)

##### Development Mode

It is possible to use TMTools without install the extension through Chrome Web Store. It is only need to download TMTools zip [Last Release] (https://api.github.com/repos/rafalimaz/tmtools/zipball) and do the steps as follows:

1. Extract the contents somewhere
2. In Chrome, open [extensions](chrome://extensions/) `chrome://extensions/`
3. Click + Developer mode
4. Click Load unpacked extension…
5. Navigate to the extracted folder and click OK `..\TMTools-{version}\TMTools-{version}`
6. Log into Terra Mystica [website](http://terra.snellman.net) `http://terra.snellman.net/`
7. An active games counter should appear on browser

### Main features

#### Main page
 * The main page of the extension has all features and links. It was designed that way to make easily find features and settings. It can be seen on the following picture:

![ScreenShot](https://github.com/rafalimaz/TMTools/blob/master/screenshots/2_mainPage.png)

#### Filter games and graphics
  * **By player**: User should open the extension, provide a player name and click on some faction. It will show match data on a graph.
  
![ScreenShot](https://github.com/rafalimaz/TMTools/blob/master/screenshots/4_filterByPlayer.png)

  * **By site** (finished games): User should open a finished games page of some player that shows a list with all games played. After this, the user should open the extension. By clicking on a faction it will filter that list showing only games for this specific faction. Also a graph is showed with these games.
  
![ScreenShot](https://github.com/rafalimaz/TMTools/blob/master/screenshots/6_filterBySiteFinished.png)

  * **By site** (game log): User should open a game (active or finished). After this, the user should open the extension. By clicking on a faction that is current in play it will filter the log showing only moves from that faction. Also a graph is showed with these moves and score history for that faction.

![ScreenShot](https://github.com/rafalimaz/TMTools/blob/master/screenshots/7_filterBySiteGame.png)

#### Browser Notification
  * A **counter** of the games which it is the player's turn appears on the extension browser button. Also there is a **go to site** link that opens the first opened game for the player.
  
 ![ScreenShot](https://github.com/rafalimaz/TMTools/blob/master/screenshots/1_browseButton.png)

#### Sound Alert
  * If enabled, a **sound alert** will play every time there are some games which is the player's turn according to the update rate set (default is 30 seconds).

### Known Issues
* If user removes (unpacked) source files after installing the plugin, Chrome disables the plugin because the manifest file becomes unavailable. Users should keep source files. Thanks [Konush](http://terra.snellman.net/player/konush)

### Changelog

##### 1.0.6 Last Moves (2017-09-15)
  * Added last moves to game page
  * Some fixes on graphs (max and min value)
  * Added help icons and improved tooltips
  
##### 1.0.5 Filter games by opponent (2016-11-09)
  * Fixed a bug on replay feature
  
##### 1.0.4 Filter games by opponent (2016-11-09)
  * Added markers representing rounds and win/lose on graphs
  * Added opponent' filter on profile user page
  * Added first and last links to replay area
  * Improvements on replay feature

##### 1.0.3 Filter by faction on replay (2016-11-02)
  * Added replay filter by faction 
  * Added paypal donate button
  * Added analytics tracking code for developer mode
  * Added analytics support
  * Added TMTools to Chrome Web Store
  
##### 1.0.2 Replay Improvement (2016-11-01)
  * Added more info on replay area as suggested by ttchong
  * Fixed a bug on counter caused by chrome API update
  
##### 1.0.1 Fix on counter (2015-12-31)
  * Fixed bug on counter reported by CTKShadow

##### 1.0 Replay function (2015-01-22)
  * Added replay feature with prev/next buttons

##### 0.9 Initial version (2015-01-19)
  * Added main features like counter, filters, graphs and sound alert

### Useful Links
  * [BGG Discussion](http://boardgamegeek.com/thread/1305425/tmtools-chrome-extension-snellman-site)
  * [Snellman's website](http://terra.snellman.net)
  * [TM AI](http://lodev.org/tmai/)
  * [Terra Mystica Strategy Guide](http://boardgamegeek.com/filepage/104541/terra-mystica-strategy-reference-guide)
  

### Credits
Terra Mystica is a trademark of [Feuerland Spiele](http://www.feuerland-spiele.de/en/). Terra Mystica website was created by [Juho Snellman](https://www.snellman.net/). TMTools extension was created by [Rafael de Lima](https://github.com/rafalimaz)






