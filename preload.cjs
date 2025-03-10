const { contextBridge, ipcRenderer } = require("electron");

// Add more verbose logging
console.log("Preload script starting...");

const convertKey = (key) => key.replace(/-/g, "_");

try {
	contextBridge.exposeInMainWorld("dbAPI", {
		// production startup start
		upsertIntoTable: (table, data) => {
			return ipcRenderer.invoke("upsert-into-table", table, data);
		},
		getDataFromTable: (table, id) => {
			return ipcRenderer.invoke("get-data-from-table", table, id);
		},
		getData: (key) => {
			key = convertKey(key);
			return ipcRenderer.invoke("get-data", key);
		},
		upsertData: (key, value) => {
			key = convertKey(key);
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
