const electron = require('electron')
const path = require('path')
const fs = require('fs')
const sendKeyPressJS = require('./lib/sendKeyPressJS')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
// Module to register global keyboard shortcuts.
const globalShortcut = electron.globalShortcut
// Module to interact with external handlers
const shell = electron.shell
// Module to set the native menu.
const Menu = electron.Menu

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let template

function createWindow () {
  // Path to store window bounds data.
  const initPath = path.join(app.getPath('userData'), 'init.json')

  // Load window bounds data.
  let data = {}

  try {
    data = JSON.parse(fs.readFileSync(initPath, 'utf8'))
  } catch (e) {
    // Ignore
  }

  // Create the browser window.
  mainWindow = new BrowserWindow(
    Object.assign({}, {
      frame: false,
      height: 900,
      width: 1240
    }, data.bounds)
  )

  // And load the index.html of the app.
  mainWindow.loadURL('https://soundcloud.com/')

  // Retrieve the window's webContents.
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

  // Emitted before the window is closed.
  mainWindow.on('close', function () {
    // Get the window's bounds and save it.
    const data = {
      bounds: mainWindow.getBounds()
    }

    fs.writeFileSync(initPath, JSON.stringify(data))
  })

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  template = [{
    label: 'SoundCloud Shell',
    submenu: [{
      label: 'About SoundCloud Shell',
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: 'Hide SoundCloud Shell',
      accelerator: 'Command+H',
      selector: 'hide:'
    }, {
      label: 'Hide Others',
      accelerator: 'Alt+Command+H',
      selector: 'hideOtherApplications:'
    }, {
      label: 'Show All',
      selector: 'unhideAllApplications:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click () {
        app.quit()
      }
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'Command+R',
      click () {
        mainWindow.webContents.reload()
      }
    }, {
      label: 'Toggle Full Screen',
      accelerator: 'Ctrl+Command+F',
      click () {
        mainWindow.setFullScreen(!mainWindow.isFullScreen())
      }
    }]
  }, {
    label: 'Window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'Command+M',
      selector: 'performMiniaturize:'
    }, {
      label: 'Close',
      accelerator: 'Command+W',
      selector: 'performClose:'
    }, {
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      selector: 'arrangeInFront:'
    }]
  }, {
    label: 'Help',
    submenu: [{
      label: 'Learn More',
      click () {
        shell.openExternal('http://github.com/angeloashmore/soundcloud-shell')
      }
    }, {
      label: 'Search Issues',
      click () {
        shell.openExternal('https://github.com/angeloashmore/soundcloud-shell/issues')
      }
    }]
  }]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
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
    createWindow()
  }
})
