//=====Sidepanel functions ===========


//maybe remove later
// const port = chrome.runtime.connect({name: 'sidePanel'});
// setTimeout(() => port.postMessage('getnotes'),1000); 


document.addEventListener('DOMContentLoaded', async() => {

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.runtime.sendMessage({action: "getnotesforurl",url:tab.url}, (response) => {
        console.log("Sidepanel opened");
    });

    const refreshbtn = document.getElementById("refreshButton");
    if (refreshbtn) {
        refreshbtn.addEventListener("click", () => {
            console.log("hello >//<");
            location.reload(); 
        });
    }



    //implementing search functionaly
    //iterate through list wiht users input and update list of notes in menu
    const searchbar = document.getElementById("search");
    if (searchbar){

        //getting every container in the menu
        const notecontainerlist = document.getElementsByClassName("notecontainer");

        // yoo boiii on every keystroke my boii types i iterate over every note and hide the container 
        //that aint my shit ...Booom!!
        searchbar.addEventListener("input", (event) =>{
            const searchText = searchbar.value.toLowerCase();
            for(let i = 0; i < notecontainerlist.length; i++){
                
                const note = notecontainerlist[i].querySelector('.note');
                if(!note.innerText.toLowerCase().includes(searchText)){
                    notecontainerlist[i].style.display = "none";
                }
                else{
                    notecontainerlist[i].style.display = "flex";
                }
            }

        })
    }
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.action === "reload"){
        location.reload();
    }
});


// const styles = 
// `
//     .btn{
//         border: 1px solid #fd0000;
//         background-color: #ffffff;
//         color: #fd0000;
//         padding: 2px 6px;
//         font-size: 12px;
//         cursor: pointer;
//         transition: all 0.2s ease;
//     }
//     .btn:hover {
//         opacity: 0.7;
//     }
//     .btn:active{
//         border: 1px solid #000000;
//         background-color: #000000;
//         color : #ffffff;
//         opacity: 1; 
//     }
//     .menu{
//         display:flex;
//         flex-direction:row;
//         gap:2px;
//     }
//     .note{
//         border : 1px solid black;
//         /* background-color: #f6edb7; */
//         margin-bottom:2px;
//         margin-right:2px;
//     }
// `;
// const styleSheet = document.createElement("style");
// styleSheet.innerText = styles;
// document.head.appendChild(styleSheet);


noteui = `
    <button class= "btn popnote" >Pop</button>   
    <button class= "btn deletenote" >X</button>   
`;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "addnotetosidepanel"){

        const container = document.createElement("div");
        container.className = "notecontainer";
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
                note.style.whiteSpace = "pre-wrap";
                options.style.display = "flex"
            } else {
                note.style.textOverflow = "ellipsis";
                note.style.overflow = "hidden";
                note.style.whiteSpace = "nowrap";
                options.style.display = "none"

            }
        };

        const options = document.createElement("div");
        options.innerHTML = noteui;
        options.style.display = "none";
        options.style.flexDirection = "row";
        options.style.gap = "2px";
        options.style.marginRight = "2px";
        

        const delbtn = options.querySelector(".deletenote");
        const popbtn = options.querySelector(".popnote");
        ////////////////
        ///ADD THIS LOGIC and make it look pretty :)
        if (delbtn){
            delbtn.addEventListener("click", async() => {
                let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
                chrome.runtime.sendMessage({action: "deletenote",url:tab.url,id:note.id}, (response) => {
                    location.reload();
                    console.log("note deleted");
                });
            });
        };
        // if (popbtn){
        //     popbtn.addEventListener("click", async () => {
        //         let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        //         chrome.tabs.sendMessage(tab.id,{action: "createnote",url:tab.url,id:note.id,noteText:note.innerText,isPop:true}, (response) => {
        //             console.log("note popped onto live");
        //         });
        //     });
        // };

        //////////////////
        container.appendChild(note);
        container.appendChild(options);
        document.getElementById('noteslist').appendChild(container);
    }
});