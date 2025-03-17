const { contextBridge, ipcRenderer } = require("electron");

// Add more verbose logging
console.log("Preload script starting...");

try {
	contextBridge.exposeInMainWorld("dbAPI", {
		// production startup start
		upsertIntoTable: (table, data) => {
			return ipcRenderer.invoke("upsert-into-table", table, data);
		},
		getDataFromTable: (table, id) => {
			return ipcRenderer.invoke("get-data-from-table", table, id);
		},
		deleteDataFromTable: (table, id) => {
			return ipcRenderer.invoke("delete-data-from-table", table, id);
		},
		destroyTableData: () => {
			console.log("Calling destroyTableData...");
			return ipcRenderer.invoke("destroy-table-data");
		},
	});

	contextBridge.exposeInMainWorld("deviceAPI", {
		posPrint: (data, options) => {
			return ipcRenderer.invoke("pos-print", data, options);
		},
	});
	console.log("dbAPI exposed successfully");
} catch (error) {
	console.error("Error in preload script:", error);
}
