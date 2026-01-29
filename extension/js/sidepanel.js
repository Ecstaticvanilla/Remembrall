//=====Sidepanel functions ===========


//maybe remove later
// const port = chrome.runtime.connect({name: 'sidePanel'});
// setTimeout(() => port.postMessage('getnotes'),1000); 

document.addEventListener('DOMContentLoaded', async() => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.runtime.sendMessage({action: "getnotesforurl",url:tab.url}, (response) => {
        console.log("Sidepanel opened");
    });
});

const styles = 
`
    .btn{
        border: 1px solid #fd0000;
        background-color: #ffffff;
        color: #fd0000;
        padding: 2px 6px;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    .btn:hover {
        opacity: 0.7;
    }
    .btn:active{
        border: 1px solid #000000;
        background-color: #000000;
        color : #ffffff;
        opacity: 1; 
    }
    .menu{
        display:flex;
        flex-direction:row;
        gap:2px;
    }
    .note{
        border : 1px solid black;
        /* background-color: #f6edb7; */
        margin-bottom:2px;
        margin-right:2px;
    }
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


noteui = `
<div class = "menu">
    <button class= "btn popnote" >Pop</button>   
    <button class= "btn deletenote" >Del</button>   
</div>
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addnotetosidepanel"){

        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.flexDirection = "row";
        container.style.justifyContent = "space-between";
        container.style.alignItems = "center";

        const note = document.createElement("li");
        note.className = "note";
        note.id = request.noteId;
        note.style.padding = "5px";
        note.innerText = request.noteText;
        note.style.flexGrow = "1";
        note.style.textOverflow = "ellipsis";
        note.style.overflow = "hidden";  
        note.style.whiteSpace = "nowrap";


        //logic of seeing entire note
        let expanded = false;
        note.onclick = () => {
            expanded = !expanded;

            if (expanded) {
                note.style.textOverflow = "clip";
                note.style.overflow = "visible";
                note.style.whiteSpace = "normal";
            } else {
                note.style.textOverflow = "ellipsis";
                note.style.overflow = "hidden";
                note.style.whiteSpace = "nowrap";
            }
        };

        const options = document.createElement("div");
        options.innerHTML = noteui;

        // const delbtn = options.querySelector(".deletenote");
        // const popbtn = options.querySelector(".popnote");
        //////////////////
        ///ADD THIS LOGIC and make it look pretty :)
        // if (delbtn){
        //     delbtn.addEventListener("click", () => {
        //         console.log("yet to add logic");
        //     }
        // )};
        // if (popbtn){
        //     popbtn.addEventListener("click", () => {
        //         console.log("yet to add logic");
        //     }
        // )};
        //////////////////
        container.appendChild(note);
        container.appendChild(options);
        document.getElementById('noteslist').appendChild(container);
    }
});