import axios from "axios";

const tableMap = {
	"inventory/config": "config_data",
	"inventory/stock-item": "core_products",
	"core/customer/local-storage": "core_customers",
	"core/vendor/local-storage": "core_vendors",
	"core/user/local-storage": "core_users",
	"accounting/transaction-mode/local-storage": "accounting_transaction_mode",
	"inventory/sales": "sales",
	"inventory/purchase": "purchase",
};

const invoiceTableDefaultData = [
	{
		id: 6,
		config_id: 303,
		created_by_id: 6115,
		table_id: 79,
		sales_by_id: null,
		serve_by_id: null,
		transaction_mode_id: null,
		customer_id: null,
		invoice_mode: "table",
		process: null,
		is_active: 0,
		order_date: null,
		sub_total: null,
		payment: null,
		table_nos: null,
		discount_type: null,
		total: null,
		vat: null,
		sd: null,
		discount: null,
		percentage: null,
		discount_calculation: null,
		discount_coupon: null,
		remark: null,
		particular_name: "Table-1",
		particular_slug: null,
		customer_name: null,
		customer_mobile: null,
	},
	{
		id: 7,
		config_id: 303,
		created_by_id: 6115,
		table_id: 80,
		sales_by_id: null,
		serve_by_id: null,
		transaction_mode_id: 71,
		customer_id: 167593,
		invoice_mode: "table",
		process: null,
		is_active: 1,
		order_date: null,
		sub_total: 9340,
		payment: 0,
		table_nos: null,
		discount_type: "Flat",
		total: null,
		vat: null,
		sd: null,
		discount: null,
		percentage: null,
		discount_calculation: null,
		discount_coupon: null,
		remark: null,
		particular_name: "Table-2",
		particular_slug: null,
		customer_name: null,
		customer_mobile: null,
	},
	{
		id: 8,
		config_id: 303,
		created_by_id: 6115,
		table_id: 96,
		sales_by_id: null,
		serve_by_id: null,
		transaction_mode_id: null,
		customer_id: null,
		invoice_mode: "table",
		process: null,
		is_active: 0,
		order_date: null,
		sub_total: null,
		payment: null,
		table_nos: null,
		discount_type: "Percent",
		total: null,
		vat: null,
		sd: null,
		discount: null,
		percentage: null,
		discount_calculation: null,
		discount_coupon: null,
		remark: null,
		particular_name: "Table-3",
		particular_slug: null,
		customer_name: null,
		customer_mobile: null,
	},
	{
		id: 9,
		config_id: 303,
		created_by_id: 6115,
		table_id: 97,
		sales_by_id: null,
		serve_by_id: null,
		transaction_mode_id: null,
		customer_id: null,
		invoice_mode: "table",
		process: null,
		is_active: 0,
		order_date: null,
		sub_total: null,
		payment: null,
		table_nos: null,
		discount_type: "Percent",
		total: null,
		vat: null,
		sd: null,
		discount: null,
		percentage: null,
		discount_calculation: null,
		discount_coupon: null,
		remark: null,
		particular_name: "Table-4",
		particular_slug: null,
		customer_name: null,
		customer_mobile: null,
	},
];

const commonDataStoreIntoLocalStorage = async (user_id) => {
	const requests = Object.entries(tableMap).map(async ([route, table]) => {
		try {
			const response = await axios({
				method: "get",
				url: `${import.meta.env.VITE_API_GATEWAY_URL + route}`,
				headers: {
					Accept: `application/json`,
					"Content-Type": `application/json`,
					"Access-Control-Allow-Origin": "*",
					"X-Api-Key": import.meta.env.VITE_API_KEY,
					"X-Api-User": user_id,
				},
			});

			if (response.data.data) {
				const dataList = Array.isArray(response.data.data)
					? response.data.data
					: [response.data.data];

				for (const data of dataList) {
					// insert only if data is new or different
					if(table === "config_data"){
						const newData = {
							id: data.id,
							data: JSON.stringify(data),
						}
						window.dbAPI.upsertIntoTable(table, newData);
					}
					else{
						window.dbAPI.upsertIntoTable(table, data);
					}
				}
			}
		} catch (error) {
			console.error(`Failed to fetch ${route}:`, error);
		}
	});

	await Promise.all(requests);
	invoiceTableDefaultData.forEach((invoice) => {
		window.dbAPI.upsertIntoTable("invoice_table", invoice);
	});
};

export default commonDataStoreIntoLocalStorage;
