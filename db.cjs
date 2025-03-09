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
db.prepare(`
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
		is_pos INTEGER,
		is_table_pos INTEGER,
		is_pay_first INTEGER,
		raw_materials INTEGER,
		stockable INTEGER,
		post_production INTEGER,
		mid_production INTEGER,
		pre_production INTEGER,
		domain TEXT,
		currency TEXT,
		business_model TEXT
	);
`);

// core_products table
db.prepare(
	`
	CREATE TABLE core_products (
		ID INTEGER PRIMARY KEY,
		ProductName TEXT NOT NULL,
		Name TEXT NOT NULL,
		ProductNature TEXT NOT NULL,
		DisplayName TEXT NOT NULL,
		Slug TEXT NOT NULL,
		CategoryID INTEGER NOT NULL,
		UnitID INTEGER NOT NULL,
		Quantity REAL NOT NULL,
		PurchasePrice REAL NOT NULL,
		SalesPrice REAL NOT NULL,
		Barcode TEXT NOT NULL,
		UnitName TEXT NOT NULL,
		FeatureImage TEXT
	);
	`
).run();

// core_customers table
db.prepare(
	`
	CREATE TABLE core_customers (
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
	CREATE TABLE core_vendors (
		id INT PRIMARY KEY,
		name VARCHAR(255) NOT NULL,
		vendor_code VARCHAR(255) NOT NULL,
		code INT NOT NULL,
		company_name VARCHAR(255),
		slug VARCHAR(255) NOT NULL,
		address VARCHAR(255),
		email VARCHAR(255),
		mobile VARCHAR(20),
		unique_id VARCHAR(255) NOT NULL,
		sub_domain_id INT,
		customer_id INT,
		created_date DATE NOT NULL,
		created_at TIMESTAMP NOT NULL
	);
  	`
).run();

// core_users table
db.prepare(
	`
	CREATE TABLE core_users (
		id INT PRIMARY KEY,
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
	CREATE TABLE order_process (
		id INT PRIMARY KEY,
		label VARCHAR(255) NOT NULL,
		value INT NOT NULL
	);
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
