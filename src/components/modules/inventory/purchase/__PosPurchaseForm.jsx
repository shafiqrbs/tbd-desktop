import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import __PosVendorSection from "./__PosVendorSection";
import { Box, Text, ActionIcon, Group, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconSum, IconX } from "@tabler/icons-react";
import { useOutletContext } from "react-router";
import __PosPurchaseInvoiceSection from "./__PosPurchaseInvoiceSection.jsx";
import { getHotkeyHandler, useToggle } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import { formatDate, generateInvoiceId } from "../../../../lib/index.js";

export default function PosPurchaseForm(props) {
	const { isSMSActive, currencySymbol, tempCardProducts, setLoadCardProducts, isWarehouse } =
		props;

	//common hooks
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight, user } = useOutletContext();
	const height = mainAreaHeight - 170;
	const [fetching] = useState(false);
	const dispatch = useDispatch();
	const [defaultCustomerId, setDefaultCustomerId] = useState(null);
	const [customersDropdownData, setCustomersDropdownData] = useState([]);

	// setting defualt customer
	useEffect(() => {
		const fetchCustomers = async () => {
			const coreCustomers = await window.dbAPI.getDataFromTable("core-customers");
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
		};

		fetchCustomers();
	}, []);

	// form
	const form = useForm({
		initialValues: {
			vendor_id: "",
			transaction_mode_id: "",
			order_process: "",
			narration: "",
			discount: "",
			receive_amount: "",
			name: "",
			mobile: "",
			email: "",
			warehouse_id: "",
		},
	});

	//calculate subTotal amount
	let purchaseSubTotalAmount =
		tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

	//customer dropdown data
	const [vendorsDropdownData, setVendorsDropdownData] = useState([]);

	//customer hook
	const [vendorData, setVendorData] = useState(null);

	// setting default customer
	useEffect(() => {
		const fetchVendors = async () => {
			const coreVendors = await window.dbAPI.getDataFromTable("core_vendors");

			if (coreVendors && coreVendors.length > 0) {
				const transformedData = coreVendors.map((type) => {
					return {
						label: type.mobile + " -- " + type.name,
						value: String(type.id),
					};
				});
				setVendorsDropdownData(transformedData);
			}
		};
		fetchVendors();
	}, []);

	//default customer hook
	const [defaultVendorId, setDefaultVendorId] = useState(null);

	//Customer object hook
	const [vendorObject, setVendorObject] = useState({});

	//sales discount amount hook
	const [purchaseDiscountAmount, setPurchaseDiscountAmount] = useState(0);

	//order process hook
	const [orderProcess, setOrderProcess] = useState(null);

	//vat amount hook
	const [purchaseVatAmount] = useState(0);

	//sales total amount hook
	const [purchaseTotalAmount, setPurchaseTotalAmount] = useState(0);

	// sales due amount hook
	const [purchaseDueAmount, setPurchaseDueAmount] = useState(0);

	//return or due text hook
	const [returnOrDueText, setReturnOrDueText] = useState("Due");

	//discount type hook
	const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);

	// calculate sales total amount after discount and vat change
	useEffect(() => {
		let discountAmount = 0;
		if (form.values.discount && Number(form.values.discount) > 0) {
			if (discountType === "Flat") {
				discountAmount = Number(form.values.discount);
			} else if (discountType === "Percent") {
				discountAmount = (purchaseSubTotalAmount * Number(form.values.discount)) / 100;
			}
		}
		setPurchaseDiscountAmount(discountAmount);

		// Calculate total amount after discount and VAT
		const newTotalAmount =
			purchaseSubTotalAmount - Number(discountAmount) + Number(purchaseVatAmount);
		setPurchaseTotalAmount(newTotalAmount);

		let returnOrDueAmount = 0;
		let receiveAmount =
			form.values.receive_amount == "" ? 0 : Number(form.values.receive_amount);
		if (receiveAmount >= 0) {
			const text = newTotalAmount < receiveAmount ? "Return" : "Due";
			setReturnOrDueText(text);
			returnOrDueAmount = newTotalAmount - receiveAmount;
			setPurchaseDueAmount(returnOrDueAmount);
		}
	}, [
		form.values.discount,
		discountType,
		form.values.receive_amount,
		purchaseSubTotalAmount,
		purchaseVatAmount,
	]);

	const handleSubmit = async () => {
		const items = await window.dbAPI.getDataFromTable("temp_purchase_products");
		const createdBy = await window.dbAPI.getDataFromTable("users");
		let transformedArray = items.map((product) => {
			return {
				product_id: product.product_id,
				warehouse_id: product.warehouse_id,
				quantity: product.quantity,
				purchase_price: product.purchase_price,
				sales_price: product.sales_price,
				bonus_quantity: product.bonus_quantity,
				sub_total: product.sub_total,
			};
		});

		const options = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		};
		const formValue = {};
		formValue["vendor_id"] = form.values.vendor_id ? form.values.vendor_id : defaultVendorId;

		// Include manual customer input fields if no customer is selected
		if (!form.values.vendor_id || form.values.vendor_id == defaultVendorId) {
			formValue["vendor_name"] = form.values.name;
			formValue["vendor_mobile"] = form.values.mobile;
			formValue["vendor_email"] = form.values.email;
		}

		formValue["customer_id"] = form.values.customer_id
			? form.values.customer_id
			: defaultCustomerId;

		// Include manual customer input fields if no customer is selected
		if (!form.values.customer_id || form.values.customer_id == defaultCustomerId) {
			formValue["customer_name"] = form.values.name;
			formValue["customer_mobile"] = form.values.mobile;
			formValue["customer_email"] = form.values.email;
		}

		formValue["vendor_id"] = form.values.vendor_id;
		formValue["sub_total"] = purchaseSubTotalAmount;
		formValue["transaction_mode_id"] = form.values.transaction_mode_id;
		formValue["discount_type"] = discountType;
		formValue["discount"] = purchaseDiscountAmount;
		formValue["discount_calculation"] = discountType === "Percent" ? form.values.discount : 0;
		formValue["vat"] = 0;
		formValue["total"] = purchaseTotalAmount;
		formValue["payment"] = form.values.receive_amount;
		formValue["created_by_id"] = Number(createdBy["id"]);
		formValue["process"] = form.values.order_process;
		formValue["narration"] = form.values.narration;
		formValue["invoice_date"] =
			form.values.invoice_date &&
			new Date(form.values.invoice_date).toLocaleDateString("en-CA", options);
		formValue["items"] = transformedArray ? transformedArray : [];

		const data = {
			url: "inventory/purchase",
			data: formValue,
			module: "purchase",
		};

		if (!form.values.transaction_mode_id) {
			form.setFieldError("transaction_mode_id", t("Please select a payment method"));

			notifications.show({
				color: "red",
				title: t("Payment Required"),
				message: t("Please select a payment method"),
				loading: false,
				autoClose: 1500,
			});

			return;
		}

		if (isOnline) {
			dispatch(storeEntityData(data));
		} else {
			const paymentModes = await window.dbAPI.getDataFromTable(
				"accounting_transaction_mode",
				formValue.transaction_mode_id
			);

			const purchaseData = {
				...formValue,
				created: formatDate(new Date()),
				invoice: generateInvoiceId(),
				customerId: formValue.customer_id,
				customerName: formValue.customer_name,
				customerMobile: formValue.customer_mobile,
				createdById: formValue.created_by_id,
				salesById: formValue.sales_by_id,
				items: undefined,
				mode_name: paymentModes.name,
				purchase_items: JSON.stringify(items),
				createdByUser: user?.username,
				createdByName: user?.name,
			};

			await window.dbAPI.upsertIntoTable("purchase", purchaseData);
		}

		notifications.show({
			color: "teal",
			title: t("CreateSuccessfully"),
			icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
			loading: false,
			autoClose: 700,
			style: { backgroundColor: "lightgray" },
		});

		setTimeout(() => {
			window.dbAPI.destroyTableData("temp_purchase_products");
			form.reset();
			setVendorData(null);
			setOrderProcess(null);
			setLoadCardProducts(true);
			setVendorObject(null);
		}, 700);
	};

	return (
		<>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
					<__PosVendorSection
						form={form}
						isSMSActive={isSMSActive}
						currencySymbol={currencySymbol}
						vendorObject={vendorObject}
						setVendorObject={setVendorObject}
						vendorData={vendorData}
						setVendorData={setVendorData}
						vendorsDropdownData={vendorsDropdownData}
						setVendorsDropdownData={setVendorsDropdownData}
						defaultVendorId={defaultVendorId}
						setDefaultVendorId={setDefaultVendorId}
					/>
					<Box className={"borderRadiusAll"}>
						<DataTable
							classNames={{
								root: tableCss.root,
								table: tableCss.table,
								header: tableCss.header,
								footer: tableCss.footer,
								pagination: tableCss.pagination,
							}}
							records={tempCardProducts}
							columns={[
								{
									accessor: "index",
									title: t("S/N"),
									textAlign: "right",
									render: (item) => tempCardProducts.indexOf(item) + 1,
								},
								{
									accessor: "display_name",
									title: t("Name"),
									width: isWarehouse ? "30%" : "50%",
								},
								{
									accessor: "warehouse_name",
									title: t("Warehouse"),
									width: "20%",
									hidden: !isWarehouse,
								},
								{
									accessor: "bonus_quantity",
									title: t("BonusQuantityTable"),
								},
								{
									accessor: "quantity",
									title: t("Quantity"),
									width: "10%",
									render: (item) => {
										const handleQuantityChange = async (e) => {
											const editedQuantity = e.currentTarget.value;

											// =============== validate input value ================
											if (!editedQuantity || editedQuantity < 0) {
												return;
											}

											console.log(editedQuantity);

											await window.dbAPI.updateDataInTable(
												"temp_purchase_products",
												{
													id: item.product_id,
													property: "product_id",
													data: {
														quantity: editedQuantity,
														sub_total:
															editedQuantity * item.purchase_price,
													},
												}
											);

											setLoadCardProducts(true);
										};

										return (
											<>
												<TextInput
													type="number"
													label=""
													size="xs"
													defaultValue={item.quantity}
													onChange={handleQuantityChange}
													onKeyDown={getHotkeyHandler([
														[
															"Enter",
															() => {
																document
																	.getElementById(
																		"inline-update-quantity-" +
																			item.product_id
																	)
																	.focus();
															},
														],
													])}
												/>
											</>
										);
									},
								},
								{
									accessor: "unit_name",
									title: t("UOM"),
									width: "10%",
									textAlign: "center",
								},
								{
									accessor: "purchase_price",
									title: t("Price"),
									width: "10%",
									render: (item) => {
										const handlePurchasePriceChange = async (e) => {
											const newSalesPrice = e.currentTarget.value;
											await window.dbAPI.updateDataInTable(
												"temp_purchase_products",
												{
													id: item.product_id,
													property: "product_id",
													data: {
														purchase_price: newSalesPrice,
														sub_total: newSalesPrice * item.quantity,
													},
												}
											);
											setLoadCardProducts(true);
										};

										return (
											<>
												<TextInput
													type="number"
													label=""
													size="xs"
													id={"inline-update-quantity-" + item.product_id}
													defaultValue={item.purchase_price}
													onChange={handlePurchasePriceChange}
												/>
											</>
										);
									},
								},

								{
									accessor: "sub_total",
									title: t("SubTotal"),
									width: "15%",
									textAlign: "right",
									render: (item) => {
										return item.sub_total && Number(item.sub_total).toFixed(2);
									},
									footer: (
										<Group spacing="xs">
											<Group spacing="xs">
												<IconSum size="1.25em" />
											</Group>
											<Text fw={"600"} fz={"md"}>
												{purchaseSubTotalAmount.toFixed(2)}
											</Text>
										</Group>
									),
								},
								{
									accessor: "action",
									title: t("Action"),
									textAlign: "right",
									render: (item) => (
										<Group gap={4} justify="right" wrap="nowrap">
											<ActionIcon
												size="sm"
												variant="outline"
												radius="xl"
												color="red"
												onClick={async () => {
													await window.dbAPI.deleteDataFromTable(
														"temp_purchase_products",
														item.product_id,
														"product_id"
													);
													setLoadCardProducts(true);
												}}
											>
												<IconX
													size={16}
													style={{ width: "70%", height: "70%" }}
													stroke={1.5}
												/>
											</ActionIcon>
										</Group>
									),
								},
							]}
							fetching={fetching}
							totalRecords={100}
							recordsPerPage={10}
							loaderSize="xs"
							loaderColor="grape"
							height={height - 264}
							scrollAreaProps={{ type: "never" }}
						/>
					</Box>
				</Box>
				<Box>
					<__PosPurchaseInvoiceSection
						setVendorsDropdownData={setVendorsDropdownData}
						vendorsDropdownData={vendorsDropdownData}
						form={form}
						currencySymbol={currencySymbol}
						purchaseDiscountAmount={purchaseDiscountAmount}
						setPurchaseDiscountAmount={setPurchaseDiscountAmount}
						setOrderProcess={setOrderProcess}
						orderProcess={orderProcess}
						purchaseVatAmount={purchaseVatAmount}
						purchaseTotalAmount={purchaseTotalAmount}
						discountType={discountType}
						setDiscountType={setDiscountType}
						returnOrDueText={returnOrDueText}
						vendorData={vendorData}
						purchaseDueAmount={purchaseDueAmount}
						setLoadCardProducts={setLoadCardProducts}
						isWarehouse={isWarehouse}
					/>
				</Box>
			</form>
		</>
	);
}
