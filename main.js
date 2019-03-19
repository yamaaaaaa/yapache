const { app,ipcMain,BrowserWindow } = require("electron");
let win;
var os = require('os');
var ifaces = os.networkInterfaces();
var ipAddress;
 
Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      return;
    }
    ipAddress = iface.address;
  });
});

app.on('ready',()=>{
	win = new BrowserWindow({width: 400,height: 600});
	win.loadURL('file://'+__dirname+'/index.html');
	win.on("closed",() => {win = null; });
});
app.on('window-all-closed',()=>{
	if(process.platform !== 'darwin'){
		app.quit();
	}
});
app.on('activate',()=>{
	if(win===null){
		createWindow();
	}
});

ipcMain.on('select', function( event, documentRoot ){
	var url = 'http://'+ipAddress+':8888/';
	var express = require('express');
	var express_app = express();
	express_app.use(express.static(documentRoot));
	express_app.listen(8888, ()=> {
		const {shell} = require('electron');
	  	shell.openExternal(url);
	});
	event.sender.send('init-qr', url);
});

ipcMain.on('stop', function( event , arg){
	app.quit();
});
