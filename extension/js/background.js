
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
// Adding 
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        title: "Add \"%s\" to Notes", 
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



//Managing indexDB
let db = null;
const request = indexedDB.open("Remembrall");

request.onupgradeneeded = (event) => {
    db = event.target.result;
    console.log(`database created: ${db}`);

    const url = db.createObjectStore('urlTable', {keyPath: "url"});
    const notes = db.createObjectStore('notesTable', {keyPath: "id"});
}

request.onsuccess = (event) => {
    db = event.target.result;
    console.log(`database opened, db: ${event.target.result}`);

    addToNote("101","this is sick");
    addToNote("102", "swayam is dumb");
}

request.onerror = (event) => {
    console.log(`database not opened error: ${event.target.error}`);
}


// //handle indexdb request from contentjs
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//     console.log("message Recieved")
//     if(request.action === "indexdb_object"){
//         sendResponse({data: db})
//     }
//     return true;
// });

function addToUrl(url,id){
    //create transaction for urltable
    const transactionUrl = db.transaction('urlTable',"readwrite");
    const urlTable = transactionUrl.objectStore('urlTable');

    //logic to add ids for url

    //first get ids already mapped to the url
    const req = urlTable.get(url);
    req.onsuccess = () => {
        const ids = [id];
        const res = req.result;
        console.log(`fetched result from urltable: ${res}`);

        if(res === undefined){
            const data = {
                url: url,
                value: [id]
            }
            urlTable.add(data);
        }
        else{

            res.value.push(id);
            const putReq = urlTable.put(res);
        }

        transactionUrl.onsuccess = () =>{
            console.log("transaction succuessful" + id + " added in db");
        }
    }
}

function addToNote(id,content){
    const transactionNote = db.transaction('notesTable', "readwrite");
    const notesTable = transactionNote.objectStore('notesTable');

    //logic to add ids for url

    //first get ids already mapped to the url
    const req = notesTable.get(id);
    req.onsuccess = () => {
        const res = req.result;
        console.log(`fetched result from notesTable: ${res}`);

        if(res === undefined){
            const data = {
                id: id,
                value: content
            }
            notesTable.add(data);
        }
        else{
            res.value = content;
            const putReq = notesTable.put(res);
        }
        transactionNote.onsuccess = () =>{
            console.log("transaction succuessful" + id + " added in db");
        }
    }
}


// add to note request from contentjs
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("message for note recieved: " + request);
    
    if(request.action === "addToNote"){
        //addToNote(request.noteID,)
        addToNote(request.noteId,request.noteText);
        sendResponse({status: true});
    }
    else if(request.action === "addToUrl"){
        addToUrl(request.noteURL,request.noteId);
    }
    else{
        sendResponse({status: false});
    }
    return true;
});

