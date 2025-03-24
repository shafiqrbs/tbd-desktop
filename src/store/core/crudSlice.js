import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	createData,
	createDataWithFile,
	deleteData,
	editData,
	getDataWithParam,
	getDataWithoutParam,
	updateData,
	updateDataWithFile,
	showData,
} from "../../services/apiService.js";

// a generic CRUD thunks that can be used inside all modules
export const getIndexEntityData = createAsyncThunk("core/index", async (value) => {
	try {
		const data = value.params
			? await getDataWithParam(value)
			: await getDataWithoutParam(value);
		return { data, module: value.module };
	} catch (error) {
		console.error("Failed to fetch, reason:", error);
	}
});

export const storeEntityData = createAsyncThunk(
	"core/store",
	async (value, { rejectWithValue }) => {
		try {
			const response = value.isFile
				? await createDataWithFile(value)
				: await createData(value);
			return { ...response, module: value.module };
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to store data");
		}
	}
);

export const updateEntityData = createAsyncThunk(
	"core/update",
	async (value, { rejectWithValue }) => {
		try {
			const response = value.isFile
				? await updateDataWithFile(value)
				: await updateData(value);
			return { ...response, module: value.module };
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to update data");
		}
	}
);

export const deleteEntityData = createAsyncThunk(
	"core/delete",
	async (value, { rejectWithValue }) => {
		try {
			const response = await deleteData(value);
			return { ...response, module: value.module };
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to delete data");
		}
	}
);

export const editEntityData = createAsyncThunk("core/edit", async (value, { rejectWithValue }) => {
	try {
		const response = await editData(value.url);
		return { ...response, module: value.module };
	} catch (error) {
		return rejectWithValue(error.response?.data || "Failed to edit data");
	}
});

export const showInstantEntityData = createAsyncThunk(
	"show-instant", // Unique action type
	async (value, { rejectWithValue }) => {
		try {
			const data = await showData(value); // Wait for the API response
			return data; // Return data (will trigger `fulfilled` case)
		} catch (error) {
			return rejectWithValue(error.response?.data || "Failed to fetch data"); // Return error details to `rejected` case
		}
	}
);

const initialState = {
	data: {
		inventory: {
			list: [],
			current: null,
			validation: false,
			validationMessage: [],
			filters: {
				product: {},
				category: {},
			},
			deleteMessage: "",
			formLoading: false,
			insertType: "create",
			editData: null,
		},
		sales: {
			list: [],
			current: null,
			filters: {
				sales: {},
			},
			filterData: null,
			validation: false,
			validationMessage: [],
			formLoading: false,
			insertType: "create",
			newData: null,
			editData: null,
			deleteData: null,
		},
		purchase: {
			list: [],
			current: null,
			filters: {
				purchase: { searchKeyword: "", vendor: "", start_date: "", end_date: "" },
			},
			filterData: null,
			validation: false,
			validationMessage: [],
			formLoading: false,
			insertType: "create",
			editData: null,
			data: null,
		},
		production: {
			list: [],
			current: null,
			validation: false,
			validationMessage: [],
			filters: {
				setting: {},
				batch: {},
				recipeItem: {},
			},
			measurementInputData: {
				field: {},
			},
			itemProcessUpdate: false,
			deleteMessage: "",
			formLoading: false,
			insertType: "create",
			editData: null,
		},
		core: {
			list: [],
			menu: [],
			customers: [],
			current: null,
			validation: false,
			validationMessage: [],
			deleteMessage: "",
			fetching: false,
			filters: {
				customer: {},
				vendor: {
					name: "",
					mobile: "",
					company_name: "",
				},
				user: {},
				warehouse: {},
				categoryGroup: {},
			},
			searchKeyword: "",
			formLoading: false,
			insertType: "create",
			editData: null,
		},
		// +++++ new other modules can be added from here +++++
	},
	isLoading: false,
	error: null,
};

const crudSlice = createSlice({
	name: "crud",
	initialState,
	reducers: {
		setCurrent: (state, action) => {
			const { module, value } = action.payload;
			state.data[module].current = value;
		},
		setFilter: (state, action) => {
			const { module, filterKey, name, value } = action.payload;

			if (!state.data[module].filters) {
				console.warn(
					`Warning: Filters object missing in module "${module}". Initializing...`
				);
				state.data[module].filters = {};
			}

			if (!state.data[module].filters[filterKey]) {
				console.warn(`Warning: Filter key "${filterKey}" missing. Initializing...`);
				state.data[module].filters[filterKey] = {};
			}

			state.data[module].filters[filterKey][name] = value;
		},
		setMenu: (state, action) => {
			const { module, value } = action.payload;
			state.data[module].menu = value;
		},
		setValidation: (state, action) => {
			const { module, value } = action.payload;
			state.data[module].validation = value;
		},
		clearValidationMessage: (state, action) => {
			const { module } = action.payload;
			state.data[module].validationMessage = [];
		},
		resetState: (state, action) => {
			const { modules } = action.payload;
			modules.forEach((module) => {
				state.data[module] = {
					list: [],
					current: null,
					validation: false,
					validationMessage: [],
					filters: state.data[module]?.filters ? {} : undefined,
					// preserve the structure but reset the values
					...Object.fromEntries(
						Object.entries(state.data[module] || {}).map(([key, value]) => [
							key,
							Array.isArray(value)
								? []
								: typeof value === "object"
								? {}
								: typeof value === "boolean"
								? false
								: null,
						])
					),
				};
			});
		},
		resetFilters: (state, action) => {
			const { module } = action.payload;
			if (state.data[module]?.filters) {
				state.data[module].filters = {};
			}
		},
		setSearchKeyword: (state, action) => {
			const { module, value } = action.payload;
			state.data[module].searchKeyword = value;
		},
		setFetching: (state, action) => {
			const { module = "core", value } = action.payload;
			state.data[module].fetching = value;
		},
		setDeleteMessage: (state, action) => {
			const { module, message } = action.payload;
			state.data[module].deleteMessage = message;
		},
		setFormLoading: (state, action) => {
			const { module, value } = action.payload;
			state.data[module].formLoading = value;
		},
		setInsertType: (state, action) => {
			const { module, value } = action.payload;
			state.data[module].insertType = value;
		},
		setEditEntityData: (state, action) => {
			const { module, data } = action.payload;
			state.data[module].editData = data;
		},
		// ++++ add other generic reducers ++++
	},
	extraReducers: (builder) => {
		// handle index case
		builder
			.addCase(getIndexEntityData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getIndexEntityData.fulfilled, (state, action) => {
				const { data, module } = action.payload;
				state.data[module].list = data;
				state.isLoading = false;
			})
			.addCase(getIndexEntityData.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});

		// handle store
		builder.addCase(storeEntityData.fulfilled, (state, action) => {
			const { data, module } = action.payload;
			if (data.success) {
				state.data[module].validation = false;
				state.data[module].validationMessage = [];
			} else {
				state.data[module].validation = true;
				state.data[module].validationMessage = data.errors;
			}
		});

		// handle update case
		builder.addCase(updateEntityData.fulfilled, (state, action) => {
			const { data, module } = action.payload;
			if (data.success) {
				state.data[module].validation = false;
				state.data[module].validationMessage = [];
			} else {
				state.data[module].validation = true;
				state.data[module].validationMessage = data.errors;
			}
		});

		// handle delete case
		builder.addCase(deleteEntityData.fulfilled, (state, action) => {
			const { module = "core", data } = action.payload;
			state.data[module].deleteMessage = data?.data;
			state.data[module].fetching = true;
		});

		// Add edit case
		builder
			.addCase(editEntityData.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editEntityData.fulfilled, (state, action) => {
				const { data, module } = action.payload;
				state.data[module].editData = data?.data || data;
				state.isLoading = false;
			})
			.addCase(editEntityData.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			});

		builder.addCase(showInstantEntityData.fulfilled, (state, action) => {
			const { data, module = "inventory" } = action.payload;
			state.data[module].showEntityData = data.data;
		});
	},
});

export const {
	setCurrent,
	setValidation,
	clearValidationMessage,
	resetState,
	resetFilters,
	setSearchKeyword,
	setFetching,
	setDeleteMessage,
	setFormLoading,
	setInsertType,
	setEditEntityData,
	setMenu,
	setFilter,
} = crudSlice.actions;

export const selectVendorFilters = (state) => state.crudSlice?.data?.core?.filters?.vendor;

export const selectEntityData = (state) => state.crudSlice?.data?.core?.editData;

export default crudSlice.reducer;
