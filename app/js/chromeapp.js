'use strict';

chome.browserAction.onClicked.addListener(function(tab){
    chome.tabs.create({ url: chome.extension.getUrl('index.html')});
});
