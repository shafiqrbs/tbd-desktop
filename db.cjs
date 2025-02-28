const path = require("path");
const { app } = require("electron");
const Database = require("better-sqlite3");

// Create/open the database in the user's data directory
const dbPath = path.join(app.getPath("userData"), "electro.db");
console.log(`Local database path: ${dbPath}`);
const db = new Database(dbPath);

db.prepare(
	`
	CREATE TABLE IF NOT EXISTS tests (
		email TEXT PRIMARY KEY,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`
).run();

module.exports = {
	deleteUser: (_id) => {
		const stmt = db.prepare("DELETE FROM users WHERE _id = ?");
		stmt.run(_id);
		return db.prepare("SELECT * FROM users").all();
	},
	updateUserId: (oldId, updatedUser) => {
		const stmt = db.prepare(`
            UPDATE users 
            SET _id = @newId,
                username = @username,
                email = @email,
                address = @address,
                age = @age
            WHERE _id = @oldId
        `);

		return stmt.run({
			oldId,
			newId: updatedUser.newId,
			username: updatedUser.username,
			email: updatedUser.email,
			address: updatedUser.address,
			age: updatedUser.age,
		});
	},
};
