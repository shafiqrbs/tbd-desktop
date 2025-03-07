import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "../../../store/core/crudSlice.js";

const getConfigData = () => {
	const dispatch = useDispatch();
	const configData = useSelector((state) => state.crudSlice?.data?.core?.list) || [];

	const fetchData = () => {
		const storedConfigData = localStorage.getItem("config-data");
		if (!storedConfigData) {
			dispatch(
				getIndexEntityData({
					url: "inventory/config",
					module: "core",
				})
			);
		} else {
			return JSON.parse(storedConfigData);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	return { configData, fetchData };
};

export default getConfigData;
