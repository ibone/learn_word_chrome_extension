var win = null,
    url = "http://127.0.0.1:3000/get_word/";


var createPopup = function() {
    var option_window = {
        url: url,
        width: 620,
        height: 700,
        focused: true,
        type: "popup"
    }
    if(!win){
        chrome.windows.create(option_window, function(_win) {
            win = _win;
        });
        return;
    }
    if(!win.tabs[0]){
        win = null;
        return createPopup();
    }
    chrome.windows.update(win.id, { focused: true });
    chrome.tabs.update(win.tabs[0].id, {url: url,active: true});
    win.tabs[0].url = url;
}

chrome.browserAction.onClicked.addListener(function(tab) {
    if(win) {
        chrome.windows.update(win.id, { focused: true });
        chrome.tabs.update(win.tabs[0].id, {url: url,active: true});
        win.tabs[0].url = url;
    } else {
        createPopup();
    }  
})
var timeid = null;

chrome.windows.onFocusChanged.addListener(function(id){
    if(1===id && !timeid){
        get_word();
    }
})

function get_word(){
    var num = 60
    timeid = setInterval(function(){
        chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
        chrome.browserAction.setBadgeText({ text: (num--)+'' });
    },1000)
    setTimeout(function(){
        clearInterval(timeid);
        timeid = null;
        createPopup();
    },num*1000)
    chrome.browserAction.setBadgeBackgroundColor({color:[255, 0, 0, 255]});
    chrome.browserAction.setBadgeText({ text: (num--)+'' });
}
get_word();
chrome.windows.onRemoved.addListener(function(windowId) {
    if(!win) return;
    if(windowId = win.id){
        win = null;
        get_word();
    }
});
// contextMenus
chrome.contextMenus.onClicked.addListener(function translateOnClickMenu(info, tab){
    if(win) {
        chrome.windows.update(win.id, { focused: true });
        chrome.tabs.update(win.tabs[0].id, {url: url,active: true});
        win.tabs[0].url = url;
    } else {
        createPopup();
    }
});

chrome.contextMenus.create({"title": "客官来看一下嘛～", "contexts": ["all"], "id": "客官来看一下嘛～"});