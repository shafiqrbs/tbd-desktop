/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../store/core/utilitySlice";

const getSettingProductTypeDropdownData = () => {
	const dispatch = useDispatch();
	const [settingDropdown, setSettingDropdown] = useState([]);

	useEffect(() => {
		const value = {
			url: "inventory/select/setting",
			params: { "dropdown-type": "product-type" },
			module: "core",
			dropdownType: "productType",
		};
		dispatch(getDropdownData(value));
	}, [dispatch]);

	const productTypeDropdown = useSelector(
		(state) => state.utilitySlice.dropdowns?.core?.productType
	);

	useEffect(() => {
		if (productTypeDropdown && productTypeDropdown.length > 0) {
			const transformedData = productTypeDropdown.map((type) => {
				return { label: type.name, value: String(type.id) };
			});
			setSettingDropdown(transformedData);
		}
	}, [productTypeDropdown]);

	return settingDropdown;
};

export default getSettingProductTypeDropdownData;
