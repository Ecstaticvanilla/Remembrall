

async function requestNewNote(){
    //get the current active tab
    let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    //sending message to content.js of this tab
    
    let response = await chrome.tabs.sendMessage(tab.id,{action: "createnote"});
    console.log(response, "message sent");
}


document.addEventListener("DOMContentLoaded", () => {
    newnote_button = document.getElementById("newnote");
    newnote_button.addEventListener("click", requestNewNote);
});
