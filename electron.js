const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let splash


app.on('browser-window-created', function (e, window) {
    window.setMenu(null);
});

app.on('ready', () => {
    // create main browser window
    mainWindow = new BrowserWindow({
        titleBarStyle: 'hidden',
        width: 1920,
        height: 1080,
        show: false // don't show the main window
    });
    // create a new `splash`-Window 
    splash = new BrowserWindow({ width: 1920, height: 1080, transparent: true, frame: false, alwaysOnTop: true });
    splash.loadURL(`file://${__dirname}/build/splashscreen/index.html`);
    mainWindow.loadURL(`file://${__dirname}/build/index.html`);

    // if main window is ready to show, then destroy the splash window and show up the main window
    mainWindow.once('ready-to-show', () => {
        setTimeout(function () {
            splash.destroy();
            mainWindow.show();
        }, 10000);
    });

    mainWindow.on('closed', function () {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null
    })
});
// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})