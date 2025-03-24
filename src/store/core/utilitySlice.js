import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { getDataWithoutParam, getDataWithParam } from "../../services/apiService";

export const getDropdownData = createAsyncThunk(
	"core/dropdown",
	async (value, { rejectWithValue }) => {
		try {
			const data = value.params
				? await getDataWithParam(value)
				: await getDataWithoutParam(value);
			return {
				data,
				dropdownType: value.dropdownType,
				module: value.module,
			};
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to fetch dropdown data");
		}
	}
);

const initialState = {
	dropdowns: {
		inventory: {
			categories: [],
			brands: [],
			productUnitDropdown: [],
		},
		sales: {
			customers: [],
			salesTypes: [],
		},
		production: {
			settingTypes: [],
			materialProducts: [],
			proConfig: [],
			proItems: [],
		},
		core: {
			customers: [],
			vendors: [],
			users: [],
			locations: [],
			executives: [],
			productType: [],
			customerGroup: [],
		},
	},
	isLoading: false,
	error: null,
};

const utilitySlice = createSlice({
	name: "utility",
	initialState,
	reducers: {
		clearDropdowns: (state, action) => {
			const { module } = action.payload;
			state.dropdowns[module] = {};
		},
		coreSettingDropdown: (state, action) => {
			const { data } = action.payload;
			state.dropdowns.core.settingTypes = data;
		},
		getSettingDropdown: (state, action) => {
			const { data } = action.payload;
			state.dropdowns.production.settingTypes = data;
		},
		setCustomersDropdown: (state, action) => {
			const { data } = action.payload;
			state.dropdowns.core.customers = data;
		},
		getCategoryDropdown: (state, action) => {
			const { data } = action.payload;
			state.dropdowns.inventory.categories = data;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDropdownData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getDropdownData.fulfilled, (state, action) => {
				const { data, dropdownType, module } = action.payload;
				state.dropdowns[module][dropdownType] = Array.isArray(data) ? data : data.data;
				state.isLoading = false;
			})
			.addCase(getDropdownData.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const selectCustomerDropdownData = createSelector(
	[(state) => state.utilitySlice?.dropdowns?.core?.customers],
	(customers) => (customers ? [...customers] : [])
);

export const {
	clearDropdowns,
	setCustomersDropdown,
	getLocationDropdown,
	coreSettingDropdown,
	getSettingDropdown,
	getCategoryDropdown,
} = utilitySlice.actions;
export default utilitySlice.reducer;
