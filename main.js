const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const DataStore = require('./MusicDataStore')

const myStore = new DataStore({
  name: 'Music Data',
})

class AppWindow extends BrowserWindow {
  constructor (config, fileLocation) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    }
    const finalConfig = {...basicConfig, ...config}
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', () => {
      this.show()
    })
  }
}

function main () {
  const mainWindow = new AppWindow(null, './renderer/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('page did finish')
    mainWindow.send('getTracks', myStore.getTracks())
  })
  ipcMain.on('add-music-window', () => {
    const addWindow = new AppWindow({
      width: 400,
      height: 300,
      parent: mainWindow,
    }, './renderer/add.html')
  })

  ipcMain.on('add-tracks', (event, tracks) => {
    console.log(tracks)
    const updatedTracks = myStore.addTracks(tracks).getTracks()
    mainWindow.send('getTracks', updatedTracks)
  })

  ipcMain.on('open-music-file', (event) => {
    dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [{name: 'Music', extensions: ['mp3']}],
    }).then(result => {
      if (result.filePaths) {
        event.sender.send('selected-file', result.filePaths)
      }
    })
  })
}

app.on('ready', main)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
