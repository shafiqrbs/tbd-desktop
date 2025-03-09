import axios from "axios";

const customerDataStoreIntoLocalStorage = async () => {
	try {
		const user = await window.dbAPI.getData("user");
		const userId = user ? JSON.parse(user).id : null;

		const response = await axios.get(
			`${import.meta.env.VITE_API_GATEWAY_URL}core/customer/local-storage`,
			{
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"X-Api-Key": import.meta.env.VITE_API_KEY,
					"X-Api-User": userId,
				},
			}
		);

		let { data } = response;

		if (data && data.data) {
			await window.dbAPI.upsertData("core-customers", JSON.stringify(data.data));
		}
	} catch (error) {
		console.error(error);
	}
};

export default customerDataStoreIntoLocalStorage;
