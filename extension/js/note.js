// async function open(){
//     let popup = await chrome.window.create({
//         url:chrome.extension.getURL('note.html'),
//         focused: true,
//         type: "popup",
//         alwaysOnTop: true,
//         height: 200,
//         width: 200,
//         incognito: false,
//         visible:true
//     });
//     console.log("note created!!");
//     return popup;
// }

// document.addEventListener("DOMContentLoaded", () => {
//     const button = document.getElementById("test");
//     console.log("create popup");
//     let popup = open();
// });