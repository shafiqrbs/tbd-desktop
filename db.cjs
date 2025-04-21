const path = require("path");
const { app } = require("electron");
const Database = require("better-sqlite3");

// Create/open the database in the user's data directory
const dbPath = path.join(app.getPath("userData"), "electro.db");
console.log(`Local database path: ${dbPath}`);
const db = new Database(dbPath);

const convertTableName = (key) => key.replace(/-/g, "_");

// license activate table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS license_activate (
		id INTEGER PRIMARY KEY,
		license_key TEXT,
		is_activated INTEGER,
		activated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`
).run();

// users table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY,
		name TEXT,
		mobile TEXT,
		email TEXT,
		username TEXT,
		user_group TEXT,
		domain_id INTEGER,
		access_control_role TEXT,
		android_control_role TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
	`
).run();

// accounting_transaction_mode table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS accounting_transaction_mode (
		id INTEGER PRIMARY KEY,
		is_selected INTEGER,
		name TEXT,
		slug TEXT,
		service_charge REAL,
		account_owner TEXT,
		path TEXT,
		short_name TEXT,
		authorized_name TEXT,
		account_type_name TEXT,
		method_name TEXT,
		method_slug TEXT
	)
  	`
).run();

// config_data table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS config_data (
		id INTEGER PRIMARY KEY,
		domain_id INTEGER,
		printer TEXT,
		address TEXT,
		path TEXT,
		unit_commission TEXT,
		border_color TEXT,
		is_stock_history INTEGER,
		business_model_id INTEGER,
		print_footer_text TEXT,
		invoice_comment TEXT,
		vat_percent REAL,
		ait_percent REAL,
		font_size_label REAL,
		font_size_value REAL,
		vat_reg_no TEXT,
		multi_company INTEGER,
		vat_enable INTEGER,
		bonus_from_stock INTEGER,
		condition_sales INTEGER,
		is_marketing_executive INTEGER,
		pos_print INTEGER,
		fuel_station INTEGER,
		zero_stock INTEGER,
		system_reset INTEGER,
		tlo_commission INTEGER,
		sr_commission INTEGER,
		sales_return INTEGER,
		store_ledger INTEGER,
		invoice_width REAL,
		print_top_margin REAL,
		print_margin_bottom REAL,
		header_left_width REAL,
		header_right_width REAL,
		print_margin_report_top REAL,
		is_print_header INTEGER,
		is_invoice_title INTEGER,
		print_outstanding INTEGER,
		is_print_footer INTEGER,
		invoice_prefix TEXT,
		invoice_process TEXT,
		customer_prefix TEXT,
		production_type TEXT,
		invoice_type TEXT,
		border_width REAL,
		body_font_size REAL,
		sidebar_font_size REAL,
		invoice_font_size REAL,
		print_left_margin REAL,
		invoice_height REAL,
		left_top_margin REAL,
		is_unit_price INTEGER,
		body_top_margin REAL,
		sidebar_width REAL,
		body_width REAL,
		invoice_print_logo INTEGER,
		barcode_print INTEGER,
		custom_invoice INTEGER,
		pos_invoice_position INTEGER,
		multi_kitchen INTEGER,
		payment_split INTEGER,
		item_addons INTEGER,
		cash_on_delivery INTEGER,
		custom_invoice_print INTEGER,
		show_stock INTEGER,
		is_powered INTEGER,
		remove_image INTEGER,
		sku_category INTEGER,
		sku_color INTEGER,
		sku_size INTEGER,
		sku_wearhouse INTEGER,
		currency_id INTEGER,
		sku_brand INTEGER,
		sku_model INTEGER,
		barcode_price_hide INTEGER,
		barcode_color INTEGER,
		barcode_size INTEGER,
		barcode_brand INTEGER,
		vat_mode INTEGER,
		shop_name TEXT,
		created_at TEXT,
		updated_at TEXT,
		is_active_sms INTEGER,
		is_zero_receive_allow INTEGER,
		is_purchase_by_purchase_price INTEGER,
		ait_enable INTEGER,
		zakat_enable INTEGER,
		zakat_percent REAL,
		country_id INTEGER,
		stock_item INTEGER,
		is_description INTEGER,
		due_sales_without_customer INTEGER,
		vat_integration INTEGER,
		is_brand INTEGER,
		is_color INTEGER,
		is_size INTEGER,
		is_grade INTEGER,
		is_model INTEGER,
		is_multi_price INTEGER,
		is_measurement INTEGER,
		is_product_gallery INTEGER,
		is_batch_invoice INTEGER,
		is_provision INTEGER,
		is_sku INTEGER,
		is_sales_auto_approved INTEGER,
		is_purchase_auto_approved INTEGER,
		is_online INTEGER,
		is_pos INTEGER,
		is_table_pos INTEGER,
		is_pay_first INTEGER,
		raw_materials INTEGER,
		stockable INTEGER,
		post_production INTEGER,
		mid_production INTEGER,
		pre_production INTEGER,
		sku_warehouse INTEGER,
		pos_invoice_mode_id INTEGER,
		child_domain_exists INTEGER,

		domain TEXT,
		currency TEXT,
		business_model TEXT,
		pos_invoice_mode TEXT
	);
	`
).run();

// core_products table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS core_products (
		id INTEGER PRIMARY KEY,
		vendor_id INTEGER,
		product_name TEXT NOT NULL,
		name TEXT NOT NULL,
		product_nature TEXT NOT NULL,
		display_name TEXT NOT NULL,
		slug TEXT NOT NULL,
		category_id INTEGER NOT NULL,
		unit_id INTEGER NOT NULL,
		quantity REAL NOT NULL,
		purchase_price REAL NOT NULL,
		sales_price REAL NOT NULL,
		barcode TEXT,
		unit_name TEXT NOT NULL,
		feature_image TEXT
	);
	`
).run();

// core_customers table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS core_customers (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		mobile TEXT NOT NULL,
		address TEXT,
		email TEXT,
		code INTEGER NOT NULL,
		customer_id TEXT NOT NULL,
		alternative_mobile TEXT,
		reference_id TEXT,
		credit_limit REAL,
		customer_group_id INTEGER,
		unique_id TEXT NOT NULL,
		slug TEXT NOT NULL,
		marketing_id INTEGER,
		marketing_username TEXT,
		marketing_email TEXT,
		location_id INTEGER,
		location_name TEXT,
		created_date TEXT NOT NULL,
		created_at TEXT NOT NULL,
		debit REAL NOT NULL,
		credit REAL NOT NULL,
		balance REAL NOT NULL
	);
  	`
).run();

// core_vendors table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS core_vendors (
		id INTEGER PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		vendor_code VARCHAR(255) NOT NULL,
		code INTEGER NOT NULL,
		company_name VARCHAR(255),
		slug VARCHAR(255) NOT NULL,
		address VARCHAR(255),
		email VARCHAR(255),
		mobile VARCHAR(20),
		unique_id VARCHAR(255) NOT NULL,
		sub_domain_id INTEGER,
		customer_id INTEGER,
		created_date DATE NOT NULL,
		created_at TIMESTAMP NOT NULL
	);
  	`
).run();

// core_users table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS core_users (
		id INTEGER PRIMARY KEY,
		name VARCHAR(255),
		username VARCHAR(255) NOT NULL,
		email VARCHAR(255),
		mobile VARCHAR(20),
		created_date DATE NOT NULL,
		created_at TIMESTAMP NOT NULL,
		access_control_role JSON,
		android_control_role JSON
	);
  	`
).run();

// order_process table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS order_process (
		id INTEGER PRIMARY KEY,
		label VARCHAR(255) NOT NULL,
		value INTEGER NOT NULL
	);
  	`
).run();

// sales table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS sales (
		id INTEGER PRIMARY KEY,
		created TEXT,
		invoice TEXT,
		sub_total REAL,
		total REAL,
		approved_by_id INTEGER,
		payment REAL,
		discount REAL,
		is_domain_sales_completed INTEGER,
		discount_calculation REAL,
		discount_type TEXT,
		invoice_batch_id INTEGER,
		customerId INTEGER,
		customerName TEXT,
		customerMobile TEXT,
		createdByUser TEXT,
		createdByName TEXT,
		createdById INTEGER,
		salesById INTEGER,
		salesByUser TEXT,
		salesByName TEXT,
		process TEXT,
		mode_name TEXT,
		customer_address TEXT,
		customer_group TEXT,
		balance REAL,
		sales_items TEXT
	);
  	`
).run();

// invoice table
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS invoice_table (
		id INTEGER PRIMARY KEY,
		config_id INTEGER,
		created_by_id INTEGER,
		table_id INTEGER,
		sales_by_id INTEGER,
		serve_by_id INTEGER,
		transaction_mode_id INTEGER,
		customer_id INTEGER,
		invoice_mode TEXT,
		process TEXT,
		is_active INTEGER,
		order_date TEXT,
		sub_total REAL,
		payment REAL,
		table_nos TEXT,
		discount_type TEXT,
		total REAL,
		vat REAL,
		sd REAL,
		discount REAL,
		percentage INTEGER,
		discount_calculation INTEGER,
		discount_coupon TEXT,
		remark TEXT,
		particular_name TEXT,
		particular_slug TEXT,
		customer_name TEXT,
		customer_mobile TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`
).run();

db.prepare(
	`
	CREATE TABLE IF NOT EXISTS categories (
		id INTEGER PRIMARY KEY,
		name TEXT NOT NULL,
		slug TEXT NOT NULL
	)
	`
).run();

// invoice table item
db.prepare(
	`
	CREATE TABLE IF NOT EXISTS invoice_table_item (
		id INTEGER PRIMARY KEY,
		stock_item_id INTEGER,
		invoice_id INTEGER,
		display_name TEXT NOT NULL,
		quantity REAL NOT NULL,
		purchase_price REAL,
		sales_price REAL NOT NULL,
		custom_price INTEGER NOT NULL,
		is_print INTEGER NOT NULL,
		sub_total REAL NOT NULL,
		crated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`
).run();

// temp sales table
// db.prepare(
// 	`
// 	CREATE TABLE IF NOT EXISTS temp_sales_products (

// 	)`
// ).run();

const formatValue = (value) => {
	if (value === undefined || value === null) return null;
	try {
		if (typeof value === "object") return JSON.stringify(value);
		if (typeof value === "boolean") return value ? 1 : 0;
	} catch (e) {
		console.error(`Failed to stringify value: ${value}`, e);
		return null;
	}
	return value;
};

// data insertion into the table
const upsertIntoTable = (table, data) => {
	try {table = convertTableName(table);
	const keys = Object.keys(data);
	const placeholders = keys.map(() => "?").join(", ");
	const updatePlaceholders = keys.map((key) => `${key} = excluded.${key}`).join(", ");

	// convert objects/arrays to JSON strings
	const formattedData = keys.reduce((acc, key) => {
		acc[key] = formatValue(data[key]);
		return acc;
	}, {});

	const stmt = db.prepare(
		`INSERT INTO ${table} (${keys.join(", ")}) 
		 VALUES (${placeholders})
		 ON CONFLICT(id) DO UPDATE SET ${updatePlaceholders}`
	);

	// check if row exists by ID
	const existingRow = db.prepare(`SELECT id FROM ${table} WHERE id = ?`).get(data.id);

	if (!existingRow) {
		// insert new row if not found
		stmt.run(...Object.values(formattedData));
	} else {
		// update only if data is different
		const existingData = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(data.id);

		const isChanged = keys.some((key) => {
			// compare stored JSON string vs new value
			const existingValue =
				typeof existingData[key] === "string" && existingData[key].startsWith("{")
					? JSON.parse(existingData[key])
					: existingData[key];

			const newValue =
				typeof formattedData[key] === "string" && formattedData[key].startsWith("{")
					? JSON.parse(formattedData[key])
					: formattedData[key];

			return JSON.stringify(existingValue) !== JSON.stringify(newValue);
		});

		// update row if data is different
		if (isChanged) {
			stmt.run(...Object.values(formattedData));
		}
	}} catch (e) {
		console.log("Error in upsertIntoTable for this data:",table, data);
		console.error(e)
	}
};

const getDataFromTable = (table, idOrConditions, property = "id") => {
	table = convertTableName(table);
	const useGet = ["config_data", "users", "license_activate"].includes(table); // return a single row for these tables

	let stmt;
	let result;

	if (typeof idOrConditions === "object" && idOrConditions !== null) {
		// multiple conditions
		const keys = Object.keys(idOrConditions);
		const conditions = keys.map((key) => `${key} = ?`).join(" AND ");
		const values = keys.map((key) => idOrConditions[key]);

		stmt = db.prepare(`SELECT * FROM ${table} WHERE ${conditions}`);
		result = useGet ? stmt.get(...values) : stmt.all(...values);
	} else if (idOrConditions) {
		stmt = db.prepare(`SELECT * FROM ${table} WHERE ${property} = ?`);
		result = stmt.get(idOrConditions);
	} else {
		stmt = db.prepare(`SELECT * FROM ${table}`);
		result = useGet ? stmt.get() : stmt.all();
	}

	return result;
};

const updateDataInTable = (table, { id, data, condition = {}, property = "id" }) => {
	table = convertTableName(table);
	// build SET clause
	const setKeys = Object.keys(data);
	const setClause = setKeys.map((key) => `${key} = ?`).join(", ");
	const setValues = setKeys.map((key) => data[key]);

	// build WHERE clause
	let whereClause = "";
	let whereValues = [];

	if (id !== undefined) {
		// backward compatible: use id + property
		whereClause = `WHERE ${property} = ?`;
		whereValues = [id];
	} else if (typeof condition === "object" && Object.keys(condition).length > 0) {
		const conditionKeys = Object.keys(condition);
		whereClause = "WHERE " + conditionKeys.map((key) => `${key} = ?`).join(" AND ");
		whereValues = conditionKeys.map((key) => condition[key]);
	} else {
		throw new Error("No condition provided for update");
	}

	const stmt = db.prepare(`UPDATE ${table} SET ${setClause} ${whereClause}`);
	stmt.run(...setValues, ...whereValues);
};

const deleteDataFromTable = (table, id) => {
	table = convertTableName(table);
	const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);
	stmt.run(id);
};

const destroyTableData = (table = "users") => {
	const stmt = db.prepare(`DELETE FROM ${table}`);
	stmt.run();
};

module.exports = {
	upsertIntoTable,
	getDataFromTable,
	updateDataInTable,
	deleteDataFromTable,
	destroyTableData,
};
