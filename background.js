import {pthh} from './service/pthh.js';

chrome.contextMenus.create({
    "id": "bce",
    "title": "Balance chemical equations",
    "contexts": ["selection"]
});


chrome.contextMenus.onClicked.addListener(function(info) {
    console.log(info.menuItemId);
    if (info.menuItemId === 'bce') {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length > 0) {
          // storage set selectionText
            chrome.storage.sync.set({'selectionText': info.selectionText});
            
            // chrome.tabs.sendMessage(tabs[0].id, { text: info.selectionText });
            chrome.notifications.create("notification_id", {
              type: "basic",
              iconUrl: "image/icon.png",
              title: "Thông báo từ HaiZuka",
              message: pthh(info.selectionText)['text'],
            }, function(notificationId) {
              if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
              } else {
                console.log("Thông báo đã được tạo với ID:", notificationId);
              }
            });
        } else {
          console.log("No active tabs found.");
        }
      })
    }
  });

