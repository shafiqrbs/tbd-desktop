import axios from "axios";

const getUserData = async () => {
	const user = await window.dbAPI.getData("user");
	return JSON.parse(user || "{}")?.id;
};

// a helper function to get common headers
const getCommonHeaders = async (contentType = "application/json") => {
	const userId = await getUserData();
	return {
		Accept: "application/json",
		"Content-Type": contentType,
		"Access-Control-Allow-Origin": "*",
		"X-Api-Key": import.meta.env.VITE_API_KEY,
		"X-Api-User": userId,
	};
};

// a helper function to create axios instance with common config
const createAxiosRequest = (method, url, headers, data = null, params = null) => {
	const config = {
		method,
		url: `${import.meta.env.VITE_API_GATEWAY_URL}${url}`,
		headers: headers || getCommonHeaders(),
	};

	if (data) config.data = data;
	if (params) config.params = params;

	return axios(config);
};

export const getDataWithParam = async (value) => {
	try {
		const response = await createAxiosRequest("get", value.url, null, null, value.params);
		return response.data;
	} catch (error) {
		console.error("Error in getDataWithParam:", error);
		throw error;
	}
};

export const getDataWithoutParam = async (value) => {
	try {
		const url = typeof value === "object" && value.url ? value.url : value;
		const response = await createAxiosRequest("get", url);
		return response.data.data;
	} catch (error) {
		console.error("Error in getDataWithoutParam:", error);
		throw error;
	}
};

export const createData = async (value) => {
	try {
		const response = await createAxiosRequest("POST", value.url, null, value.data);
		return response;
	} catch (error) {
		if (error.response) {
			return {
				success: false,
				message: error.response.data.message,
				errors: error.response.data.errors,
			};
		}
		return {
			success: false,
			message: error.message,
			errors: {},
		};
	}
};

export const createDataWithFile = async (value) => {
	try {
		const response = await createAxiosRequest(
			"POST",
			value.url,
			getCommonHeaders("multipart/form-data"),
			value.data
		);
		return response;
	} catch (error) {
		console.error("Error in createDataWithFile:", error);
		throw error;
	}
};

export const editData = async (value) => {
	try {
		const response = await createAxiosRequest("get", value);
		return response;
	} catch (error) {
		console.error("Error in editData:", error);
		throw error;
	}
};

export const updateData = async (value) => {
	const id = value.url.split("/").pop();
	const isConfigUpdate = value.url === `inventory/config-update/${id}`;

	try {
		const response = await createAxiosRequest(
			isConfigUpdate ? "POST" : "PATCH",
			value.url,
			getCommonHeaders(isConfigUpdate ? "multipart/form-data" : "application/json"),
			value.data
		);
		return response;
	} catch (error) {
		if (error.response) {
			return {
				success: false,
				message: error.response.data.message,
				errors: error.response.data.errors,
			};
		}
		return {
			success: false,
			message: error.message,
			errors: {},
		};
	}
};

export const updateDataWithFile = async (value) => {
	try {
		const response = await createAxiosRequest(
			"POST",
			value.url,
			getCommonHeaders("multipart/form-data"),
			value.data
		);
		return response;
	} catch (error) {
		console.error("Error in updateDataWithFile:", error);
		throw error;
	}
};

export const inlineUpdateData = async (value) => {
	try {
		const response = await createAxiosRequest("POST", value.url, null, value.data);
		return response;
	} catch (error) {
		console.error("Error in inlineUpdateData:", error);
		throw error;
	}
};

export const showData = async (value) => {
	try {
		const response = await createAxiosRequest("get", value);
		return response;
	} catch (error) {
		console.error("Error in showData:", error);
		throw error;
	}
};

export const deleteData = async (value) => {
	try {
		const response = await createAxiosRequest("delete", value);
		return response;
	} catch (error) {
		console.error("Error in deleteData:", error);
		throw error;
	}
};

export const inlineStatusUpdateData = async (value) => {
	try {
		const response = await createAxiosRequest("get", value.url);
		return response;
	} catch (error) {
		console.error("Error in inlineStatusUpdateData:", error);
		throw error;
	}
};

export const getCoreSettingDropdown = async (value) => {
	try {
		const response = await createAxiosRequest("get", value.url, null, null, value.param);
		return {
			data: response.data,
			type: value.param["dropdown-type"],
		};
	} catch (error) {
		console.error("Error in getCoreSettingDropdown:", error);
		throw error;
	}
};
