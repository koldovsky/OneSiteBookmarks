// ==UserScript==
// @name         Site-only bookmarks
// @namespace    http://productivityscientific.com
// @version      1
// @description  Allows to create and use bookmarks for pages on the website available from home page of the website
// @author       Vyacheslav Koldovskyy
// @grant        none
// @include      *
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant 		GM_registerMenuCommand
// ==/UserScript==
// match        http://*/*


/*
// Create sample data
var sampleData = {
    'www.google.com.ua' : {
         rootPage: 'https://www.google.com.ua/?gfe_rd=cr&ei=d2ZWVISLLsSk8we6j4CADw&gws_rd=ssl',      
         links: {
			'Analytics' : 'http://google.com/analytics/',
        	'GMail' : 'http://google.com/mail/',
			'Analytics2' : 'http://google.com/analytics/',
        	'GMail2' : 'http://google.com/mail/',
			'Analytics3' : 'http://google.com/analytics/',
        	'GMail3' : 'http://google.com/mail/',
			'Analytics4' : 'http://google.com/analytics/',
        	'GMail4' : 'http://google.com/mail/',
			'Analytics5' : 'http://google.com/analytics/',
        	'GMail5' : 'http://google.com/mail/',
        }
    }
};
saveWebSitesData(sampleData);
*/


// Draggable support
$.fn.draggable = function(){
    var $this = this,
    ns = 'draggable_'+(Math.random()+'').replace('.',''),
    mm = 'mousemove.'+ns,
    mu = 'mouseup.'+ns,
    $w = $(window),
    isFixed = ($this.css('position') === 'fixed'),
    adjX = 0, adjY = 0;

    $this.mousedown(function(ev){
        var pos = $this.offset();
        if (isFixed) {
            adjX = $w.scrollLeft(); adjY = $w.scrollTop();
        }
        var ox = (ev.pageX - pos.left), oy = (ev.pageY - pos.top);
        $this.data(ns,{ x : ox, y: oy });
        $w.on(mm, function(ev){
            ev.preventDefault();
            ev.stopPropagation();
            if (isFixed) {
                adjX = $w.scrollLeft(); adjY = $w.scrollTop();
            }
            var offset = $this.data(ns);
            $this.css({left: ev.pageX - adjX - offset.x, top: ev.pageY - adjY - offset.y});
        });
        $w.on(mu, function(){
            $w.off(mm + ' ' + mu).removeData(ns);
        });
    });

    return this;
};


GM_registerMenuCommand('Create site bookmarks here', createBookMarksHere);
GM_registerMenuCommand('Add this page to site bookmarks', addPageToBookmarks);
GM_registerMenuCommand('Debug: output site bookmarks to log', outputSitebookmarksToLog);


var websites = getWebSites();

function createBookMarksHere() {
   	var currPage =  window.location.href;
   	var currHost = window.location.host;
    var currHostData = websites[currHost];
    if (currHostData) {
        currHostData.rootPage = currPage;
    }
   saveWebSitesData(websites);
}

function addPageToBookmarks() {
    var currHost = window.location.host;
  	var webSiteData = getWebSiteData(currHost);
    if (webSiteData) {
        var linkTitle = prompt('Please enter a caption for a link', '');
        if (linkTitle === '') return;
        webSiteData.links[linkTitle] = window.location.href;
        saveWebSitesData(websites);
    }
    else
    {
    	alert('First create root bookmarks page for ' + currHost);
    }
}

function outputSitebookmarksToLog() {
	console.log(websites);    
}
        

function getWebSites() {
    return JSON.parse(GM_getValue('websites', '{}'));
}


var menu = '';
if (websites) {
    for (var hostName in websites) {
        var website = websites[hostName];
        if ((hostName === window.location.host) & 
            (website.rootPage === window.location.href)) {
        	for (var linkName in website.links)
        	{
	            menu += '<li><a href="' + website.links[linkName] + '">' + linkName + '</a></li>';
    	    }
        }
    }
}

// Create menu
if (menu !== '')
{
  menuobj = document.createElement('ul');
  menuobj.id = 'site_bookmarks_menu';
  menuobj.style.position = 'fixed';
  menuobj.style.top = '10px';
  menuobj.style.left = '10px';
  menuobj.style.padding = '20px';
  menuobj.style.backgroundColor = '#fff';
  menuobj.innerHTML = menu;
  body = document.getElementsByTagName('body')[0];
  body.appendChild(menuobj);
  $('#site_bookmarks_menu').draggable();
}


function addToWebSites(thePage) {    
  	var webSites = getWebSites();
    if (!webSites[thePage]) {
        webSites[thePage] = {};
    }
}

function getWebSiteData(webSiteId) {
    if (websites) {
       return websites[webSiteId];
    }
    return false;
}

function findWebSiteIdByPageName(pageName) {
	var webSites = getWebSites();
    for (var key in webSites) {
    	    
    }       
}

function setWebSiteData(webSiteId, data) {
	var webSites = getWebSites();
    webSites[webSiteId] = data;
}

function saveWebSitesData(websites) {
    GM_setValue('websites', JSON.stringify(websites));
}
