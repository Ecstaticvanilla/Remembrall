//=====Sidepanel functions ===========

noteui = `
<button id= "deletenote" >Del</button>
`;

//maybe remove later
// const port = chrome.runtime.connect({name: 'sidePanel'});
// setTimeout(() => port.postMessage('getnotes'),1000); 

document.addEventListener('DOMContentLoaded', () => {
    chrome.runtime.sendMessage({action: "getnotesforurl"}, (response) => {
        console.log("Sidepanel opened");
    });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addnotetosidepanel"){

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "rows";

        const note = document.createElement("li");
        note.id = request.noteId;
        note.innerText = request.noteText;
        
        const options = document.createElement("div");
        options.innerHTML = noteui;

        container.appendChild(note);
        container.appendChild(options);
        document.getElementById('noteslist').appendChild(note);
    }
});