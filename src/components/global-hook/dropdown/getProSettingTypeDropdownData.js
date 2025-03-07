import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../store/core/utilitySlice.js";

const getProSettingTypeDropdownData = () => {
	const dispatch = useDispatch();
	const [settingTypeDropdown, setSettingTypeDropdown] = useState([]);

	// Get dropdown data from core slice
	const settingTypeDropdownData = useSelector(
		(state) => state.utilitySlice?.dropdowns?.production?.settingTypes || []
	);

	useEffect(() => {
		dispatch(
			getDropdownData({
				url: "production/select/setting-type",
				module: "production",
				dropdownType: "settingTypes",
			})
		);
	}, [dispatch]);

	useEffect(() => {
		if (settingTypeDropdownData && settingTypeDropdownData.length > 0) {
			const transformedData = settingTypeDropdownData.map((type) => ({
				label: type.name,
				value: String(type.id),
			}));
			setSettingTypeDropdown(transformedData);
		}
	}, [settingTypeDropdownData]);

	return settingTypeDropdown;
};

export default getProSettingTypeDropdownData;
