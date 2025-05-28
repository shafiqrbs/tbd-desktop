import { useEffect, useMemo, useState } from "react";

import { useOutletContext } from "react-router";
import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import NewSales from "./NewSales.jsx";
import classes from "./css/Index.module.css";
import HeaderNavbar from "../HeaderNavbar.jsx";
import { getDropdownData } from "../../../../store/core/utilitySlice.js";
import { getIndexEntityData } from "../../../../store/core/crudSlice.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

export default function BakeryIndex() {
	const [categories, setCategories] = useState([]);
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 130;
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const progress = getLoadingProgress();
	const { configData } = getConfigData();

	// ✅ Redux Store Data
	const dropdownLoad = useSelector((state) => state.utilitySlice.dropdowns?.core?.dropdownLoad);
	const categoryDropdownData = useSelector(
		(state) => state.utilitySlice.dropdowns?.inventory?.categories
	);

	// ✅ Local State
	const [time, setTime] = useState(new Date().toLocaleTimeString());
	const [tables, setTables] = useState([]);
	const [tableCustomerMap, setTableCustomerMap] = useState({});
	const [customerObject, setCustomerObject] = useState({});
	const [tableSplitPaymentMap, setTableSplitPaymentMap] = useState({});
	const [indexData, setIndexData] = useState([]);
	const [invoiceData, setInvoiceData] = useState([]);
	const [invoiceMode, setInvoiceMode] = useState(null);
	const [tableId, setTableId] = useState(null);
	const [reloadInvoiceData, setReloadInvoiceData] = useState(false);

	// ✅ Optimized Category Dropdown Fetching

	useEffect(() => {
		const value = {
			url: "inventory/select/category",
			params: {
				type: "all",
			},
			module: "inventory",
			dropdownType: "categories",
		};
		dispatch(getDropdownData(value));
	}, [dropdownLoad]);

	useEffect(() => {
		async function refetchCategories() {
			const categories = (await window.dbAPI.getDataFromTable("categories")) || [];
			setCategories(categories.map(({ name, id }) => ({ label: name, value: String(id) })));
		}
		refetchCategories();
	}, [isOnline]);

	// ✅ Category Dropdown Data Transformation (Using `useMemo`)
	const categoryDropdown = useMemo(() => {
		return categoryDropdownData?.length > 0
			? categoryDropdownData.map(({ name, id }) => ({ label: name, value: String(id) }))
			: [];
	}, [categoryDropdownData]);

	// ✅ Optimized Time Update Using `setInterval`
	useEffect(() => {
		const intervalId = setInterval(() => {
			setTime(new Date().toLocaleTimeString());
		}, 1000); // Update time every second instead of every 100ms

		return () => clearInterval(intervalId);
	}, []);

	// ✅ Optimized Data Fetching
	useEffect(() => {
		const fetchData = async () => {
			if (isOnline) {
				try {
					const resultAction = await dispatch(
						getIndexEntityData({
							url: "inventory/pos/check/invoice-mode",
							params: {},
							module: "pos",
						})
					);
					if (getIndexEntityData.fulfilled.match(resultAction)) {
						setInvoiceMode(resultAction.payload?.data?.invoice_mode);
						setIndexData(resultAction.payload?.data?.data || []);
					} else {
						console.error("Error fetching data:", resultAction);
					}
				} catch (err) {
					console.error("Unexpected error:", err);
				}
			} else {
				const result = await window.dbAPI.getDataFromTable("invoice_table");
				setIndexData(result);
				setInvoiceMode("table");
			}
		};
		fetchData();
	}, [isOnline, dispatch]);

	useEffect(() => {
		if (tableId === null) return;
		const fetchData = async () => {
			try {
				if (isOnline) {
					const resultAction = await dispatch(
						getIndexEntityData({
							url: "inventory/pos/invoice-details",
							params: {
								invoice_id: tableId,
							},
							module: "posDetails",
						})
					);
					if (getIndexEntityData.fulfilled.match(resultAction)) {
						setInvoiceData(resultAction.payload.data?.data);
					} else {
						console.error("Error fetching data:", resultAction);
					}
				} else {
					const [invoiceTable, invoiceItems] = await Promise.all([
						window.dbAPI.getDataFromTable("invoice_table", tableId),
						window.dbAPI.getDataFromTable("invoice_table_item"),
					]);
					const filteredItems = invoiceItems.filter(
						(data) => Number(data.invoice_id) === tableId
					);
					setInvoiceData({ ...invoiceTable, invoice_items: filteredItems });
				}
			} catch (err) {
				console.error("Unexpected error:", err);
			} finally {
				setReloadInvoiceData(false);
			}
		};
		fetchData();
	}, [dispatch, tableId, reloadInvoiceData, isOnline]);

	// ✅ Memoized Active Table Extraction
	const tableIdMemoized = useMemo(() => {
		return indexData?.find((item) => item.is_active)?.id || null;
	}, [indexData]);

	useEffect(() => {
		setTableId(tableIdMemoized);
	}, [tableIdMemoized]);

	// ✅ Memoized Transformed Table Data
	const transformedTables = useMemo(() => {
		return indexData?.map(
			({
				id,
				particular_name,
				username,
				customer_name,
				customer_id,
				is_active,
				table_id,
				user_id,
			}) => {
				let particularName =
					invoiceMode === "table"
						? `${particular_name}`
						: invoiceMode === "user"
						? `${username}`
						: invoiceMode === "customer"
						? `${customer_name}`
						: `Unknown`;

				return {
					id,
					status: is_active,
					statusHistory: [],
					currentStatusStartTime: null,
					elapsedTime: "00:00:00",
					value: particularName,
					customer_id: customer_id,
					table_id: table_id,
					user_id: user_id,
				};
			}
		);
	}, [indexData, invoiceMode]);

	// ✅ Efficient `tables` State Update
	useEffect(() => {
		setTables(transformedTables);
	}, [transformedTables]);

	// ✅ Time Update in Tables
	useEffect(() => {
		setTables((prevTables) => {
			return prevTables?.map((table) =>
				table.time !== time ? { ...table, time: time } : table
			);
		});
	}, [time]);

	// ✅ Memoized Selected Customer Object
	const selectedCustomer = useMemo(
		() => tableCustomerMap[tableId] || {},
		[tableId, tableCustomerMap]
	);

	// ✅ Optimized Customer Object State Update
	useEffect(() => {
		if (
			tableId &&
			selectedCustomer &&
			JSON.stringify(customerObject || {}) !== JSON.stringify(selectedCustomer)
		) {
			setCustomerObject(selectedCustomer);
		} else if (!tableId && customerObject && Object.keys(customerObject).length > 0) {
			setCustomerObject({});
		}
	}, [tableId, selectedCustomer]);

	// ✅ Utility Functions for Table Operations
	const updateTableCustomer = (tableId, customerId, customerData) => {
		if (!tableId) return;
		setTableCustomerMap((prev) => ({
			...prev,
			[tableId]: { id: customerId, ...customerData },
		}));
	};

	const clearTableCustomer = (tableId) => {
		if (!tableId) return;
		setTableCustomerMap((prev) => {
			const newMap = { ...prev };
			delete newMap[tableId];
			return newMap;
		});
	};

	const updateTableSplitPayment = (tableId, splitPayments) => {
		if (!tableId) return;
		setTableSplitPaymentMap((prev) => ({ ...prev, [tableId]: splitPayments }));
	};

	const clearTableSplitPayment = (tableId) => {
		if (!tableId) return;
		setTableSplitPaymentMap((prev) => {
			const newMap = { ...prev };
			delete newMap[tableId];
			return newMap;
		});
	};

	return (
		<>
			{progress !== 100 && (
				<Progress color="red" size="sm" striped animated value={progress} />
			)}
			{progress === 100 && (
				<>
					{configData?.inventory_config.is_pos && (
						<HeaderNavbar
							pageTitle={t("ManageCustomer")}
							roles={t("Roles")}
							tables={tables}
							tableId={tableId}
							setTables={setTables}
							setTableId={setTableId}
							tableCustomerMap={tableCustomerMap}
							setCustomerObject={setCustomerObject}
							invoiceMode={invoiceMode}
						/>
					)}
					<Box
						h={height + 4}
						mt={6}
						ml={6}
						mr={12}
						style={{ borderRadius: "4px" }}
						c={"#EAECED"}
						className={classes["body"]}
					>
						<Box pl="4">
							<NewSales
								setInvoiceData={setInvoiceData}
								categoryDropdown={
									categoryDropdown.length ? categoryDropdown : categories
								}
								tableId={tableId}
								setTableId={setTableId}
								tables={tables}
								setTables={setTables}
								tableCustomerMap={tableCustomerMap}
								updateTableCustomer={updateTableCustomer}
								clearTableCustomer={clearTableCustomer}
								customerObject={customerObject}
								setCustomerObject={setCustomerObject}
								updateTableSplitPayment={updateTableSplitPayment}
								clearTableSplitPayment={clearTableSplitPayment}
								tableSplitPaymentMap={tableSplitPaymentMap}
								invoiceMode={invoiceMode}
								invoiceData={invoiceData}
								reloadInvoiceData={reloadInvoiceData}
								setReloadInvoiceData={setReloadInvoiceData}
							/>
						</Box>
					</Box>
				</>
			)}
		</>
	);
}
