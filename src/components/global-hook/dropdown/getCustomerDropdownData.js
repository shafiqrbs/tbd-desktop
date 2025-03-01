import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDropdownData } from "../../../store/core/utilitySlice.js";

// Rename to follow React hook naming convention
export function useCustomerDropdownData() {
	const dispatch = useDispatch();

	// Get dropdown data from core slice with memoized selector
	const customerDropdownData = useSelector(
		(state) => state.utility?.dropdowns?.core?.customers || []
	);

	// Fetch data only once on mount
	useEffect(() => {
		dispatch(
			getDropdownData({
				url: "core/select/customer",
				module: "core",
				dropdownType: "customers",
			})
		);
	}, [dispatch]);

	// Memoize the transformation to prevent unnecessary rerenders
	const customerDropdown = useMemo(() => {
		if (customerDropdownData && customerDropdownData.length > 0) {
			return customerDropdownData.map((type) => ({
				label: type.name,
				value: String(type.id),
			}));
		}
		return [];
	}, [customerDropdownData]);

	return customerDropdown;
}

// For backward compatibility
export default useCustomerDropdownData;
