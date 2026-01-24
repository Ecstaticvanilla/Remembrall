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

const styles = `
    .notebutton {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 20px;
        width: 20px;
        // font-weight: bold;
        background-color: #b5b4b462;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        z-index: 1001;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.2s;

        display: flex;             
        justify-content: center;    
        align-items: center;        
    }
    .closenote{
        right: 10px;
    }    
    .minimizenote{
        left: 10px;
    }    
    .temptwo{
        left: 40px;
    }
    .tempthree{
        left: 62px;
    }
    .notebutton:hover { opacity: 0.7; }
    .notebutton:active { opacity: 0.5; transform: translateY(-50%) rotate(90deg);}
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

headerui = `
    <button class="notebutton closenote">×</button>
    <button class="notebutton minimizenote">-</button>
    <button class="notebutton temptwo">F</button>
    <button class="notebutton tempthree">B</button>
`;
//Have to add a button to pin instead of scrolling with scrollbar
//also add another button to bring forward layering(these are temp2 and temp3)


chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'createnote') {

        const container = document.createElement("div");
        container.style.position = "fixed"; 
        container.style.top = "20vh";
        container.style.left = "100px";
        container.style.width = "200px";
        container.style.height = "200px";
        container.style.backgroundColor = "black";
        container.style.color = "white";
        container.style.zIndex = "1000";
        container.style.resize = "both";
        container.style.overflow = "hidden";
        container.style.minHeight = "130px"; 
        container.style.minWidth = "130px";
        container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.8)"; 
        container.style.display = "flex"; 
        container.style.flexDirection = "column";
        container.id =  Date.now();// Unique ID finally!

        const header = document.createElement("div");
        header.style.backgroundColor = "black";
        header.style.position = "relative";
        header.style.cursor = "move";
        header.style.height = "30px";
        header.style.userSelect = "none";
        header.style.outline = "none";
        header.style.border = "none";
        header.style.overflow = "hidden";
        header.style.flex = "0 0 30px"; 
        header.style.display = "flex";
        header.style.flexDirection = "row"; 
        header.innerHTML = headerui;

        const textarea = document.createElement("textarea");
        textarea.style.width = "100%";
        textarea.style.backgroundColor = "#b5b4b4b6";
        textarea.style.color = "#000000";
        textarea.style.border = "none";
        textarea.style.resize = "none";
        textarea.style.outline = "none";
        textarea.value = "THIS IS A NOTE!!!";
        if(request.noteText){
            textarea.value = request.noteText;
        }
        textarea.style.overflow = "auto"; 
        textarea.style.flex = "1"; 

        const closeBtn = header.querySelector(".closenote");
        closeBtn.addEventListener("click", () => {
            container.remove();
        });

        const minimizeBtn = header.querySelector(".minimizenote");
        minimizeBtn.addEventListener("click", () => {
            if (textarea.style.display === "none") {
                textarea.style.display = "block";
                container.style.height = "200px";
                container.style.minHeight = "130px";
            }else{
                textarea.style.display = "none";
                container.style.minHeight = "30px";
                container.style.height = "30px";
            }
        });
        
        let offset = { x: 0, y: 0 };
        function onMouseMove(e) {
            container.style.left = (e.clientX - offset.x) + 'px';
            container.style.top = (e.clientY - offset.y) + 'px';
        }

        function onMouseUp() {
            header.style.cursor = 'move';
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('closenote')) return; 
            offset.x = e.clientX - container.getBoundingClientRect().left;
            offset.y = e.clientY - container.getBoundingClientRect().top;
            
            header.style.cursor = 'grabbing';
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        container.appendChild(header);
        container.appendChild(textarea);
        document.body.appendChild(container);
    }

    return true;
});