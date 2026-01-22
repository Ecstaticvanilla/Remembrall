// const { createElement } = require("react");

document.getElementById('managenotes').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.sidePanel.open({ tabId: tab.id });
});

// document.getElementById('addnotes').addEventListener('click', async () => {
//     const note = document.createElement("n");
//     document.body.appendChild(note);
//     create();

// });
// getCurrentTab();

//recieve message from popup.js for note creation
chrome.runtime.onMessage.addListener(async (request) => {
    console.log("in the contentjs")
    if (request.action === 'createnote') {
        const note = document.createElement("textarea");
        note.style.backgroundColor="black";
        // note.style.height="100px";
        // note.style.width="100px";
        note.style.position="relative";
        note.style.top="0px";
        note.style.left="100px";
        note.style.zIndex="4000";
        note.innerText="THIS IS A NOTE!!!";
        note.id="10";
        
        note.style.resize="both";

        document.head.appendChild(note);
        console.log("created note");
    }
    
    return true;
});
