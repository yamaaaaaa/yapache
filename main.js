const { app,ipcMain,BrowserWindow } = require("electron");
var ipc = require('ipc');
let win;


function createWindow(){
	win = new BrowserWindow({width: 300,height: 300});
	win.loadURL('file://'+__dirname+'/index.html');
	win.on("closed",() => {win = null; });
}

function startServer(documentRoot){		

	var express = require('express');
	var express_app = express();
	express_app.use(express.static(documentRoot));
	// express_app.use(express.static('/Users/taka/_github/_sandbox/electron/02-server/yapache/yapache-darwin-x64'));
	express_app.listen(8888, ()=> {
	  console.log('Express Server 01');
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

