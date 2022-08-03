const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("fs");
const path = require("path");

let win;

function createWindow() {
  // 브라우저 창을 생성
  win = new BrowserWindow({
    width: 1600,
    height: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    resizable: true,
    center: true,
  });

  //브라우저창이 읽어 올 파일 위치
  win.loadFile("./view/login.html");

  win.webContents.openDevTools();

  win.removeMenu();
}

ipcMain.on("toggle-debug", (event, arg) => {
  win.webContents.toggleDevTools();
});

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  app.quit();
});

ipcMain.on("closeApp", (evt, arg) => {
  app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
