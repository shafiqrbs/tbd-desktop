const { contextBridge, ipcRenderer } = require("electron");

// Add more verbose logging
console.log("Preload script starting...");

try {
	contextBridge.exposeInMainWorld("dbAPI", {
		// test starts -------------
		getTestUsers: () => {
			console.log("Calling getTestUsers...");
			return ipcRenderer.invoke("db-get-test-users");
		},
		setTestUser: (email) => {
			console.log("Calling setTestUsers...");
			return ipcRenderer.invoke("db-set-test-users", email);
		},
		// test ends ---------------

		deleteUser: (id) => {
			console.log("Calling deleteUser...", id);
			return ipcRenderer.invoke("db-delete-user", id);
		},
		updateUserId: (oldId, updatedUser) => {
			console.log("Calling updateUser...", { oldId, updatedUser });
			return ipcRenderer.invoke("db-update-user", oldId, updatedUser);
		},
	});
	console.log("dbAPI exposed successfully");
} catch (error) {
	console.error("Error in preload script:", error);
}
