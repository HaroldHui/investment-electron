import electron from 'electron';
import url from 'url';
import path from 'path';
import { calendarYearReturn } from './services/fundService';

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

const mainMenuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Add Item',
      },
      {
        label: 'Clear Items',
      },
      {
        label: 'Quit ',
        click() {
          app.quit();
        },
      },
    ],
  },
];

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    slashes: true,
  }));
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
  calendarYearReturn('Jun 2013', 'Oct 2016').then(console.log).catch(console.log);
});
