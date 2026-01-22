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
function create() {
    var box = document.createElement("div");
    box.setAttribute('class', 'itembox')
    var holder = document.createElement("p");
    holder.setAttribute('class', 'output');
    holder.innerText = "The text in the box"
    box.appendChild(holder);
    var notes = document.getElementById("notes");
    notes.appendChild(box);
}
