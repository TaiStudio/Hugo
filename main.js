/*--------------------------------------------------------------------------------------\
|  _______    _    _____ _             _ _           ________     ___   ___ ___  __     |
| |__   __|  (_)  / ____| |           | (_)         /  ____  \   |__ \ / _ \__ \/_ |    |
|    | | __ _ _  | (___ | |_ _   _  __| |_  ___    /  / ___|  \     ) | | | | ) || |    |
|    | |/ _` | |  \___ \| __| | | |/ _` | |/ _ \  |  | |       |   / /| | | |/ / | |    |
|    | | (_| | |  ____) | |_| |_| | (_| | | (_) | |  | |___    |  / /_| |_| / /_ | |    |
|    |_|\__,_|_| |_____/ \__|\__,_|\__,_|_|\___/   \  \____|  /  |____|\___/____||_|    |
|                                                   \________/                          |
\--------------------------------------------------------------------------------------*/

const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

//AUTO UPDATE
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
autoUpdater.autoDownload = true;

var control = null,
    prompteur = null;
app.whenReady().then(() => {
    autoUpdater.checkForUpdates();

    control = createWindow('app/index.html', 800, 600, true);

    prompteur = createWindow('app/prompteur.html', 800, 600, true);

    ipcMain.on('always', (event, arg) => {
        prompteur.setAlwaysOnTop(arg);
    });
    ipcMain.on('start', (event, arg, arg1) => {
        prompteur.webContents.executeJavaScript(`starting('${arg}', '${arg1}')`);
    });
    ipcMain.on('script', (event, arg) => {
        prompteur.webContents.executeJavaScript(`script('${replaceALL(arg, '\n', '<br />')}')`);
    });
    //AUTO UPDATE
    autoUpdater.on('checking-for-update', () => {
    });
    autoUpdater.on('update-available', (ev, info) => {
    });
    autoUpdater.on('update-not-available', (ev, info) => {
    });
    autoUpdater.on('error', (ev, err) => {
    });
    autoUpdater.on('download-progress', (ev, progressObj) => {
    });
    autoUpdater.on('update-downloaded', (ev, info) => {
        setTimeout(function() {
            quit(false, true);
        }, 5000)
    });
});

//QUIT OR RELAUNCH
function quit(arg, arg1){
    for(i=0;i<allTimers.length;i++){
        clearInterval(allTimers[i]);
        if(i == allTimers.length -1){
            if(arg){
                app.relaunch();
            }
            if(arg1){
                autoUpdater.quitAndInstall();
            }
            app.quit();
        }
    }
}

function createWindow(file, w, h, resize) {
    var win = new BrowserWindow({
        width: w,
        height: h,
        resizable: resize,
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });

    win.loadFile(file);

    return win;
}

function replaceALL(str,replaceWhat,replaceTo){
    replaceWhat = replaceWhat.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    var re = new RegExp(replaceWhat, 'g');
    return str.replace(re,replaceTo);
}