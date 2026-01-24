
// function getword(info,tab) {
//   console.log("Word " + info.selectionText + " was clicked.");
//   chrome.tabs.create({  
//     url: "http://www.google.com/search?q=" + info.selectionText
//   });
// }
const CONTEXT_MENU_ID = "ADD_NOTE";
// function getword(info,tab) {

//   console.log("Word " + info.selectionText + " was clicked.");
//   chrome.tabs.create({  
//     url: "http://www.google.com/search?q=" + info.selectionText
//   });
// }
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
    title: "Add %s to Notes", 
    contexts:["selection"], 
    id: CONTEXT_MENU_ID
    });
});

async function addToNotes(info,tab){
    if (info.menuItemId !== CONTEXT_MENU_ID) {
        return;
    }
    // let queryOptions = { active: true, lastFocusedWindow: true };
    // let [tab] = await chrome.tabs.query(queryOptions);
    let noteUrl =  tab.url.split('#')[0];
    console.log("Note : \"" + info.selectionText +"\". \nurl : " + noteUrl  );
    // put logic to add action createnote message note msg to content.js
    let response = await chrome.tabs.sendMessage(tab.id,{action: "createnote", noteText: info.selectionText, noteURL: noteUrl});
    console.log(response, "note added from context menu");

    return;
}

chrome.contextMenus.onClicked.addListener(addToNotes)

// async function getCurrentTab(info,tab) {

//     let queryOptions = { active: true, lastFocusedWindow: true };
//     let [tab] = await chrome.tabs.query(queryOptions);
//     console.log("context menu : " + tab.url);
//     return tab;
// }

chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: false })
    .catch((error) => console.error(error));

