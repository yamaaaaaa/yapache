const { app,ipcMain,BrowserWindow } = require("electron");
var ipc = require('ipc');
let win;

var os = require('os');
var ifaces = os.networkInterfaces();
var ipAddress;
 
Object.keys(ifaces).forEach(function (ifname) {
  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }
    console.log(ifname, iface.address);
    // en0 192.168.1.NNN
    ipAddress = iface.address;
  });
});

console.log(ipAddress);

function createWindow(){
	win = new BrowserWindow({width: 300,height: 300});
	win.loadURL('file://'+__dirname+'/index.html');
	win.on("closed",() => {win = null; });
}

function startServer(documentRoot){
	var express = require('express');
	var express_app = express();
	express_app.use(express.static(documentRoot));
	express_app.listen(8888, ()=> {
	  console.log('Express Server 01');
	  const {shell} = require('electron');
	  shell.openExternal('http://'+ipAddress+':8888/');
	});
}

app.on('ready',createWindow);
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
	startServer(documentRoot);
});
ipcMain.on('stop', function( event , arg){
	app.quit();
});

