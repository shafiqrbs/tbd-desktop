import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import __PosCustomerSection from "./__PosCustomerSection";
import { Box, Text, ActionIcon, Group, TextInput } from "@mantine/core";
import { DataTable } from "mantine-datatable";
import tableCss from "../../../../assets/css/Table.module.css";
import { useTranslation } from "react-i18next";
import { IconPercentage, IconSum, IconX } from "@tabler/icons-react";
import { useOutletContext } from "react-router";
import __PosInvoiceSection from "./__PosInvoiceSection.jsx";
import { getHotkeyHandler, useToggle } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import { rem } from "@mantine/core";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import { formatDate, generateInvoiceId } from "../../../../lib";

export default function PosSalesForm({
	isSMSActive,
	currencySymbol,
	isZeroReceiveAllow,
	tempCardProducts,
	setLoadCardProducts,
}) {
	//common hooks
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight, user } = useOutletContext();
	const height = mainAreaHeight - 170;
	const dispatch = useDispatch();

	// form
	const form = useForm({
		initialValues: {
			customer_id: "",
			transaction_mode_id: "",
			sales_by: "",
			order_process: "",
			narration: "",
			discount: "",
			receive_amount: "",
			name: "",
			mobile: "",
			email: "",
		},
	});

	//calculate subTotal amount
	let salesSubTotalAmount =
		tempCardProducts?.reduce((total, item) => total + item.sub_total, 0) || 0;

	//customer dropdown data
	const [customersDropdownData, setCustomersDropdownData] = useState([]);

	//customer hook
	const [customerData, setCustomerData] = useState(null);
	//default customer hook
	const [defaultCustomerId, setDefaultCustomerId] = useState(null);

	//Customer object hook
	const [customerObject, setCustomerObject] = useState({});

	//profit amount hook
	const [salesProfitAmount] = useState(0);

	//sales discount amount hook
	const [salesDiscountAmount, setSalesDiscountAmount] = useState(0);

	// sales by user hook
	const [salesByUser, setSalesByUser] = useState(null);

	//order process hook
	const [orderProcess, setOrderProcess] = useState(null);

	//vat amount hook
	const [salesVatAmount] = useState(0);

	//sales total amount hook
	const [salesTotalAmount, setSalesTotalAmount] = useState(0);

	// sales due amount hook
	const [salesDueAmount, setSalesDueAmount] = useState(0);

	//return or due text hook
	const [returnOrDueText, setReturnOrDueText] = useState("Due");

	//discount type hook
	const [discountType, setDiscountType] = useToggle(["Flat", "Percent"]);

	// setting default customer
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

	// calculate sales total amount after discount and vat change
	useEffect(() => {
		let discountAmount = 0;
		if (form.values.discount && Number(form.values.discount) > 0) {
			if (discountType === "Flat") {
				discountAmount = Number(form.values.discount);
			} else if (discountType === "Percent") {
				discountAmount = (salesSubTotalAmount * Number(form.values.discount)) / 100;
			}
		}
		setSalesDiscountAmount(discountAmount);

		// Calculate total amount after discount and VAT
		const newTotalAmount =
			salesSubTotalAmount - Number(discountAmount) + Number(salesVatAmount);
		setSalesTotalAmount(newTotalAmount);

		let returnOrDueAmount = 0;
		let receiveAmount =
			form.values.receive_amount == "" ? 0 : Number(form.values.receive_amount);
		if (receiveAmount >= 0) {
			const text = newTotalAmount < receiveAmount ? "Return" : "Due";
			setReturnOrDueText(text);
			returnOrDueAmount = newTotalAmount - receiveAmount;
			setSalesDueAmount(returnOrDueAmount);
		}
	}, [
		form.values.discount,
		discountType,
		form.values.receive_amount,
		salesSubTotalAmount,
		salesVatAmount,
	]);

	const handleSubmit = async () => {
		const items = await window.dbAPI.getDataFromTable("temp_sales_products");
		let createdBy = await window.dbAPI.getDataFromTable("users");

		let transformedArray = items.map((product) => {
			return {
				product_id: product.product_id,
				item_name: product.display_name,
				sales_price: product.sales_price,
				price: product.price,
				percent: product.percent,
				quantity: product.quantity,
				uom: product.unit_name,
				unit_id: product.unit_id,
				purchase_price: product.purchase_price,
				sub_total: product.sub_total,
				warehouse_id: product.warehouse_id,
				bonus_quantity: product.bonus_quantity,
			};
		});

		const options = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		};
		const formValue = {};
		formValue["customer_id"] = form.values.customer_id
			? form.values.customer_id
			: defaultCustomerId;

		// Include manual customer input fields if no customer is selected
		if (!form.values.customer_id || form.values.customer_id == defaultCustomerId) {
			formValue["customer_name"] = form.values.name;
			formValue["customer_mobile"] = form.values.mobile;
			formValue["customer_email"] = form.values.email;
		}

		formValue["sub_total"] = salesSubTotalAmount;
		formValue["transaction_mode_id"] = form.values.transaction_mode_id;
		formValue["discount_type"] = discountType;
		formValue["discount"] = salesDiscountAmount;
		formValue["discount_calculation"] = discountType === "Percent" ? form.values.discount : 0;
		formValue["vat"] = 0;
		formValue["total"] = salesTotalAmount;
		formValue["sales_by_id"] = form.values.sales_by;
		formValue["created_by_id"] = Number(createdBy["id"]);
		formValue["process"] = form.values.order_process;
		formValue["narration"] = form.values.narration;
		formValue["invoice_date"] =
			form.values.invoice_date &&
			new Date(form.values.invoice_date).toLocaleDateString("en-CA", options);
		formValue["items"] = transformedArray ? transformedArray : [];

		const hasReceiveAmount = form.values.receive_amount;
		const isDefaultCustomer =
			!form.values.customer_id || form.values.customer_id == defaultCustomerId;

		formValue["payment"] = hasReceiveAmount
			? form.values.receive_amount
			: isZeroReceiveAllow && isDefaultCustomer
			? salesTotalAmount
			: 0;

		// Check if default customer needs receive amount
		if (
			isDefaultCustomer &&
			!isZeroReceiveAllow &&
			(!form.values.receive_amount ||
				Number(form.values.receive_amount) <= 0 ||
				Number(form.values.receive_amount) < salesTotalAmount)
		) {
			form.setFieldError(
				"receive_amount",
				t("Receive amount must cover the total for default customer")
			);

			notifications.show({
				color: "red",
				title: t("Payment Required"),
				message: t("Default customer must pay full amount"),
				loading: false,
				autoClose: 1500,
			});

			return;
		}

		// Also ensure transaction mode is selected
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

		if (items && items.length > 0) {
			const data = {
				url: "inventory/sales",
				data: formValue,
				module: "sales",
			};

			if (isOnline) {
				dispatch(storeEntityData(data));
			} else {
				const customerInfo = customersDropdownData.find(
					(data) => data.value == formValue.customer_id
				);

				const [coreUser, paymentMode] = await Promise.all([
					window.dbAPI.getDataFromTable("core_users", formValue.sales_by_id),
					window.dbAPI.getDataFromTable(
						"accounting_transaction_mode",
						formValue.transaction_mode_id
					),
				]);

				const salesData = {
					...formValue,
					created: formatDate(new Date()),
					invoice: generateInvoiceId(),
					customerId: formValue.customer_id,
					sales_items: JSON.stringify(items),
					customerName: customerInfo.label.split(" -- ")[1],
					customerMobile: customerInfo.label.split(" -- ")[0],
					createdById: formValue.created_by_id,
					mode_name: paymentMode.name,
					salesById: formValue.sales_by_id,
					salesByUser: coreUser.username,
					salesByName: coreUser.name,
					createdByUser: user?.username,
					createdByName: user?.name,
				};

				await window.dbAPI.upsertIntoTable("sales", salesData);
			}

			notifications.show({
				color: "teal",
				title: t("CreateSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setTimeout(async () => {
				await window.dbAPI.destroyTableData("temp_sales_products");
				form.reset();
				setCustomerData(null);
				setSalesByUser(null);
				setOrderProcess(null);
				setLoadCardProducts(true);
				setCustomerObject(null);
			}, 500);
		} else {
			notifications.show({
				color: "red",
				title: t("PleaseChooseItems"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});
		}
	};

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			<Box bg="white" p="xs" className="borderRadiusAll">
				<__PosCustomerSection
					form={form}
					isSMSActive={isSMSActive}
					currencySymbol={currencySymbol}
					customerObject={customerObject}
					setCustomerObject={setCustomerObject}
					customerData={customerData}
					setCustomerData={setCustomerData}
					customersDropdownData={customersDropdownData}
					setCustomersDropdownData={setCustomersDropdownData}
					defaultCustomerId={defaultCustomerId}
					setDefaultCustomerId={setDefaultCustomerId}
				/>
				<Box className="borderRadiusAll">
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
								textAlignment: "right",
								width: "50px",
								render: (item) => tempCardProducts.indexOf(item) + 1,
							},
							{
								accessor: "display_name",
								title: t("Name"),
								width: "200px",
								footer: (
									<Group spacing="xs">
										<IconSum size="1.25em" />
										<Text mb={-2}>
											{tempCardProducts.length} {t("Items")}
										</Text>
									</Group>
								),
							},
							{
								accessor: "price",
								title: t("Price"),
								textAlign: "right",
								render: (item) => {
									return item.price && Number(item.price).toFixed(2);
								},
							},

							{
								accessor: "stock",
								title: t("Stock"),
								textAlign: "center",
							},
							{
								accessor: "quantity",
								title: t("Quantity"),
								textAlign: "center",
								width: "100px",
								render: (item) => {
									const handleQuantityChange = async (e) => {
										const editedQuantity = e.currentTarget.value;

										await window.dbAPI.updateDataInTable(
											"temp_sales_products",
											{
												id: item.product_id,
												property: "product_id",
												data: {
													quantity: editedQuantity,
													sub_total: editedQuantity * item.sales_price,
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
								textAlign: "center",
							},
							{
								accessor: "sales_price",
								title: t("SalesPrice"),
								textAlign: "center",
								width: "100px",
								render: (item) => {
									const handleSalesPriceChange = async (e) => {
										const newSalesPrice = e.currentTarget.value;
										await window.dbAPI.updateDataInTable(
											"temp_sales_products",
											{
												id: item.product_id,
												property: "product_id",
												data: {
													sales_price: newSalesPrice,
													sub_total: newSalesPrice * item.quantity,
												},
											}
										);
										setLoadCardProducts(true);
									};

									return item.percent ? (
										Number(item.sales_price).toFixed(2)
									) : (
										<>
											<TextInput
												type="number"
												label=""
												size="xs"
												id={"inline-update-quantity-" + item.product_id}
												defaultValue={item.sales_price}
												onChange={handleSalesPriceChange}
											/>
										</>
									);
								},
							},
							{
								accessor: "percent",
								title: t("Discount"),
								textAlign: "center",
								width: "100px",
								render: (item) => {
									const [editedPercent, setEditedPercent] = useState(
										item.percent
									);
									const handlePercentChange = async (e) => {
										const editedPercent = e.currentTarget.value;

										const cardProducts =
											(await window.dbAPI.getDataFromTable(
												"temp_sales_products"
											)) || [];

										if (e.currentTarget.value && e.currentTarget.value >= 0) {
											const updatedProducts = cardProducts.map((product) => {
												if (product.product_id === item.product_id) {
													const discountAmount =
														(item.price * editedPercent) / 100;
													const salesPrice = item.price - discountAmount;

													return {
														...product,
														percent: editedPercent,
														sales_price: salesPrice,
														sub_total: salesPrice * item.quantity,
													};
												}
												return product;
											});

											await Promise.all(
												updatedProducts.map((product) => {
													window.dbAPI.upsertIntoTable(
														"temp_sales_products",
														product
													);
												})
											);
											setLoadCardProducts(true);
										}
									};

									return item.percent ? (
										<>
											<TextInput
												type="number"
												label=""
												size="xs"
												value={editedPercent}
												onChange={handlePercentChange}
												rightSection={
													editedPercent === "" ? (
														<>
															{item.percent}
															<IconPercentage
																size={16}
																opacity={0.5}
															/>
														</>
													) : (
														<IconPercentage size={16} opacity={0.5} />
													)
												}
											/>
										</>
									) : (
										<Text size={"xs"} ta="right">
											{(
												Number(item.price) - Number(item.sales_price)
											).toFixed(2)}
										</Text>
									);
								},
								footer: (
									<Group spacing="xs">
										<Text fz={"md"} fw={"600"}>
											{t("SubTotal")}
										</Text>
									</Group>
								),
							},

							{
								accessor: "sub_total",
								title: t("SubTotal"),
								textAlign: "right",
								render: (item) => {
									return item.sub_total && Number(item.sub_total).toFixed(2);
								},
								footer: (
									<Group spacing="xs">
										<Text fw={"600"} fz={"md"}>
											{salesSubTotalAmount.toFixed(2)}
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
													"temp_sales_products",
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
						totalRecords={100}
						recordsPerPage={10}
						loaderSize="xs"
						loaderColor="grape"
						height={height - 266}
					/>
				</Box>
			</Box>
			<Box>
				<__PosInvoiceSection
					setCustomersDropdownData={setCustomersDropdownData}
					customersDropdownData={customersDropdownData}
					form={form}
					currencySymbol={currencySymbol}
					salesDiscountAmount={salesDiscountAmount}
					salesProfitAmount={salesProfitAmount}
					setSalesDiscountAmount={setSalesDiscountAmount}
					setSalesByUser={setSalesByUser}
					setOrderProcess={setOrderProcess}
					orderProcess={orderProcess}
					salesByUser={salesByUser}
					salesVatAmount={salesVatAmount}
					salesTotalAmount={salesTotalAmount}
					discountType={discountType}
					setDiscountType={setDiscountType}
					returnOrDueText={returnOrDueText}
					customerData={customerData}
					isZeroReceiveAllow={isZeroReceiveAllow}
					salesDueAmount={salesDueAmount}
					setLoadCardProducts={setLoadCardProducts}
				/>
			</Box>
		</form>
	);
}
