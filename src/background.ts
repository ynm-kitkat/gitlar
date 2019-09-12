'use strict';

import { app, protocol, BrowserWindow, screen, Tray, Menu, nativeImage } from 'electron';
import path from 'path';

import {
  createProtocol,
  installVueDevtools,
} from 'vue-cli-plugin-electron-builder/lib';
import { Gitlab } from 'gitlab';
import Todo from './modules/Todo';
import configManager from './ConfigManager';
const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: { secure: true, standard: true } }]);

function createWindow() {
  // Create the browser window.
  const config = configManager();
  const {width, height, x, y} = config.bounds;
  win = new BrowserWindow({
    title: 'Gitlar',
    width,
    height,
    x,
    y,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  win.setMenu(null);

  const writeBoundsConfig = () => {
    config.bounds = win && win.getBounds() || { width: 800, height: 600, x: 0, y: 0 };
  };

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) {
      win.webContents.openDevTools();
    }
  } else {
    createProtocol('app');
    win.loadURL('app://./index.html');
  }

  win.on('close', () => {
    writeBoundsConfig();
  });

  win.on('closed', () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray = null;
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    // Devtools extensions are broken in Electron 6.0.0 and greater
    // See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
    // Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
    // If you are not using Windows 10 dark mode, you may uncomment these lines
    // In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
    // try {
    //   await installVueDevtools()
    // } catch (e) {
    //   console.error('Vue Devtools failed to install:', e.toString())
    // }
  }
  // try {
  //   console.log(__dirname);
  //   const imagePath = path.join(__dirname, '.', 'assets', 'gitlab-logo.png');
  //   console.log(imagePath)
  //   const trayIcon = nativeImage.createFromPath(imagePath);
  //   console.log(trayIcon.isEmpty())
  //   tray = new Tray(trayIcon);
  //   const contextMenu = Menu.buildFromTemplate([
  //     { label: 'Item1', type: 'radio' },
  //     { label: 'Item2', type: 'radio' },
  //     { label: 'Item3', type: 'radio', checked: true },
  //     { label: 'Item4', type: 'radio' },
  //   ]);
  //   tray.setToolTip('This is my application.');
  //   tray.setContextMenu(contextMenu);
  //   tray.on('balloon-click', () => win && win.focus());
  // } catch (e) {
  //   // tslint:disable-next-line
  //   console.error('tasktray omg', e.toString());
  // }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
