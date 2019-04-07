const electron = require('electron');
const url = require('url');
const path = require('path');
const Excel = require('./excel');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

app.on('ready', ()=> {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true
  }));
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
  Menu.setApplicationMenu(mainMenu);
  Excel.getFundData().then((fundData) => {
    console.log(fundData)
  });
})


const mainMenuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: 'Add Item'
      },
      {
        label: 'Clear Items'
      },
      {
        label: 'Quit ',
        click(){
          app.quit();
        }
      }
    ]
  }
];