import { useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { storeEntityData } from "../../../../../store/core/crudSlice";
import { useDispatch } from "react-redux";
import { showNotificationComponent } from "../../../../core-component/showNotificationComponent";
import { useOutletContext } from "react-router";
import getConfigData from "../../../../global-hook/config-data/getConfigData";
import { calculateSubTotalWithVAT } from "../../../../../lib";

export const useCartOperations = ({
	enableTable,
	tableId,
	products,
	currentStatus,
	updateTableStatus,
	setLoadCartProducts,
	tables,
	setTables,
	setReloadInvoiceData,
}) => {
	const { isOnline } = useOutletContext();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { configData } = getConfigData();

	const getStorageKey = useCallback(() => {
		return enableTable && tableId ? `table-${tableId}-pos-products` : "temp-pos-products";
	}, [enableTable, tableId]);

	const getCartProducts = async () => {
		try {
			const cartProducts = await window.dbAPI.getDataFromTable("invoice_table_item", {
				invoice_id: tableId,
			});

			return cartProducts;
		} catch (error) {
			console.error(error);
		}
	};

	const updateTableStatusIfNeeded = useCallback(
		(cartLength) => {
			if (!enableTable || !tableId) return;

			if (cartLength === 1 && currentStatus === "Free") {
				updateTableStatus("Occupied");
			} else if (cartLength === 0 && currentStatus === "Occupied") {
				// Update both table status and tables state
				updateTableStatus("Free");
				if (tables && setTables) {
					setTables(
						tables.map((table) =>
							table.id === tableId ? { ...table, status: "Free" } : table
						)
					);
				}
			}
		},
		[enableTable, tableId, currentStatus, updateTableStatus, tables, setTables]
	);

	const handleIncrement = useCallback(
		async (productId) => {
			let product = products?.find((p) => p.id == productId);
			if (!products) {
				const allProducts = await window.dbAPI.getDataFromTable("core_products");
				product = allProducts.find((p) => p.id == productId);
			}

			// Get VAT config from config_data
			const vatConfig = configData?.inventory_config?.config_vat;

			const data = {
				url: "inventory/pos/inline-update",
				data: {
					invoice_id: tableId,
					field_name: "items",
					value: {
						...product,
						quantity: 1,
					},
				},
				module: "pos",
			};
			try {
				if (isOnline) {
					const resultAction = await dispatch(storeEntityData(data));

					if (resultAction.payload?.status !== 200) {
						showNotificationComponent(
							resultAction.payload?.message || "Error updating invoice",
							"red",
							"",
							"",
							true
						);
					}
				} else {
					let newSubTotal = 0;
					const [invoiceTableItem, invoiceTable] = await Promise.all([
						window.dbAPI.getDataFromTable("invoice_table_item", {
							invoice_id: tableId,
							stock_item_id: product.id,
						}),
						window.dbAPI.getDataFromTable("invoice_table", tableId),
					]);

					if (invoiceTableItem?.length) {
						const updatedQuantity = invoiceTableItem[0].quantity + 1;
						const updatedSubTotal = calculateSubTotalWithVAT(
							product.sales_price,
							updatedQuantity,
							vatConfig
						);
						const deltaSubTotal = updatedSubTotal - invoiceTableItem[0].sub_total;

						await window.dbAPI.updateDataInTable("invoice_table_item", {
							condition: { invoice_id: tableId, stock_item_id: product.id },
							data: {
								stock_item_id: product.id,
								invoice_id: tableId,
								quantity: updatedQuantity,
								purchase_price: product.purchase_price,
								sales_price: product.sales_price,
								sub_total: updatedSubTotal,
								display_name: product.display_name,
							},
						});
						newSubTotal = deltaSubTotal;
					} else {
						const subTotal = calculateSubTotalWithVAT(
							product.sales_price,
							1,
							vatConfig
						);
						await window.dbAPI.upsertIntoTable("invoice_table_item", {
							stock_item_id: product.id,
							invoice_id: tableId,
							quantity: 1,
							purchase_price: 0,
							sales_price: product.sales_price,
							custom_price: 0,
							is_print: 0,
							sub_total: subTotal,
							display_name: product.display_name,
						});
						newSubTotal = subTotal;
					}

					await window.dbAPI.updateDataInTable("invoice_table", {
						id: tableId,
						data: {
							sub_total: invoiceTable.sub_total + newSubTotal,
						},
					});
				}
			} catch (error) {
				showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
				console.error("Error updating invoice:", error);
			} finally {
				setReloadInvoiceData(true);
			}
		},
		[products, tableId, dispatch, setReloadInvoiceData, isOnline]
	);

	const handleDecrement = useCallback(
		async (productId) => {
			let product = products?.find((p) => p.id == productId);
			if (!products) {
				const allProducts = await window.dbAPI.getDataFromTable("core_products");
				product = allProducts.find((p) => p.id == productId);
			}

			// Get VAT config from config_data
			const vatConfig = configData?.inventory_config?.config_vat;

			try {
				if (isOnline) {
					const data = {
						url: "inventory/pos/inline-update",
						data: {
							invoice_id: tableId,
							field_name: "items",
							value: {
								...product,
								quantity: -1,
							},
						},
						module: "pos",
					};
					const resultAction = await dispatch(storeEntityData(data));

					if (resultAction.payload?.status !== 200) {
						showNotificationComponent(
							resultAction.payload?.message || "Error updating invoice",
							"red",
							"",
							"",
							true
						);
					}
				} else {
					let newSubTotal = 0;
					const [invoiceTableItem, invoiceTable] = await Promise.all([
						window.dbAPI.getDataFromTable("invoice_table_item", {
							invoice_id: tableId,
							stock_item_id: product.id,
						}),
						window.dbAPI.getDataFromTable("invoice_table", tableId),
					]);

					if (invoiceTableItem?.length) {
						const currentQuantity = invoiceTableItem[0].quantity;

						if (currentQuantity <= 1) return;

						const updatedQuantity = currentQuantity - 1;
						const updatedSubTotal = calculateSubTotalWithVAT(
							product.sales_price,
							updatedQuantity,
							vatConfig
						);
						const deltaSubTotal = updatedSubTotal - invoiceTableItem[0].sub_total;

						await window.dbAPI.updateDataInTable("invoice_table_item", {
							condition: { invoice_id: tableId, stock_item_id: product.id },
							data: {
								stock_item_id: product.id,
								invoice_id: tableId,
								quantity: updatedQuantity,
								purchase_price: product.purchase_price,
								sales_price: product.sales_price,
								sub_total: updatedSubTotal,
								display_name: product.display_name,
							},
						});

						newSubTotal = deltaSubTotal;

						await window.dbAPI.updateDataInTable("invoice_table", {
							id: tableId,
							data: {
								sub_total: invoiceTable.sub_total + newSubTotal,
							},
						});
					}
				}
			} catch (error) {
				showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
				console.error("Error updating invoice:", error);
			} finally {
				setReloadInvoiceData(true);
			}
		},
		[products, tableId, dispatch, setReloadInvoiceData, isOnline]
	);

	const handleDelete = async (productId) => {
		const myCartProducts = await getCartProducts();

		if (!myCartProducts.length) return;

		if (isOnline) {
			try {
				const data = {
					url: "inventory/pos/inline-update",
					data: {
						invoice_id: tableId,
						field_name: "items",
						value: [],
					},
					module: "pos",
				};
				const resultAction = await dispatch(storeEntityData(data));

				if (resultAction.payload?.status !== 200) {
					showNotificationComponent(
						resultAction.payload?.message || "Error updating invoice",
						"red",
						"",
						"",
						true
					);
				}
			} catch (error) {
				showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
				console.error("Error updating invoice:", error);
			}
		} else {
			const [invoiceTableItem, invoiceTable] = await Promise.all([
				window.dbAPI.getDataFromTable("invoice_table_item", {
					invoice_id: tableId,
					stock_item_id: productId,
				}),
				window.dbAPI.getDataFromTable("invoice_table", tableId),
			]);

			await Promise.all([
				window.dbAPI.deleteDataFromTable("invoice_table_item", {
					invoice_id: tableId,
					stock_item_id: productId,
				}),
				window.dbAPI.updateDataInTable("invoice_table", {
					id: tableId,
					data: {
						sub_total: invoiceTable.sub_total - invoiceTableItem[0]?.sub_total,
					},
				}),
			]);
		}

		// Show notification for successful deletion
		notifications.show({
			title: t("Success"),
			message: t("Item removed from cart"),
			color: "green",
			position: "bottom-right",
			autoClose: 2000,
		});

		updateTableStatusIfNeeded(myCartProducts.length - 1);
		setLoadCartProducts(true);
		setReloadInvoiceData(true);
	};

	const handleClearCart = useCallback(() => {
		localStorage.removeItem(getStorageKey());
		if (enableTable && tableId) {
			updateTableStatus("Free");
			if (tables && setTables) {
				setTables(
					tables.map((table) =>
						table.id === tableId ? { ...table, status: "Free" } : table
					)
				);
			}
		}
		setLoadCartProducts(true);
	}, [
		getStorageKey,
		enableTable,
		tableId,
		updateTableStatus,
		tables,
		setTables,
		setLoadCartProducts,
	]);

	return {
		handleIncrement,
		handleDecrement,
		handleDelete,
		handleClearCart,
		getCartProducts,
	};
};
