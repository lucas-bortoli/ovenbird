import { app, BrowserWindow } from "electron"

let win: BrowserWindow = null

app.on('ready', () => {
    win = new BrowserWindow({
        width: 640,
        height: 345,
        useContentSize: true,
        autoHideMenuBar: true,
        frame: false,
        backgroundColor: '#FFF',
        webPreferences: {
            zoomFactor: 1.0,
            nodeIntegration: true
        }
    })

    win.webContents.openDevTools()

    win.loadFile('index.html')

    win.once('close', () => app.quit())
})