const { contextBridge, ipcRenderer } = require("electron");

// Add more verbose logging
console.info("Preload script starting...");

try {
	contextBridge.exposeInMainWorld("dbAPI", {
		// production startup start
		upsertIntoTable: (table, data) => {
			return ipcRenderer.invoke("upsert-into-table", table, data);
		},
		getDataFromTable: (table, id, property) => {
			return ipcRenderer.invoke("get-data-from-table", table, id, property);
		},
		updateDataInTable: (table, values) => {
			return ipcRenderer.invoke("update-in-table", table, values);
		},
		deleteDataFromTable: (table, id) => {
			return ipcRenderer.invoke("delete-data-from-table", table, id);
		},
		destroyTableData: () => {
			console.log("Calling destroyTableData...");
			return ipcRenderer.invoke("destroy-table-data");
		},
	});
	console.info("dbAPI exposed successfully");

	contextBridge.exposeInMainWorld("deviceAPI", {
		thermalPrint: (data) => {
			return ipcRenderer.invoke("pos-thermal", data);
		},
	});
	console.info("deviceAPI exposed successfully");
} catch (error) {
	console.error("Error in preload script:", error);
}
