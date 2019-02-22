// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Add your Analytics tracking ID here.
 */
//var _AnalyticsCode = 'UA-86751916-1'; //For Web Store tracking
var _AnalyticsCode = 'UA-86751916-2'; //For Dev Mode tracking

/**
 * Below is a modified version of the Google Analytics asynchronous tracking
 * code snippet.  It has been modified to pull the HTTPS version of ga.js
 * instead of the default HTTP version.  It is recommended that you use this
 * snippet instead of the standard tracking snippet provided when setting up
 * a Google Analytics account.
 */
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

function trackClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
};

function trackHover(e) {
  _gaq.push(['_trackEvent', e.target.id, 'hover']);
};
  
(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
  
  document.getElementById('playLink').addEventListener('click', trackClick);
  
  document.getElementById('helpOptions').addEventListener('mouseover', trackHover);
  document.getElementById('helpStatistics').addEventListener('mouseover', trackHover);
  document.getElementById('bySite').addEventListener('mouseover', trackHover);
  document.getElementById('byPlayer').addEventListener('mouseover', trackHover);
  
  document.getElementById('donateLink').addEventListener('click', trackClick);
  document.getElementById('donateLink').addEventListener('mouseover', trackHover);
})();