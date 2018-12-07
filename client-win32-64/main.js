const {app, BrowserWindow,Menu,Tray} = require('electron');
const {ipcMain} = require('electron')

let mainWindow = null;
let sendMailWindow = null;
let resetInfoWindow = null;

app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

app.setPath("userData", __dirname + "../../saved_recordings");

app.on('ready', () => {
  mainWindow = new BrowserWindow({width: 370, height: 650,icon: __dirname + '/assets/img/icon.png'});

  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.setMenu(null)

  // //for development
  // mainWindow.openDevTools()
  // mainWindow.maximize()

  mainWindow.setMaximizable(false)
  
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (event) => {
    // if (app.quitting) {
    //   mainWindow = null
    // } else {
    //   event.preventDefault()
    //   mainWindow.hide()
    // }
  })
});

function openSendMailWindow(){
  if(sendMailWindow == null){
    sendMailWindow = new BrowserWindow({width: 340, height: 583,icon: __dirname + '/assets/img/icon.png'});

    sendMailWindow.loadURL('file://' + __dirname + '/sendMail.html');
    sendMailWindow.setMenu(null)

    // //for development
    // sendMailWindow.webContents.openDevTools();
    // sendMailWindow.maximize();

    sendMailWindow.setMaximizable(false)
    
    sendMailWindow.on('closed', () => {
      sendMailWindow = null;
    });

    sendMailWindow.on('close', (event) => {
      sendMailWindow = null
    })
  }
}

function openResetInfoWindow(){
  if(resetInfoWindow == null){
    resetInfoWindow = new BrowserWindow({width: 370, height: 650,icon: __dirname + '/assets/img/icon.png'});

    resetInfoWindow.loadURL('file://' + __dirname + '/reset.html');
    resetInfoWindow.setMenu(null)

    // //for development
    // resetInfoWindow.webContents.openDevTools();
    // resetInfoWindow.maximize();

    resetInfoWindow.setMaximizable(false)
    
    resetInfoWindow.on('closed', () => {
      resetInfoWindow = null;
    });

    resetInfoWindow.on('close', (event) => {
      resetInfoWindow = null
    })
  }
}

function addTrayIcon(){
  tray = new Tray(__dirname + '/assets/img/icon-tray.png')
  const contextMenu = Menu.buildFromTemplate([
    {
      label : 'Send Your Info',
      click : function(){
        openSendMailWindow();
      }
    },
    {
      label : 'Reset Your Info',
      click: function(){
        openResetInfoWindow();
      }
    },
    {
      label : 'Quit',
      click : function(){
        app.exit();
      }
    }
  ])
  tray.setToolTip('Monitor Client')
  tray.setContextMenu(contextMenu)
}
ipcMain.on('synchronous-message', (event, arg) => {
  if(arg == 'registered'){
    console.log('registered')
    addTrayIcon();
  }
})