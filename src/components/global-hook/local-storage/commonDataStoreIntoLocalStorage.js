import axios from "axios";

const tableMap = {
	"inventory/config": "config_data",
	"inventory/stock-item": "core_products",
	"core/customer/local-storage": "core_customers",
	"core/vendor/local-storage": "core_vendors",
	"core/user/local-storage": "core_users",
	"accounting/transaction-mode/local-storage": "accounting_transaction_mode",
};

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
					window.dbAPI.upsertIntoTable(table, data);
				}
			}
		} catch (error) {
			console.error(`Failed to fetch ${route}:`, error);
		}
	});

	await Promise.all(requests);
};

export default commonDataStoreIntoLocalStorage;
