import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../store/core/utilitySlice.js";

const dropdownKeyMap = {
	"product-unit": "productUnitDropdown",
	color: "productColorDropdown",
	"product-grade": "productGradeDropdown",
	brand: "productBrandDropdown",
	size: "productSizeDropdown",
	model: "productModelDropdown",
	table: "posTableData",
};

const useSettingParticularDropdownData = (type) => {
	const dispatch = useDispatch();
	const [settingDropdown, setSettingDropdown] = useState([]);

	useEffect(() => {
		const value = {
			url: "inventory/select/particular",
			params: { "dropdown-type": type },
			module: "inventory",
			dropdownType: dropdownKeyMap[type],
		};
		dispatch(getDropdownData(value));
	}, [dispatch, type]);

	// Dynamically select dropdown data based on type
	const dropdownData = useSelector((state) => {
		const dynamicKey = dropdownKeyMap[type];
		return state.utilitySlice.dropdowns?.inventory[dynamicKey] || [];
	});

	useEffect(() => {
		if (dropdownData.length > 0) {
			const transformedData = dropdownData.map((item) => ({
				label: item.name,
				value: String(item.id),
			}));
			setSettingDropdown(transformedData);
		}
	}, [dropdownData]);

	return settingDropdown;
};

export default useSettingParticularDropdownData;
