// const { createElement } = require("react");

// document.getElementById('managenotes').addEventListener('click', async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.sidePanel.open({ tabId: tab.id });
// });

// document.getElementById('addnotes').addEventListener('click', async () => {
//     const note = document.createElement("n");
//     document.body.appendChild(note);
//     create();

// });
// getCurrentTab();


chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'createnote') {

        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.top = "50px";
        container.style.left = "100px";
        container.style.width = "200px";
        container.style.backgroundColor = "black";
        container.style.color = "white";
        container.style.zIndex = "1000";
        container.style.resize = "both";
        container.style.overflow = "hidden";

        const header = document.createElement("div");
        header.style.backgroundColor = "black";
        header.style.cursor = "move";
        header.style.fontSize = "16px";
        header.innerText = "Note Header";
        header.style.fontWeight = "bold";
        header.style.userSelect = "none";
        header.style.height = "30px";

        const textarea = document.createElement("textarea");
        textarea.style.width = "100%";
        textarea.style.height = "100%";
        // textarea.style.height = "";
        // textarea.style.height = this.scrollHeight + "px";
        textarea.style.backgroundColor = "#b5b4b4b6";
        textarea.style.color = "#000000";
        textarea.style.border = "none";
        textarea.style.resize = "none";
        textarea.style.outline = "none";
        textarea.value = "THIS IS A NOTE!!!";

        let isDragging = false;
        let offset = { x: 0, y: 0 };

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - container.offsetLeft;
            offset.y = e.clientY - container.offsetTop;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            container.style.left = (e.clientX - offset.x) + 'px';
            container.style.top = (e.clientY - offset.y) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });

        container.appendChild(header);
        container.appendChild(textarea);
        document.body.appendChild(container);
    }

    return true;
});
