

async function requestNewNote(){
    //get the current active tab
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    //sending message to content.js of this tab
    
    let response = await chrome.tabs.sendMessage(tab.id,{action: "createnote", isPop: false});
    console.log(response, "message sent");
}


document.addEventListener("DOMContentLoaded", () => {
    newnote_button = document.getElementById("newnote");
    newnote_button.addEventListener("click", requestNewNote);
});

document.getElementById('managenotes').addEventListener('click', async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.sidePanel.open({ tabId: tab.id });
    //should be auto call 
    // chrome.runtime.sendMessage({action: "getnotesforurl", url: tab.url}, (response) => {
    //     console.log("Sidepanel opened");
    // });
});