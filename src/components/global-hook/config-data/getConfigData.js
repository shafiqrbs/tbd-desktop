import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getShowEntityData } from "../../../store/inventory/crudSlice.js";

const getConfigData = () => {
	const dispatch = useDispatch();
	const configData = useSelector((state) => state?.inventoryCrudSlice?.showEntityData) || [];

	const fetchData = () => {
		// Only fetch if we don't have the data in localStorage
		const storedConfigData = localStorage.getItem("config-data");
		if (!storedConfigData) {
			dispatch(getShowEntityData("inventory/config"));
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
