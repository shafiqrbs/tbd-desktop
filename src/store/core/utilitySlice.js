import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
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
			// we can add other inventory dropdowns
		},
		sales: {
			customers: [],
			salesTypes: [],
			// we can add other sales dropdowns
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
	},
	extraReducers: (builder) => {
		builder
			.addCase(getDropdownData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getDropdownData.fulfilled, (state, action) => {
				const { data, dropdownType, module } = action.payload;
				state.dropdowns[module][dropdownType] = data;
				state.isLoading = false;
			})
			.addCase(getDropdownData.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});
	},
});

export const { clearDropdowns } = utilitySlice.actions;
export default utilitySlice.reducer;
