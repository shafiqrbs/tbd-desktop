const { contextBridge, ipcRenderer } = require("electron");

// Add more verbose logging
console.log("Preload script starting...");

const convertKey = (key) => key.replace(/-/g, "_");

try {
	contextBridge.exposeInMainWorld("dbAPI", {
		// production startup start
		getData: (key) => {
			key = convertKey(key);
			console.log(`Calling getData for ${key}...`);
			return ipcRenderer.invoke("get-data", key);
		},
		upsertData: (key, value) => {
			key = convertKey(key);
			console.log(`Calling upsertData for ${key}...`);
			return ipcRenderer.invoke("store-data", key, value);
		},
		destroyTableData: () => {
			console.log("Calling destroyTableData...");
			return ipcRenderer.invoke("destroy-table-data");
		},
	});
	console.log("dbAPI exposed successfully");
} catch (error) {
	console.error("Error in preload script:", error);
}
