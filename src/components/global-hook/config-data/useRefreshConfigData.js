import { useEffect } from "react";
import { setUptoDateConfigData } from "../../../services/apiService";

export default function useRefreshConfigData() {
	useEffect(() => {
		const fetchData = async () => {
			const res = await setUptoDateConfigData();
			const default_config_data = await window.dbAPI.getDataFromTable("config_data");
			if (default_config_data?.id) {
				window.dbAPI.updateDataInTable("config_data", {
					id: default_config_data.id,
					data: {
						data: JSON.stringify(res),
					},
				});
			}
		};
		fetchData();
	}, []);

	return null;
}
