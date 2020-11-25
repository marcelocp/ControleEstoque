const { BrowserWindow, app } = require('electron')

require('electron-reload')(__dirname)

app.on('ready', ()=>{
  const win = new BrowserWindow({
    width: 1100,
    height: 690,
    title: 'Ju-Lingerie',
    backgroundColor: '#383a59',
    autoHideMenuBar:true,
    webPreferences:{
      nodeIntegration:true
    }
  })
  win.loadFile('src/pages/dashboard/index.html')
})