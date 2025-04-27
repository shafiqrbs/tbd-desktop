import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../../store/core/utilitySlice.js";

const getCoreWarehouseDropdownData = () => {
	const dispatch = useDispatch();
	const [settingDropdown, setSettingDropdown] = useState([]);

	useEffect(() => {
		const value = {
			url: "core/select/warehouse",
			params: { "dropdown-type": "warehouse" },
			module: "core",
			dropdownType: "warehouse",
		};
		dispatch(getDropdownData(value));
	}, [dispatch]);

	const dropdownData = useSelector((state) => state?.utilitySlice?.dropdowns?.core?.warehouse);

	useEffect(() => {
		if (dropdownData && dropdownData.length > 0) {
			const transformedData = dropdownData.map((type) => {
				return { label: type.name + " (" + type.location + ")", value: String(type.id) };
			});
			setSettingDropdown(transformedData);
		}
	}, [dropdownData]);

	return settingDropdown;
};

export default getCoreWarehouseDropdownData;
