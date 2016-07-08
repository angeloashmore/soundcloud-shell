const electron = require('electron')
const path = require('path')
const windowStateKeeper = require('electron-window-state')
const sendKeyPressJS = require('./lib/sendKeyPressJS')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to register global keyboard shortcuts.
const globalShortcut = electron.globalShortcut

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window state.
  const mainWindowState = windowStateKeeper({
    defaultHeight: 1240,
    defaultWidth: 900
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    frame: false,
    height: mainWindowState.height,
    width: mainWindowState.width,
    x: mainWindowState.x,
    y: mainWindowState.y
  })

  // Allow the browser window state keeper to manage the window.
  mainWindowState.manage(mainWindow)

  // And load the index.html of the app.
  mainWindow.loadURL('https://soundcloud.com/')

  // Retrieve the window's webContents
  const webContents = mainWindow.webContents

  // Setup keyboard shortcuts
  globalShortcut.register('Control+E', () => {
    // Pause song
    webContents.executeJavaScript(sendKeyPressJS(32))
  })

  globalShortcut.register('Control+W', () => {
    // Next song
    webContents.executeJavaScript(sendKeyPressJS(39, true))
  })

  globalShortcut.register('Control+Q', () => {
    // Previous song
    webContents.executeJavaScript(sendKeyPressJS(37, true))
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindows()
  }
})
