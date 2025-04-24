import { useCallback } from "react";
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";
import { storeEntityData } from "../../../../../store/core/crudSlice";
import { useDispatch } from "react-redux";
import { showNotificationComponent } from "../../../../core-component/showNotificationComponent";
import { useOutletContext } from "react-router";


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
	const getStorageKey = useCallback(() => {
		return enableTable && tableId ? `table-${tableId}-pos-products` : "temp-pos-products";
	}, [enableTable, tableId]);

	const getCartProducts = useCallback(() => {
		const cartProducts = localStorage.getItem(getStorageKey());
		return cartProducts ? JSON.parse(cartProducts) : [];
	}, [getStorageKey]);

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
			let product = products?.find((p) => p.id === productId);
			if (!products) {
				const allProducts = await window.dbAPI.getDataFromTable("core_products");
				product = allProducts.find((p) => p.id === productId);
			}
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
						window.dbAPI.getDataFromTable(
							"invoice_table_item",
							product.id,
							"stock_item_id"
						),
						window.dbAPI.getDataFromTable("invoice_table", tableId),
					]);
					if (invoiceTableItem) {
						const updatedQuantity = invoiceTableItem.quantity + 1;
						const updatedSubTotal = updatedQuantity * product.sales_price;
						const deltaSubTotal = updatedSubTotal - invoiceTableItem.sub_total;

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
						await window.dbAPI.upsertIntoTable("invoice_table_item", {
							stock_item_id: product.id,
							invoice_id: tableId,
							quantity: 1,
							purchase_price: 0,
							sales_price: product.sales_price,
							custom_price: 0,
							is_print: 0,
							sub_total: product.sales_price,
							display_name: product.display_name,
						});
						newSubTotal = product.sales_price;
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
		(productId) => {
			const myCartProducts = getCartProducts();

			const updatedProducts = myCartProducts
				.map((item) => {
					if (item.product_id === productId) {
						const newQuantity = Math.max(0, item.quantity - 1);
						return {
							...item,
							quantity: newQuantity,
							sub_total: newQuantity * item.sales_price,
						};
					}
					return item;
				})
				.filter((item) => item.quantity > 0);

			updateTableStatusIfNeeded(updatedProducts.length);
			localStorage.setItem(getStorageKey(), JSON.stringify(updatedProducts));
			setLoadCartProducts(true);
		},
		[getStorageKey, getCartProducts, updateTableStatusIfNeeded, setLoadCartProducts]
	);

	const handleDelete = useCallback(
		async (productId) => {
			const myCartProducts = getCartProducts();

			const updatedProducts = myCartProducts.filter((item) => item.product_id !== productId);

			// Show notification for successful deletion
			notifications.show({
				title: t("Success"),
				message: t("Item removed from cart"),
				color: "green",
				position: "bottom-right",
				autoClose: 2000,
			});

			updateTableStatusIfNeeded(updatedProducts.length);
			localStorage.setItem(getStorageKey(), JSON.stringify(updatedProducts));
			setLoadCartProducts(true);
		},
		[getCartProducts, getStorageKey, updateTableStatusIfNeeded, setLoadCartProducts, isOnline]
	);

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
