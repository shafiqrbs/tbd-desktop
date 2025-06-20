import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import {
	Group,
	Box,
	Text,
	Button,
	Grid,
	ScrollArea,
	Tooltip,
	Checkbox,
	Paper,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconSum, IconReceipt } from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import classes from "./css/Invoice.module.css";
import { IconChefHat } from "@tabler/icons-react";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { SalesPrintPos } from "../print/pos/SalesPrintPos";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useCartOperations } from "./utils/CartOperations";
import SelectForm from "../../../form-builders/SelectForm";
import { storeEntityData, getIndexEntityData } from "../../../../store/core/crudSlice.js";
import AddCustomerDrawer from "../../inventory/sales/drawer-form/AddCustomerDrawer.jsx";
import _CommonDrawer from "./drawer/_CommonDrawer.jsx";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";

import { formatDateTime, generateInvoiceId } from "../../../../lib/index.js";
import ActionButtons from "./ActionButtons.jsx";
import InvoiceTable from "./InvoiceTable.jsx";

export default function Invoice({
	products,
	tableId,
	tables,
	setLoadCartProducts,
	tableCustomerMap,
	updateTableCustomer,
	clearTableCustomer,
	customerObject,
	setCustomerObject,
	loadCartProducts,
	updateTableSplitPayment,
	clearTableSplitPayment,
	tableSplitPaymentMap,
	invoiceMode,
	invoiceData,
	setTables,
	setReloadInvoiceData,
	setTableId,
	setInvoiceData,
}) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 190;
	const calculatedHeight = height - 200;

	const { configData } = getConfigData();
	const enableTable = !!(configData?.inventory_config?.is_pos && invoiceMode === "table");
	const [printPos, setPrintPos] = useState(false);
	// Sales by user state management
	const [salesByUser, setSalesByUser] = useState(String(invoiceData?.sales_by_id || ""));
	const [salesByUserName] = useState(null);
	const [salesByDropdownData, setSalesByDropdownData] = useState([]);
	const [isDisabled, setIsDisabled] = useState(false);
	const [transactionModeData, setTransactionModeData] = useState([]);

	const [returnOrDueText, setReturnOrDueText] = useState(
		invoiceData?.sub_total > invoiceData?.payment ? "Return" : "Due"
	);
	const [salesDiscountAmount, setSalesDiscountAmount] = useState(invoiceData?.discount);

	const [salesTotalAmount, setSalesTotalAmount] = useState(invoiceData?.sub_total);
	const [salesTotalWithoutDiscountAmount, setSalesTotalWithoutDiscountAmount] = useState(
		invoiceData?.sub_total - invoiceData?.discount
	);
	const [currentPaymentInput, setCurrentPaymentInput] = useState(invoiceData?.payment || "");
	const [salesDueAmount, setSalesDueAmount] = useState(
		invoiceData?.sub_total - (invoiceData?.payment + invoiceData?.discount)
	);
	// Track additional tables per selected table
	const [additionalTableSelections, setAdditionalTableSelections] = useState({});
	const [checked, setChecked] = useState(false);

	const [transactionModeId, setTransactionModeId] = useState(
		invoiceData?.transaction_mode_id || ""
	);
	const [transactionModeName, setTransactionModeName] = useState(null);
	const currentTableKey = tableId || "general";
	const currentTableSplitPayments = tableSplitPaymentMap[currentTableKey] || [];

	const isSplitPaymentActive = currentTableSplitPayments.length > 0;

	const isThisTableSplitPaymentActive = isSplitPaymentActive;

	const [posData] = useState(null);
	const [discountType, setDiscountType] = useState("Percent");
	const [defaultCustomerId, setDefaultCustomerId] = useState(null);

	const [tableReceiveAmounts, setTableReceiveAmounts] = useState({});

	const [indexData, setIndexData] = useState(null);
	const getAdditionalItem = (value) => {
		setIndexData(value);
	};
	const [customerId, setCustomerId] = useState(invoiceData?.customer_id || "");
	const [customerDrawer, setCustomerDrawer] = useState(false);
	const [customersDropdownData, setCustomersDropdownData] = useState([]);
	const [refreshCustomerDropdown, setRefreshCustomerDropdown] = useState(false);

	const [commonDrawer, setCommonDrawer] = useState(false);
	const [eventName, setEventName] = useState(null);

	const { handleIncrement, handleDecrement, handleDelete } = useCartOperations({
		enableTable,
		tableId,
		products,
		setLoadCartProducts,
		setReloadInvoiceData,
	});

	const form = useForm({
		initialValues: {
			customer_id: "",
			transaction_mode_id: "",
			sales_by_id: "",
			receive_amount: "",
			discount: "",
			coupon_code: "",
		},
		validate: {
			transaction_mode_id: (value) => {
				if (isSplitPaymentActive) return null;
				return !value ? true : null;
			},
			sales_by_id: (value) => (!value ? true : null),
			customer_id: () => {
				return !customerId ? true : null;
			},
		},
	});

	useEffect(() => {
		if (enableTable && tableId && tableCustomerMap && tableCustomerMap[tableId]) {
			const tableCustomer = tableCustomerMap[tableId];
			setCustomerId(tableCustomer.id);
			setCustomerObject(tableCustomer);
		} else if (enableTable && tableId) {
			setCustomerId(null);
			setCustomerObject({});
		}
	}, [tableId, enableTable, tableCustomerMap]);

	useEffect(() => {
		async function fetchData() {
			let coreUsers = await window.dbAPI.getDataFromTable("core_users");
			if (coreUsers && coreUsers.length > 0) {
				const transformedData = coreUsers.map((type) => {
					return {
						label: type.username + " - " + type.email,
						value: String(type.id),
					};
				});
				setSalesByDropdownData(transformedData);
			}
		}
		async function fetchTransactionData() {
			const data = await window.dbAPI.getDataFromTable("accounting_transaction_mode");
			setTransactionModeData(data);
		}
		fetchTransactionData();
		fetchData();
	}, []);

	useEffect(() => {
		if (transactionModeData?.length > 0) {
			// =============== select first transaction mode by default if none selected ================
			const defaultMode = transactionModeData[0];
			if (!transactionModeId) {
				handleTransactionModel(defaultMode.id, defaultMode.name);
			}
		}
	}, [transactionModeData]);

	useEffect(() => {
		if (tableId && !additionalTableSelections[tableId]) {
			setAdditionalTableSelections((prev) => ({
				...prev,
				[tableId]: new Set(),
			}));
		}
	}, [tableId]);

	useEffect(() => {
		if (isSplitPaymentActive) {
			setSalesDueAmount(0);
			setReturnOrDueText("Due");
		} else if (form.values.split_amount) {
			let subtotal = 0;
			const totalAmount = subtotal - salesDiscountAmount;
			let receiveAmount = 0;
			for (let key in form.values.split_amount) {
				receiveAmount += Number(form.values.split_amount[key].partial_amount);
			}
			if (receiveAmount >= 0) {
				const text = totalAmount < receiveAmount ? "Return" : "Due";
				setReturnOrDueText(text);
				const returnOrDueAmount = totalAmount - receiveAmount;
				setSalesDueAmount(returnOrDueAmount);
			} else {
				setSalesDueAmount(totalAmount);
			}
		}
	}, [form.values.split_amount, isSplitPaymentActive, customerId]);

	useEffect(() => {
		const fetchCustomers = async () => {
			let coreCustomers = await window.dbAPI.getDataFromTable("core_customers");
			let defaultId = defaultCustomerId;
			if (coreCustomers && coreCustomers.length > 0) {
				const transformedData = coreCustomers.map((type) => {
					if (type.name === "Default") {
						defaultId = type.id;
					}
					return {
						label: type.mobile + " -- " + type.name,
						value: String(type.id),
					};
				});

				setCustomersDropdownData(transformedData);
				setDefaultCustomerId(defaultId);
			}
			setRefreshCustomerDropdown(false);
		};

		fetchCustomers();
	}, [refreshCustomerDropdown]);

	useEffect(() => {
		if (
			enableTable &&
			tableId &&
			customerId &&
			customerObject &&
			Object.keys(customerObject).length > 0
		) {
			updateTableCustomer(tableId, customerId, customerObject);
			// Update invoiceData with the new customer ID
			setInvoiceData((prev) => ({
				...prev,
				customer_id: customerId,
			}));
		}
	}, [customerId, customerObject, tableId, enableTable, updateTableCustomer]);

	useEffect(() => {
		const currentAmount = tableReceiveAmounts[currentTableKey] || "";
		form.setFieldValue("receive_amount", currentAmount);
	}, [currentTableKey, tableReceiveAmounts]);

	useEffect(() => {
		setCurrentPaymentInput(invoiceData?.payment || "");
	}, [tableId]);

	useEffect(() => {
		if (invoiceData) {
			setDiscountType(invoiceData.discount_type || "Percent");
			setSalesTotalAmount(invoiceData.sub_total || 0);
			setSalesTotalWithoutDiscountAmount(
				(invoiceData.sub_total || 0) - (invoiceData.discount || 0)
			);

			setSalesDueAmount(
				(invoiceData.sub_total || 0) -
					((Number(currentPaymentInput) || 0) + (invoiceData.discount || 0))
			);
			setReturnOrDueText(
				(invoiceData.sub_total || 0) > (Number(currentPaymentInput) || 0) ? "Due" : "Return"
			);

			setTransactionModeId(invoiceData?.transaction_mode_id || "");
			if (invoiceData.discount_type === "Flat") {
				setSalesDiscountAmount(invoiceData?.discount || 0);
			} else if (invoiceData.discount_type === "Percent") {
				setSalesDiscountAmount(invoiceData?.percentage);
			}
		}
	}, [invoiceData, discountType, isSplitPaymentActive]);

	const handleAdditionalTableCheck = (checkedTableId) => {
		if (!tableId) return;

		setAdditionalTableSelections((prev) => {
			const currentSelections = new Set(prev[tableId] || []);

			if (currentSelections.has(checkedTableId)) {
				currentSelections.delete(checkedTableId);
			} else {
				currentSelections.add(checkedTableId);
			}

			return {
				...prev,
				[tableId]: currentSelections,
			};
		});
	};

	const getSplitPayment = (splitPayments) => {
		updateTableSplitPayment(currentTableKey, splitPayments);

		// =============== calculate total paid amount from split payments ================
		const totalPaidAmount = splitPayments.reduce(
			(sum, payment) => sum + Number(payment.partial_amount),
			0
		);

		// =============== update due amount and return text ================
		const newDueAmount = salesTotalAmount - (totalPaidAmount + salesDiscountAmount);
		setSalesDueAmount(newDueAmount);
		setReturnOrDueText(newDueAmount < 0 ? "Return" : "Due");

		// =============== update current payment input ================
		setCurrentPaymentInput(totalPaidAmount.toString());
		setTableReceiveAmounts((prev) => ({
			...prev,
			[currentTableKey]: totalPaidAmount.toString(),
		}));

		// =============== update form value ================
		form.setFieldValue("receive_amount", totalPaidAmount.toString());

		// =============== update invoice data ================
		setInvoiceData((prev) => ({
			...prev,
			payment: totalPaidAmount,
			due_amount: newDueAmount,
		}));

		// =============== update database if offline ================
		if (!isOnline) {
			window.dbAPI.updateDataInTable("invoice_table", {
				id: tableId,
				data: {
					payment: totalPaidAmount,
				},
			});
		}
	};

	const handleCustomerAdd = () => {
		if (enableTable && tableId) {
			form.setErrors({ ...form.errors, customer_id: null });
			setCustomerDrawer(true);
		} else if (!enableTable) {
			setCustomerDrawer(true);
		} else {
			notifications.show({
				color: "red",
				title: t("Error"),
				message: t("SelectATableFirst"),
				autoClose: 2000,
			});
		}
	};

	const updateTableStatus = async (newStatus) => {
		if (!tableId) return;

		setTables((prevTables) =>
			prevTables.map((table) =>
				table.id === tableId ? { ...table, status: newStatus } : table
			)
		);
	};

	const handleSave = async ({ withPos = false }) => {
		// Validation checks
		if (!invoiceData.invoice_items?.length) {
			showNotificationComponent(t("NoProductAdded"), "red", "", "", true, 1000, true);
			return;
		}

		if (!salesByUser || salesByUser === "undefined") {
			showNotificationComponent(t("ChooseUser"), "red", "", "", true, 1000, true);
			return;
		}

		if (!invoiceData.transaction_mode_id && !isSplitPaymentActive) {
			showNotificationComponent(t("ChooseTransactionMode"), "red", "", "", true, 1000, true);
			return;
		}

		if (!invoiceData.payment && !isSplitPaymentActive) {
			showNotificationComponent(t("PaymentAmount"), "red", "", "", true, 1000, true);
			return;
		}

		setIsDisabled(true);

		try {
			const fullAmount = invoiceData.payment;

			if (isOnline) {
				await handleOnlineSave(fullAmount);
			} else {
				await handleOfflineSave(fullAmount);
			}

			resetSaleState();
			showNotificationComponent(t("SalesComplete"), "blue", "", "", true, 1000, true);
			if (withPos) {
				const setup = await window.dbAPI.getDataFromTable("printer");
				if (!setup?.printer_name) {
					return notifications.show({
						title: "Printer not found",
						message: "Please setup printer first",
						color: "red",
					});
				}
				const status = await window.deviceAPI.thermalPrint({
					configData,
					salesItems: invoiceData.invoice_items,
					salesViewData: invoiceData,
					setup,
				});

				if (!status?.success) {
					notifications.show({
						color: "red",
						title: "Printing Failed",
						message: status.message,
						icon: <IconReceipt />,
						style: { backgroundColor: "#f1f1f1" },
					});
				}
			}
		} catch (err) {
			console.error("Error saving sale:", err);
		} finally {
			setIsDisabled(false);
		}
	};

	const handleOnlineSave = async (fullAmount) => {
		if (isSplitPaymentActive) {
			await dispatch(
				storeEntityData({
					url: "inventory/pos/inline-update",
					data: {
						invoice_id: tableId,
						field_name: "amount",
						value: fullAmount,
					},
					module: "pos",
				})
			);
		}

		const resultAction = await dispatch(
			getIndexEntityData({
				url: "inventory/pos/sales-complete/" + invoiceData.id,
				params: {},
				module: "sales",
			})
		);

		if (!getIndexEntityData.fulfilled.match(resultAction)) {
			throw new Error("Failed to complete online sale");
		}
	};

	const handleOfflineSave = async (fullAmount) => {
		const customerInfo = customersDropdownData.find((d) => d.value == invoiceData.customer_id);
		const invoiceId = generateInvoiceId();

		const userItem = await window.dbAPI.getDataFromTable("users");

		// Insert sale record
		await window.dbAPI.upsertIntoTable("sales", {
			invoice: invoiceId,
			sub_total: invoiceData.sub_total,
			total: invoiceData.total ?? invoiceData.sub_total,
			approved_by_id: invoiceData.created_by_id,
			payment: fullAmount,
			discount: null,
			discount_calculation: null,
			discount_type: invoiceData.discount_type,
			customerId: invoiceData.customer_id,
			customerName: customerInfo?.label?.split(" -- ")[1] || userItem?.name,
			customerMobile: customerInfo?.label?.split(" -- ")[0] || userItem?.mobile,
			createdByUser: "sandra",
			createdById: invoiceData.created_by_id,
			salesById: invoiceData.sales_by_id,
			salesByUser: "sandra",
			salesByName: null,
			process: "approved",
			mode_name: transactionModeName,
			created: formatDateTime(new Date()),
			sales_items: JSON.stringify(invoiceData.invoice_items),
			multi_transaction: isSplitPaymentActive ? 1 : 0,
		});

		// Handle transactions
		if (isSplitPaymentActive) {
			const splitPayments = tableSplitPaymentMap[tableId || "general"] || [];
			for (const payment of splitPayments) {
				await window.dbAPI.upsertIntoTable("sales_transactions", {
					transaction_mode_id: payment.transaction_mode_id,
					invoice_id: invoiceId,
					amount: payment.partial_amount,
					remarks: payment.remarks || "",
				});
			}
		} else {
			await window.dbAPI.upsertIntoTable("sales_transactions", {
				transaction_mode_id: transactionModeId,
				invoice_id: invoiceId,
				amount: fullAmount,
				remarks: "",
			});
		}

		// Clear invoice table
		await window.dbAPI.updateDataInTable("invoice_table", {
			id: tableId,
			data: {
				sales_by_id: null,
				transaction_mode_id: null,
				customer_id: null,
				is_active: 0,
				sub_total: null,
				payment: null,
			},
		});

		// Delete invoice items
		for (const item of invoiceData.invoice_items) {
			await window.dbAPI.deleteDataFromTable("invoice_table_item", item.id);
		}
	};

	const resetSaleState = () => {
		clearTableCustomer(tableId);
		setSalesByUser(null);
		setCustomerId(null);
		setTransactionModeId(null);
		setCurrentPaymentInput("");
		setSalesDiscountAmount(0);
		setSalesTotalAmount(0);
		setSalesTotalWithoutDiscountAmount(0);
		setSalesDueAmount(0);
		setReturnOrDueText("Due");
		setDiscountType("Percent");
		setCustomerObject({});
		updateTableStatus("Free");
		setReloadInvoiceData(true);
		setTableId(null);
		setIndexData(null);
		setInvoiceData(null);
		form.reset();
		clearTableSplitPayment(currentTableKey);
	};

	const handleTransactionModel = async (id, name) => {
		setTransactionModeId(id);
		setTransactionModeName(name);
		form.setFieldValue("transaction_mode_id", id);

		const data = {
			url: "inventory/pos/inline-update",
			data: {
				invoice_id: tableId,
				field_name: "transaction_mode_id",
				value: id,
			},
			module: "pos",
		};

		// Dispatch and handle response
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
				await window.dbAPI.updateDataInTable("invoice_table", {
					id: tableId,
					data: {
						transaction_mode_id: id,
					},
				});
			}
		} catch (error) {
			showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
			console.error("Error updating invoice:", error);
		} finally {
			setReloadInvoiceData(true);
		}
	};

	const clearSplitPayment = () => {
		if (currentTableKey) {
			clearTableSplitPayment(currentTableKey);

			form.setFieldValue("receive_amount", tableReceiveAmounts[currentTableKey] || "");

			notifications.show({
				color: "green",
				title: t("Success"),
				message: t("SplitPaymentCleared"),
				autoClose: 2000,
			});
		}
	};

	const handleClick = (e) => {
		if (e.currentTarget.name === "additionalProductAdd") {
			if (!tableId) {
				notifications.show({
					color: "red",
					title: t("Error"),
					message: t("SelectATableFirst"),
					autoClose: 2000,
				});
				return;
			}
			setEventName(e.currentTarget.name);
			// TODO: Remove this after testing
			// setCommonDrawer(true);
		} else if (e.currentTarget.name === "splitPayment") {
			form.setErrors({ ...form.errors, transaction_mode_id: null });
			setEventName(e.currentTarget.name);
			setCommonDrawer(true);
		} else if (e.currentTarget.name === "clearSplitPayment") {
			clearSplitPayment();
		} else if (e.currentTarget.name === "kitchen") {
			setEventName(e.currentTarget.name);
			setCommonDrawer(true);
		}
	};

	return (
		<ScrollArea h={enableTable ? height + 160 : height + 50}>
			<Box
				w="100%"
				pl={10}
				pr={10}
				className={classes["box-white"]}
				style={{ display: "flex", flexDirection: "column" }}
			>
				<Group
					gap={6}
					mb={4}
					preventGrowOverflow={false}
					grow
					align="flex-start"
					wrap="nowrap"
				>
					<SelectForm
						pt="8"
						label=""
						tooltip="SalesBy"
						placeholder={enableTable ? t("OrderTakenBy") : t("SalesBy")}
						name="sales_by_id"
						form={form}
						dropdownValue={salesByDropdownData}
						id="sales_by_id"
						searchable={true}
						value={salesByUser}
						changeValue={setSalesByUser}
						color="orange.8"
						position="top-start"
						inlineUpdate={true}
						updateDetails={{
							url: "inventory/pos/inline-update",
							data: {
								invoice_id: tableId,
								field_name: "sales_by_id",
								value: salesByUser,
							},
							module: "pos",
						}}
					/>
					{enableTable && (
						<Tooltip
							disabled={!(invoiceData?.invoice_items?.length === 0 || !salesByUser)}
							color="red.6"
							withArrow
							px={16}
							py={2}
							offset={2}
							zIndex={999}
							position="top-end"
							label={t("SelectProductandUser")}
						>
							<Button
								disabled={invoiceData?.invoice_items?.length === 0 || !salesByUser}
								radius="sm"
								size="sm"
								color="green"
								name="kitchen"
								mt={8}
								miw={122}
								maw={122}
								leftSection={<IconChefHat height={14} width={14} stroke={2} />}
								onClick={handleClick}
							>
								<Text fw={600} size="sm">
									{t("Kitchen")}
								</Text>
							</Button>
						</Tooltip>
					)}
				</Group>
				<Box>
					<Paper h={32} p="4" radius="4" bg={checked ? "green.8" : "green.0"}>
						<Grid align="center">
							<Grid.Col span={11} mt={1}>
								<Text fz={"sm"} fw={500} c={checked ? "white" : "black"} pl={4}>
									{enableTable ? t("SelectAdditionalTable") : t("SelectedItems")}
								</Text>
							</Grid.Col>
							<Grid.Col span={1}>
								{enableTable && (
									<Tooltip
										color="red.6"
										disabled={tableId}
										withArrow
										px={16}
										py={2}
										offset={2}
										zIndex={999}
										position="top-end"
										label={t("SelectaTabletoChooseAdditional")}
									>
										<Checkbox
											disabled={!tableId}
											checked={checked}
											color="green.9"
											iconColor="dark.8"
											onChange={(event) =>
												setChecked(event.currentTarget.checked)
											}
											styles={() => ({
												input: {
													borderColor: "green",
												},
												inputFocus: {
													borderColor: "black",
												},
											})}
										/>
									</Tooltip>
								)}
							</Grid.Col>
						</Grid>
					</Paper>

					{checked && (
						<ScrollArea
							h={{ base: "auto", sm: enableTable ? 50 : "auto" }}
							type="never"
							bg={"green.0"}
						>
							<Paper p="md" radius="md" bg={"green.0"}>
								<Grid columns={15} gutter="md">
									{tables.map((item) => (
										<Grid.Col span={3} key={item.id}>
											<Checkbox
												label={`Table ${item.id}`}
												color="green.8"
												checked={additionalTableSelections[tableId]?.has(
													item.id
												)}
												onChange={() => handleAdditionalTableCheck(item.id)}
												disabled={item.id === tableId}
												styles={() => ({
													input: {
														border: "1.5px solid #767676",
													},
													label: {
														color: "#333333",
													},
												})}
											/>
										</Grid.Col>
									))}
								</Grid>
							</Paper>
						</ScrollArea>
					)}
					{/* ===================== invoice table ===================== */}
					<InvoiceTable
						invoiceData={invoiceData}
						indexData={indexData}
						handleClick={handleClick}
						handleDecrement={handleDecrement}
						handleIncrement={handleIncrement}
						handleDelete={handleDelete}
						enableTable={enableTable}
						checked={checked}
						calculatedHeight={calculatedHeight}
					/>
					{/* ===================== table footer ===================== */}
					<Group
						h={34}
						justify="space-between"
						align="center"
						pt={0}
						bg={"gray.4"}
						style={{
							borderTop: "2px solid var(--mantine-color-gray-4)",
						}}
					>
						<Text fw={"bold"} fz={"sm"} c={"black"} pl={"10"}>
							{t("SubTotal")}
						</Text>
						<Group gap="10" pr={"sm"} align="center">
							<IconSum size="16" style={{ color: "black" }} />
							<Text fw={"bold"} fz={"sm"} c={"black"}>
								{configData?.currency?.symbol}{" "}
								{salesTotalAmount && salesTotalAmount
									? salesTotalAmount.toFixed(2)
									: 0}
							</Text>
						</Group>
					</Group>
				</Box>
				<Box pr={4} pb={4} pt={2} mt={6}>
					<ActionButtons
						form={form}
						tableId={tableId}
						transactionModeData={transactionModeData}
						transactionModeId={transactionModeId}
						handleTransactionModel={handleTransactionModel}
						invoiceData={invoiceData}
						discountType={discountType}
						setDiscountType={setDiscountType}
						enableTable={enableTable}
						handleClick={handleClick}
						salesTotalAmount={salesTotalAmount}
						salesTotalWithoutDiscountAmount={salesTotalWithoutDiscountAmount}
						salesDueAmount={salesDueAmount}
						setSalesDueAmount={setSalesDueAmount}
						returnOrDueText={returnOrDueText}
						setReturnOrDueText={setReturnOrDueText}
						salesDiscountAmount={salesDiscountAmount}
						setSalesDiscountAmount={setSalesDiscountAmount}
						setReloadInvoiceData={setReloadInvoiceData}
						setInvoiceData={setInvoiceData}
						currentTableKey={currentTableKey}
						isThisTableSplitPaymentActive={isThisTableSplitPaymentActive}
						clearTableSplitPayment={clearTableSplitPayment}
						isSplitPaymentActive={isSplitPaymentActive}
						currentPaymentInput={currentPaymentInput}
						setCurrentPaymentInput={setCurrentPaymentInput}
						setTableReceiveAmounts={setTableReceiveAmounts}
						customerObject={customerObject}
						handleCustomerAdd={handleCustomerAdd}
						isDisabled={isDisabled}
						handleSave={handleSave}
					/>

					{printPos && (
						<div style={{ display: "none" }}>
							<SalesPrintPos posData={posData} setPrintPos={setPrintPos} />
						</div>
					)}
					{customerDrawer && (
						<AddCustomerDrawer
							customerObject={customerObject}
							setCustomerObject={setCustomerObject}
							setCustomerId={setCustomerId}
							customersDropdownData={customersDropdownData}
							setRefreshCustomerDropdown={setRefreshCustomerDropdown}
							focusField={"customer_id"}
							fieldPrefix="pos_"
							customerDrawer={customerDrawer}
							setCustomerDrawer={setCustomerDrawer}
							customerId={customerId}
							enableTable={enableTable}
							tableId={tableId}
							updateTableCustomer={updateTableCustomer}
							clearTableCustomer={clearTableCustomer}
							setReloadInvoiceData={setReloadInvoiceData}
						/>
					)}
					{/* split amount, customer add, kitchen print, additional items etc */}
					{commonDrawer && (
						<_CommonDrawer
							salesByUserName={salesByUserName}
							setLoadCartProducts={setLoadCartProducts}
							enableTable={enableTable}
							tableId={tableId}
							loadCartProducts={loadCartProducts}
							getSplitPayment={getSplitPayment}
							getAdditionalItem={getAdditionalItem}
							salesDueAmount={salesDueAmount}
							eventName={eventName}
							commonDrawer={commonDrawer}
							setCommonDrawer={setCommonDrawer}
							currentSplitPayments={currentTableSplitPayments}
							tableSplitPaymentMap={tableSplitPaymentMap}
							invoiceData={invoiceData}
						/>
					)}
				</Box>
			</Box>
		</ScrollArea>
	);
}
