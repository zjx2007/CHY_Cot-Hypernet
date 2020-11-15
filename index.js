const { app, BrowserWindow, Menu, Tray, ipcMain } = require('electron')
let tray = null;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 450,
        height: 134,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: "bin/icon.png",
        frame: false
    });
    mainWindow.loadFile('src/index.html');
    Menu.setApplicationMenu(null);
    ipcMain.on('closing', function(event, arg) {
        mainWindow.hide();
        tray = new Tray("bin/icon.png");
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Cot Hypernet', enabled: false, icon: 'bin/icon16.png' },
            { type: 'separator' },
            {
                label: 'Show',
                click: function() {
                    mainWindow.show();
                    tray.destroy();
                    tray = null;
                }
            },
            { label: 'Exit', click: function() { 
              mainWindow.webContents.send("fclose");
            } },
        ])
        tray.setToolTip('Cot Hypernet');
        tray.setContextMenu(contextMenu);
        tray.on('click', () => {
            mainWindow.show();
            tray.destroy();
            tray = null;
        })
    });
    ipcMain.on("exitingss", function(event, arg){
      app.quit();
    })
    //mainWindow.webContents.openDevTools({mode:'detach'});
}
app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})