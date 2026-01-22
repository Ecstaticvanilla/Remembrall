async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log(tab);
    return tab;
}

// getCurrentTab();


async function createNewNote(){

}

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