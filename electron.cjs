const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const dbModule = require("./db.cjs");

ipcMain.handle("store-data", async (event, key, value) => {
	try {
		return dbModule.upsertData(key, value);
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
});

ipcMain.handle("get-data", async (event, key) => {
	try {
		return dbModule.getData(key);
	} catch (error) {
		console.error(`Failed to get ${key}:`, error);
		return null;
	}
});

ipcMain.handle("destroy-table-data", async () => {
	try {
		return dbModule.destroyTableData();
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
});

let mainWindow;
let splash;

// run this as early in the main process as possible
if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
	// Create Splash Screen
	splash = new BrowserWindow({
		width: 810,
		height: 610,
		transparent: true,
		frame: false,
		alwaysOnTop: true,
		icon: path.join(__dirname, "images", "list"),
	});

	// Load splash screen HTML
	splash.loadFile(path.join(__dirname, "dist", "splash.html"));

	// Create Main Window (but keep it hidden initially)
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		show: false,
		icon: path.join(__dirname, "images", "list"),
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			preload: path.join(__dirname, "preload.cjs"),
			// Add these to help with debugging
			devTools: true,
			sandbox: false,
		},
	});

	// Load Main App after splash screen
	const startURL =
		process.env.ELECTRON_START_URL || `file://${path.join(__dirname, "dist", "index.html")}`;
	if (startURL.startsWith("http")) {
		mainWindow.loadURL(startURL);
	} else {
		mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
	}

	// Once the main window is ready, close the splash screen and show the main window
	mainWindow.once("ready-to-show", () => {
		splash.destroy();
		mainWindow.show();
	});
});

// Quit app when all windows are closed (except macOS)
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
