/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../store/core/utilitySlice.js";

const getLocationDropdownData = () => {
	const dispatch = useDispatch();
	const [locationDropdown, setLocationDropdown] = useState([]);

	useEffect(() => {
		const valueForLocation = {
			url: "core/select/location",
			params: {
				term: "",
			},
			module: "core",
			dropdownType: "locations",
		};
		dispatch(getDropdownData(valueForLocation));
	}, [dispatch]);

	const locationDropdownData = useSelector(
		(state) => state.utilitySlice.dropdowns?.core?.locations
	);

	useEffect(() => {
		if (locationDropdownData && locationDropdownData.length > 0) {
			const transformedData = locationDropdownData.map((type) => {
				return { label: type.name, value: String(type.id) };
			});
			setLocationDropdown(transformedData);
		}
	}, [locationDropdownData]);

	return locationDropdown;
};

export default getLocationDropdownData;
