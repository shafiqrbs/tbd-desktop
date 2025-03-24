/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../store/core/utilitySlice.js";

const getSettingCategoryDropdownData = () => {
	const dispatch = useDispatch();
	const [settingDropdown, setSettingDropdown] = useState([]);

	useEffect(() => {
		const value = {
			url: "inventory/select/category",
			params: {
				type: "parent",
			},
			module: "inventory",
			dropdownType: "categories",
		};
		dispatch(getDropdownData(value));
	}, [dispatch]);

	const categoryDropdownData = useSelector(
		(state) => state?.utilitySlice?.dropdowns?.inventory?.categories
	);

	useEffect(() => {
		if (categoryDropdownData && categoryDropdownData.length > 0) {
			const transformedData = categoryDropdownData.map((type) => {
				return { label: type.name, value: String(type.id) };
			});
			setSettingDropdown(transformedData);
		}
	}, [categoryDropdownData]);

	return settingDropdown;
};

export default getSettingCategoryDropdownData;
