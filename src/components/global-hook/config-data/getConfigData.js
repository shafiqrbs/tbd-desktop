import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "../../../store/core/crudSlice.js";

const getConfigData = () => {
	const dispatch = useDispatch();
	const configData = useSelector((state) => state.crudSlice?.data?.core?.menu) || [];

	const fetchData = async () => {
		const storedConfigData = await window.dbAPI.getDataFromTable("config-data");

		if (!storedConfigData || Object.keys(configData).length === 0) {
			dispatch(
				getIndexEntityData({
					url: "inventory/config",
					module: "core",
				})
			);
		} else {
			return JSON.parse(storedConfigData?.data || "{}");
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { configData: configData.data, fetchData };
};

export default getConfigData;
