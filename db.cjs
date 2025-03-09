const path = require("path");
const { app } = require("electron");
const Database = require("better-sqlite3");

// Create/open the database in the user's data directory
const dbPath = path.join(app.getPath("userData"), "electro.db");
console.log(`Local database path: ${dbPath}`);
const db = new Database(dbPath);

const convertKey = (key) => key.replace(/-/g, "_");

db.prepare(
	`
	CREATE TABLE IF NOT EXISTS local_store (
		id INTEGER PRIMARY KEY,
		user TEXT,
		accounting_transaction_mode TEXT,
		config_data TEXT,
		core_products TEXT,
		core_customers TEXT,
		core_vendors TEXT,
		core_users TEXT,
		order_process TEXT,
		temp_requistion_invoice TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`
).run();

const upsertData = (key, value) => {
	key = convertKey(key);
	const stmt = db.prepare(
		`INSERT INTO local_store (id, ${key}) 
     VALUES (1, ?) 
     ON CONFLICT(id) DO UPDATE SET ${key} = excluded.${key}`
	);

	stmt.run(value);
};

const getData = (key) => {
	key = convertKey(key);
	const stmt = db.prepare(`SELECT ${key} FROM local_store WHERE id = 1`);
	return stmt.get()?.[key];
};

const destroyTableData = () => {
	const stmt = db.prepare(`DELETE FROM local_store WHERE id = 1`);
	stmt.run();
};

module.exports = {
	upsertData,
	getData,
	destroyTableData,
};
