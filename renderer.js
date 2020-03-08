const { ipcRenderer } = require("electron");

window.addEventListener('DOMContentLoaded', () => {
    ipcRenderer.send('message', 'message from renderer')

    ipcRenderer.on('reply', (event, arg) => {
        document.getElementById("message").innerHTML = arg
      })
})