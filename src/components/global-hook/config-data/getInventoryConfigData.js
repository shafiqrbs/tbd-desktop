import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getIndexData } from "../../../store/core/crudSlice.js";

const getInventoryConfigData = () => {
	const dispatch = useDispatch();
	const inventoryConfigData = useSelector((state) => state.crud?.data?.inventory?.list);

	useEffect(() => {
		dispatch(
			getIndexData({
				url: "inventory/product-config",
				module: "inventory",
			})
		);
	}, []);

	return inventoryConfigData;
};

export default getInventoryConfigData;
