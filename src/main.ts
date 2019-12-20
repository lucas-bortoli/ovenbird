import { app, BrowserWindow } from "electron"

let win: BrowserWindow = null

app.on('ready', () => {
    win = new BrowserWindow({
        width: 640,
        height: 345,
        useContentSize: true,
        autoHideMenuBar: true,
        webPreferences: {
            zoomFactor: 1.0,
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')

    win.once('close', () => app.quit())
})