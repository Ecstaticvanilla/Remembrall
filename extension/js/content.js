
// document.getElementById('addnotes').addEventListener('click', async () => {
//     const note = document.createElement("n");
//     document.body.appendChild(note);
//     create();

// });
// getCurrentTab();

const themes = {
    default: {
        primaryColor: "#000000",
        secondaryColor: "#898088",    
        thirdColor: "#ffffff",    
        textColor: "#000000"
    },    
    purple: {
        primaryColor: "#390a32",
        secondaryColor: "#b96bb4",    
        thirdColor: "#ffffff",    
        textColor: "#390a32"
    },    
    yellow: {
        primaryColor: "#52561e",
        secondaryColor: "#eeff00",    
        thirdColor: "#ffffff",    
        textColor: "#000000"
    },    
    blue: {
        primaryColor: "#1f1257",
        secondaryColor: "#836bec",    
        thirdColor: "#ffffff",    
        textColor: "#1f1257"
    },    
    green: {
        primaryColor: "#0e3b10",
        secondaryColor: "#71ae74",    
        thirdColor: "#ffffff",    
        textColor: "#0e3b10"
    },
    red: {
        primaryColor: "#3b0e0e",
        secondaryColor: "#c04747",    
        thirdColor: "#ffffff",    
        textColor: "#3b0e0e"
    }
}

const styles = 
`
    :root {
        --primary-color: #000000;
        --secondary-color: #898088; 
        --third-color: #ffffff;   
        --text-color: #000000;
    }
    .themepickergrid .themebutton {
            width: 100%;
            height: 100%;
            border-radius: 0;        
            border: none; 
            cursor: pointer;
            transition: opacity 0.2s;  
    }   
    .themebutton:hover { opacity: 0.7; }
    .themebutton:active { opacity: 0.5; }

    .notebutton {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 15px;
        width: 15px;
        /* font-weight: bold; */
        background-color: transparent; 
        color: var(--secondary-color);
        border: none;
        border-radius: 50%;
        font-size: 13px;
        z-index: 1001;
        cursor: pointer;
        outline: 2px solid var(--secondary-color);
        transition: opacity 0.2s, transform 0.2s , outline 0.2s;

        display: flex;             
        justify-content: center;    
        align-items: center;        
    }
    .closenote {
        right: 10px;
    }
    .minimizenote{
        left: 10px;
    }    
    .temptwo{
        left: 40px;
    }
    .themepicker{
        left: 65px;
    }
    .themepickergrid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        height: 100%;
    }
    .notebutton:hover { opacity: 0.7; }
    .notebutton:active { opacity: 0.5; transform: translateY(-50%) rotate(90deg); outline: 2px dotted var(--third-color);}
    /* .notebutton:focus { z-index: 10001;} */
`;
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

headerui = `
    <button class="notebutton closenote">×</button>
    <button class="notebutton minimizenote">=</button>
    <button class="notebutton temptwo">P</button>
    <button class="notebutton themepicker">T</button>
`;

pickcerui= `
    <div class = themepickergrid>
        <button class="themebutton default"></button>
        <button class="themebutton purple"></button>
        <button class="themebutton yellow"></button>
        <button class="themebutton blue"></button>
        <button class="themebutton green"></button>
        <button class="themebutton red"></button>
    </div>
`;
// Focus changes layering of notes
// Have to add a button to pin instead of scrolling with scrollbar and theme selector (temp 2 and 3)

let maxz = 1000;
//Top z-index

chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'createnote') {

        const container = document.createElement("div");
        container.style.position = "fixed"; 
        container.style.top = "20vh";
        container.style.left = "100px";
        container.style.width = "200px";
        container.style.height = "200px";
        container.style.backgroundColor = "var(--primary-color)";
        container.style.color = "var(--text-color)";
        container.style.zIndex = "1000";
        container.style.resize = "both";
        container.style.overflow = "hidden";
        container.style.minHeight = "130px"; 
        container.style.minWidth = "200px";
        container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.8)"; 
        container.style.display = "flex"; 
        container.style.flexDirection = "column";
        container.id =  Date.now();// Unique ID finally!

        // container.addEventListener("click", () => {
        //     container.style.zIndex = 10000;
        // });

        const header = document.createElement("div");
        header.style.backgroundColor = "var(--primary-color)";
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

        const picker = document.createElement("div");
        picker.style.position = "relative";
        picker.style.height = "30px";
        picker.style.display = "none";     
        picker.style.backgroundColor = "#a3a3a3";
        picker.style.flex = "0 0 30px";
        picker.innerHTML = pickcerui;
        Object.entries(themes).forEach(([name, theme]) => {
            const btn = picker.querySelector(`.themebutton.${name}`);
            if (!btn) return;

            btn.style.backgroundColor = theme.secondaryColor;
        });

        const textarea = document.createElement("textarea");
        textarea.style.width = "100%";
        textarea.style.backgroundColor = "var(--secondary-color)";
        textarea.style.color = "var(--text-color)";
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
        if (closeBtn) {
            closeBtn.addEventListener("click", () => {
                container.remove();
        });}

        const minimizeBtn = header.querySelector(".minimizenote");
        if (minimizeBtn) {
        minimizeBtn.addEventListener("click", () => {
            if (textarea.style.display === "none") {
                textarea.style.display = "block";
                container.style.height = "200px";
                container.style.minHeight = "130px";
                container.style.resize = "both";
            }else{
                textarea.style.display = "none";
                container.style.minHeight = "30px";
                container.style.height = "30px";
                container.style.resize = "none";
            }
        });}

        const pickerBtn = header.querySelector(".themepicker");
        if (pickerBtn) {
            pickerBtn.addEventListener("click", () => {
                picker.style.display = picker.style.display === "none" ? "block" : "none";
        });}
        function applyTheme(themeName) {
            const theme = themes[themeName];
            if (!theme) 
                return;
            const root = document.documentElement;
            root.style.setProperty("--primary-color", theme.primaryColor);
            root.style.setProperty("--secondary-color", theme.secondaryColor);
            root.style.setProperty("--third-color", theme.thirdColor);
            root.style.setProperty("--text-color", theme.textColor);
        }

        picker.querySelectorAll(".themebutton").forEach(btn => {
            btn.addEventListener("click", () => {
                const themeName = [...btn.classList].find(c => themes[c]);
                applyTheme(themeName);
            });
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

        bringToFront = (note) => {
            note.style.zIndex = maxz++;
        };

        container.addEventListener("mousedown", () => {
        bringToFront(container);
        });

        
        //INDEXDB CHANGES
        //on note creation update urlTable append current noteid 
        //this ensure no dups in urlTable

        //appending this new note in the url table
        let url = document.URL.split('#')[0];
        let id = container.id;
        let content = textarea.value;
        addToUrl(url,id);
        addToNote(url,id,content);


        //adding oninput property to textarea
        //this is will trigger for every keystorke , paste or change in textarea content
        //setting timer/debounce effect to make sure user is not still typing
        let timer = null;
        textarea.oninput = () =>{
            if (timer !== null)
                clearTimeout(timer);
            //settimeout of every 1 second or 500ms , if oldval == val call funtion
            //if oldval != val dont call function
            //reset timeout   
            timer = setTimeout(()=>{
                    content = textarea.value;
                    addToNote(url,id,content);
                    clearTimeout(timer);
            },5000);   
        }

        container.appendChild(header);
        container.appendChild(picker);
        container.appendChild(textarea);
        document.body.appendChild(container);
    }
    return true;
});


//NO LONGER being used replaced by req for change in db using functions and triggers
//previous db passing function
// let db = null;
// //request for the database object
// document.addEventListener("readystatechange", (event) => {
//     chrome.runtime.sendMessage({action: "indexdb_object"}, (response) => {
//         db = response.data;
//         console.log(`db object recieved: ${db}` + db instanceof IDBDatabase);
//     });
// });


//request background js
//action: addtonote
//message: content
//id: note.id
//url: document.URL.split('#')[0]
function addToNote(url,id,content){
    chrome.runtime.sendMessage({action: "addToNote",noteURL: url, noteId: id, noteText: content}, (response) =>
    {
        if(response.status){
            console.log("note added to db");
        }
        else{
            console.log("note not added")
        }
    });
}

function addToUrl(url,id){
    chrome.runtime.sendMessage({action: "addToUrl",noteURL: url, noteId: id}, (response) =>
    {
        if(response.status){
            console.log("Id appened in urltable");
        }
        else{
            console.log("error while request for id append in urltable")
        }
    });
}

//add function to get notes for current url if sidebar is open 