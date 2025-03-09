import axios from "axios";

const commonDataStoreIntoLocalStorage = async (user_id) => {
	const apiBackendRoutes = [
		"inventory/config",
		"inventory/stock-item",
		"core/customer/local-storage",
		"core/vendor/local-storage",
		"core/user/local-storage",
		"accounting/transaction-mode/local-storage",
	];
	const localStorageKeys = [
		"config_data",
		"core_products",
		"core_customers",
		"core_vendors",
		"core_users",
		"accounting_transaction_mode",
	];

	for (let i = 0; i < apiBackendRoutes.length; i++) {
		try {
			const response = await axios({
				method: "get",
				url: `${import.meta.env.VITE_API_GATEWAY_URL + apiBackendRoutes[i]}`,
				headers: {
					Accept: `application/json`,
					"Content-Type": `application/json`,
					"Access-Control-Allow-Origin": "*",
					"X-Api-Key": import.meta.env.VITE_API_KEY,
					"X-Api-User": user_id,
				},
			});

			if (response.data.data) {
				await window.dbAPI.upsertData(
					localStorageKeys[i],
					JSON.stringify(response?.data?.data || [])
				);
			}
		} catch (error) {
			console.error(`Failed to fetch ${apiBackendRoutes[i]}:`, error);
		}
	}
};

export default commonDataStoreIntoLocalStorage;
