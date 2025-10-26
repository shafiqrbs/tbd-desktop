import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import tableCss from "../../../../assets/css/Table.module.css";
import {
	Group,
	Box,
	ActionIcon,
	Text,
	Grid,
	Stack,
	Button,
	ScrollArea,
	Table,
	Menu,
	rem,
	Checkbox,
	Tooltip,
	LoadingOverlay,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconEdit, IconPrinter, IconDotsVertical, IconTrashX, IconCheck } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useHotkeys } from "@mantine/hooks";
import {
	deleteEntityData,
	getIndexEntityData,
	setDeleteMessage,
	setFilter,
	setSearchKeyword,
	showInstantEntityData,
} from "../../../../store/core/crudSlice.js";
import __ShortcutTable from "../../shortcut/__ShortcutTable";
import _SalesSearch from "./_SalesSearch";
import { SalesPrintA4 } from "./print-component/SalesPrintA4";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent";
import SalesPrintThermal from "./print-component/SalesPrintThermal.jsx";

function SalesTable({ data }) {
	const [showDetails, setShowDetails] = useState(false);
	const salesFilterData = useSelector((state) => state.crudSlice.data?.sales?.filters?.sales);
	const entityDataDelete = useSelector((state) => state.crudSlice.data?.sales?.deleteData);
	const navigate = useNavigate();
	const [checkList, setCheckList] = useState({});
	const printRef = useRef();
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const tableHeight = mainAreaHeight - 106; //TabList height 104
	const height = mainAreaHeight - 304; //TabList height 104

	const perPage = 50;
	const [page, setPage] = useState(1);
	const [selectedRow, setSelectedRow] = useState("");
	const [printA4, setPrintA4] = useState(false);
	const [checked, setChecked] = useState(false);
	const [indexData, setIndexData] = useState([]);
	const [fetching, setFetching] = useState(true);
	const [salesViewData, setSalesViewData] = useState({});
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		dispatch(
			setSearchKeyword({
				module: "sales",
				value: "",
			})
		);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			setLoading(false);
		}, 500);
	}, [loading]);

	useEffect(() => {
		setSalesViewData(indexData?.data?.data[0]);
		setSelectedRow(indexData?.data?.data[0]?.invoice);
	}, [indexData?.data, isOnline]);

	useEffect(() => {
		dispatch(
			setDeleteMessage({
				module: "sales",
				message: "",
			})
		);
		if (entityDataDelete === "success") {
			notifications.show({
				color: "red",
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setTimeout(() => {
				dispatch(setFetching(true));
			}, 700);
		}
	}, [entityDataDelete]);

	useEffect(() => {
		fetchData();
	}, [salesFilterData, page, isOnline, data]);

	useHotkeys(
		[
			[
				"alt+n",
				() => {
					navigate("/inventory/sales-invoice");
				},
			],
		],
		[]
	);

	const salesItems = isOnline
		? salesViewData?.sales_items
		: Array.isArray(salesViewData?.sales_items)
		? salesViewData?.sales_items
		: JSON.parse(salesViewData?.sales_items || "[]");

	const rows =
		Array.isArray(salesItems) &&
		salesItems?.map((element, index) => (
			<Table.Tr key={element.name + index}>
				<Table.Td fz="xs" width={"20"}>
					{index + 1}
				</Table.Td>
				<Table.Td ta="left" fz="xs" width={"300"}>
					{element?.name || element?.display_name || ""}
				</Table.Td>
				<Table.Td ta="center" fz="xs" width={"60"}>
					{element?.quantity}
				</Table.Td>
				<Table.Td ta="right" fz="xs" width={"80"}>
					{element?.uom}
				</Table.Td>
				<Table.Td ta="right" fz="xs" width={"80"}>
					{element?.sales_price}
				</Table.Td>
				<Table.Td ta="right" fz="xs" width={"100"}>
					{element?.sub_total}
				</Table.Td>
			</Table.Tr>
		));

	const fetchData = async () => {
		setFetching(true);
		const options = {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		};
		const value = {
			url: "inventory/sales",
			params: {
				term: salesFilterData?.searchKeyword || "",
				customer_id: salesFilterData?.customer_id || "",
				start_date:
					(salesFilterData?.start_date &&
						new Date(salesFilterData?.start_date).toLocaleDateString("en-CA", options)) ||
					"",
				end_date:
					(salesFilterData?.end_date &&
						new Date(salesFilterData?.end_date || Date.now()).toLocaleDateString("en-CA", options)) ||
					"",
				page: page,
				offset: perPage,
			},
			module: "sales",
		};

		try {
			if (isOnline) {
				const resultAction = await dispatch(getIndexEntityData(value));

				if (getIndexEntityData.rejected.match(resultAction)) {
					console.error("Error:", resultAction);
				} else if (getIndexEntityData.fulfilled.match(resultAction)) {
					setIndexData(resultAction?.payload);
				}
			} else if (data) {
				const result = await window.dbAPI.getDataFromTable("sales");
				let filteredData = [...result];

				if (salesFilterData?.searchKeyword) {
					const searchTerm = salesFilterData.searchKeyword?.trim()?.toLowerCase() || "";
					filteredData = filteredData.filter(
						(item) =>
							item.invoice?.toLowerCase().includes(searchTerm) ||
							item.customerName?.toLowerCase().includes(searchTerm) ||
							item.customerMobile?.toLowerCase().includes(searchTerm) ||
							item.customer_address?.toLowerCase().includes(searchTerm)
					);
				}

				if (salesFilterData?.customer_id) {
					filteredData = filteredData.filter(
						(item) => item.customerId === Number(salesFilterData.customer_id)
					);
				}

				if (salesFilterData?.start_date) {
					const startDate = new Date(salesFilterData.start_date);
					startDate.setHours(0, 0, 0, 0);
					filteredData = filteredData.filter((item) => {
						if (!item.created) return false;
						// strip out time portion if present and parse date from "DD-MM-YYYY" format
						const dateOnly = item.created.split(",")[0]; // remove time portion if exists
						const [day, month, year] = dateOnly.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						itemDate.setHours(0, 0, 0, 0);
						return itemDate >= startDate;
					});
				}

				if (salesFilterData?.end_date) {
					const endDate = new Date(salesFilterData.end_date);
					endDate.setHours(23, 59, 59, 999);
					filteredData = filteredData.filter((item) => {
						if (!item.created) return false;
						// strip out time portion if present and parse date from "DD-MM-YYYY" format
						const dateOnly = item.created.split(",")[0]; // remove time portion if exists
						const [day, month, year] = dateOnly.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						itemDate.setHours(0, 0, 0, 0);
						return itemDate <= endDate;
					});
				}

				const totalRecords = filteredData.length;
				const startIndex = (page - 1) * perPage;
				const endIndex = startIndex + perPage;
				const paginatedData = filteredData.slice(startIndex, endIndex);

				paginatedData.reverse();

				setIndexData({
					data: {
						data: paginatedData,
						total: totalRecords,
					},
				});
			} else {
				console.log(data.data?.data);
				setIndexData({
					data: {
						data: data.data?.data || [],
					},
				});
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};

	const CheckItemsHandel = (e, item) => {
		const value = e.currentTarget.value;
		const isChecked = e.currentTarget.checked;

		if (isChecked) {
			setCheckList((prevCheckList) => ({ ...prevCheckList, [value]: Number(value) }));
		} else {
			setCheckList((prevCheckList) => {
				delete prevCheckList[value];
				return { ...prevCheckList };
			});
		}

		if ((isChecked && !Object.keys(checkList).length) || (!isChecked && !Object.keys(checkList).length)) {
			dispatch(
				setFilter({
					module: "sales",
					filterKey: "sales",
					value: isChecked ? item.customerId : "",
					name: "customer_id",
				})
			);
			dispatch(setFetching(true));
		}
	};

	const handleCustomerSalesProcess = async (id, type) => {
		try {
			let resultAction;
			if (type == "NotDomain") {
				resultAction = await dispatch(showInstantEntityData(`inventory/sales/not-domain-customer/${id}`));
			}
			if (type == "Domain") {
				resultAction = await dispatch(showInstantEntityData(`inventory/sales/domain-customer/${id}`));
			}
			if (showInstantEntityData.fulfilled.match(resultAction)) {
				if (resultAction.payload.data.status === 200) {
					// Show success notification
					showNotificationComponent(t("SalesComplete"), "teal", "lightgray", null, false, 1000, true);
				} else {
					showNotificationComponent("Failed to process", "red", "lightgray", null, false, 1000, true);
				}
			}
		} catch (error) {
			console.error("Error updating entity:", error);
			showNotificationComponent("Failed to process", "red", "lightgray", null, false, 1000, true);
		} finally {
			fetchData();
		}
	};

	return (
		<>
			<Box>
				<Grid columns={24} gutter={{ base: 8 }}>
					<Grid.Col span={24}>
						<Box px="xs" py="4" mb="4" className="boxBackground borderRadiusAll">
							<Grid>
								<Grid.Col>
									<Stack>
										<_SalesSearch checkList={checkList} customerId={salesFilterData?.customer_id} />
									</Stack>
								</Grid.Col>
							</Grid>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
			<Box>
				<Grid columns={24} gutter={{ base: 8 }}>
					<Grid.Col span={showDetails ? 15 : 24}>
						<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
							<Box className={"borderRadiusAll"}>
								<DataTable
									classNames={{
										root: tableCss.root,
										table: tableCss.table,
										header: tableCss.header,
										footer: tableCss.footer,
										pagination: tableCss.pagination,
									}}
									records={indexData?.data?.data}
									columns={[
										{
											accessor: "index",
											title: t("S/N"),
											textAlignment: "right",
											render: (item) => (
												<Tooltip
													color="green"
													withArrow={"center"}
													label={item.invoice + " - " + item.customerName}
												>
													<Checkbox
														value={item.id}
														checked={
															!!checkList?.[item.id] ||
															(item?.invoice_batch_id ? true : false)
														}
														variant="filled"
														radius="xs"
														size="md"
														color="green"
														onChange={(e) => CheckItemsHandel(e, item)}
														disabled={item?.invoice_batch_id ? true : false}
													/>
												</Tooltip>
											),
										},
										{
											accessor: "created",
											title: t("Created"),
											render: (item) => (
												<Text component="a" size="sm" variant="subtle" c="red.6">
													{item.created.split(",")[0]}
												</Text>
											),
										},
										{
											accessor: "invoice",
											title: t("Invoice"),
											render: (item) => (
												<Text
													component="a"
													size="sm"
													variant="subtle"
													c="red.6"
													onClick={(e) => {
														e.preventDefault();
														setLoading(true);
														setSalesViewData(item);
														setSelectedRow(item.invoice);
														item?.invoice_batch_id ? setChecked(true) : setChecked(false);
													}}
													style={{ cursor: "pointer" }}
												>
													{item.invoice}
												</Text>
											),
										},
										{ accessor: "customerName", title: t("Customer") },
										{
											accessor: "total",
											title: t("Total"),
											textAlign: "right",
											render: (data) => (
												<>{data.total ? Number(data.total).toFixed(2) : "0.00"}</>
											),
										},
										{
											accessor: "payment",
											title: t("Receive"),
											textAlign: "right",
											render: (data) => (
												<>{data.payment ? Number(data.payment).toFixed(2) : "0.00"}</>
											),
										},
										{
											accessor: "due",
											title: t("Due"),
											textAlign: "right",
											render: (data) => {
												const total = Number(data.total);
												const payment = Number(data.payment);
												let due = 0;
												if (!isNaN(total) && !isNaN(payment)) {
													due = total - payment;
												}
												return <>{!isNaN(due) ? due.toFixed(2) : "0.00"}</>;
											},
										},
										{
											accessor: "action",
											title: t("Action"),
											textAlign: "right",
											render: (data) => (
												<Group gap={4} justify="right" wrap="nowrap">
													<Menu
														position="bottom-end"
														offset={3}
														withArrow
														trigger="hover"
														openDelay={100}
														closeDelay={400}
													>
														<Menu.Target>
															<ActionIcon
																size="sm"
																variant="outline"
																color="red"
																radius="xl"
																aria-label="Settings"
															>
																<IconDotsVertical
																	height={"18"}
																	width={"18"}
																	stroke={1.5}
																/>
															</ActionIcon>
														</Menu.Target>
														<Menu.Dropdown>
															{data.customer_group == "Domain" &&
																!data.is_domain_sales_completed &&
																isOnline && (
																	<Menu.Item
																		onClick={() => {
																			modals.openConfirmModal({
																				title: (
																					<Text size="md">
																						{" "}
																						{t("SalesConformation")}
																					</Text>
																				),
																				children: (
																					<Text size="sm">
																						{" "}
																						{t("FormConfirmationMessage")}
																					</Text>
																				),
																				labels: {
																					confirm: "Confirm",
																					cancel: "Cancel",
																				},
																				onCancel: () => console.log("Cancel"),
																				onConfirm: () => {
																					handleCustomerSalesProcess(
																						data.id,
																						"Domain"
																					);
																				},
																			});
																		}}
																		component="a"
																		w={"200"}
																	>
																		{t("SalesProcess")}
																	</Menu.Item>
																)}

															{data.customer_group != "Domain" &&
																!data.approved_by_id &&
																isOnline && (
																	<Menu.Item
																		onClick={() => {
																			modals.openConfirmModal({
																				title: (
																					<Text size="md">
																						{" "}
																						{t("SalesConformation")}
																					</Text>
																				),
																				children: (
																					<Text size="sm">
																						{" "}
																						{t("FormConfirmationMessage")}
																					</Text>
																				),
																				labels: {
																					confirm: "Confirm",
																					cancel: "Cancel",
																				},
																				onCancel: () => console.log("Cancel"),
																				onConfirm: () => {
																					handleCustomerSalesProcess(
																						data.id,
																						"NotDomain"
																					);
																				},
																			});
																		}}
																		component="a"
																		w={"200"}
																	>
																		{t("SalesProcess")}
																	</Menu.Item>
																)}
															{!data.invoice_batch_id &&
																!data.approved_by_id &&
																isOnline && (
																	<Menu.Item
																		onClick={() => {
																			navigate(
																				`/inventory/sales/edit/${data.id}`
																			);
																		}}
																		component="a"
																		w={"200"}
																	>
																		{t("Edit")}
																	</Menu.Item>
																)}
															<Menu.Item
																onClick={(e) => {
																	e.preventDefault();
																	setLoading(true);
																	setSalesViewData(data);
																	setShowDetails(true);
																	setSelectedRow(data.invoice);
																	data?.invoice_batch_id
																		? setChecked(true)
																		: setChecked(false);
																}}
																component="a"
																w={"200"}
															>
																{t("Show")}
															</Menu.Item>
															{!data.invoice_batch_id &&
																!data.approved_by_id &&
																isOnline && (
																	<Menu.Item
																		onClick={() => {
																			modals.openConfirmModal({
																				title: (
																					<Text size="md">
																						{" "}
																						{t("FormConfirmationTitle")}
																					</Text>
																				),
																				children: (
																					<Text size="sm">
																						{" "}
																						{t("FormConfirmationMessage")}
																					</Text>
																				),
																				labels: {
																					confirm: "Confirm",
																					cancel: "Cancel",
																				},
																				confirmProps: {
																					color: "red.6",
																				},
																				onCancel: () => console.log("Cancel"),
																				onConfirm: () => {
																					dispatch(
																						deleteEntityData(
																							`inventory/sales/${data.id}`
																						)
																					);
																					window.dbAPI.deleteDataFromTable(
																						"sales",
																						data.id
																					);
																				},
																			});
																		}}
																		component="a"
																		w={"200"}
																		mt={"2"}
																		bg={"red.1"}
																		c={"red.6"}
																		rightSection={
																			<IconTrashX
																				style={{
																					width: rem(14),
																					height: rem(14),
																				}}
																			/>
																		}
																	>
																		{t("Delete")}
																	</Menu.Item>
																)}
														</Menu.Dropdown>
													</Menu>
												</Group>
											),
										},
									]}
									fetching={fetching}
									totalRecords={indexData?.data?.total}
									recordsPerPage={perPage}
									page={page}
									onPageChange={(p) => {
										setPage(p);
										dispatch(setFetching(true));
									}}
									loaderSize="xs"
									loaderColor="grape"
									height={tableHeight}
									scrollAreaProps={{ type: "never" }}
									rowStyle={(item) =>
										item.invoice === selectedRow
											? { background: "#e2c2c263", color: "#FA5463" }
											: undefined
									}
								/>
							</Box>
						</Box>
					</Grid.Col>

					{showDetails && (
						<>
							{" "}
							<Grid.Col span={8}>
								<Box bg={"white"} p={"xs"} className={"borderRadiusAll"} ref={printRef} pos="relative">
									{loading && (
										<LoadingOverlay
											visible={loading}
											zIndex={1000}
											overlayProps={{ radius: "sm", blur: 2 }}
											loaderProps={{ color: "red" }}
										/>
									)}
									<Box
										h={"36"}
										pl={`xs`}
										fz={"sm"}
										fw={"600"}
										pr={8}
										pt={"6"}
										mb={"4"}
										className={"boxBackground textColor borderRadiusAll"}
									>
										{t("Invoice")}:{" "}
										{salesViewData && salesViewData.invoice && salesViewData.invoice}
									</Box>
									<Box className={"borderRadiusAll"} fz={"sm"}>
										<ScrollArea h={122} type="never">
											<Box
												pl={`xs`}
												fz={"sm"}
												fw={"600"}
												pr={"xs"}
												pt={"6"}
												pb={"xs"}
												className={"boxBackground textColor"}
											>
												<Grid gutter={{ base: 4 }}>
													<Grid.Col span={"6"}>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Customer")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.customerName &&
																		salesViewData.customerName}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Mobile")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.customerMobile &&
																		salesViewData.customerMobile}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Address")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.customer_address &&
																		salesViewData.customer_address}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Balance")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData && salesViewData.balance
																		? Number(salesViewData.balance).toFixed(2)
																		: 0.0}
																</Text>
															</Grid.Col>
														</Grid>
													</Grid.Col>
													<Grid.Col span={"6"}>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Created")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.created &&
																		salesViewData.created}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("CreatedBy")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.createdByName &&
																		salesViewData.createdByName}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("SalesBy")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.salesByUser &&
																		salesViewData.salesByUser}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Mode")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.mode_name &&
																		salesViewData.mode_name}
																</Text>
															</Grid.Col>
														</Grid>
														<Grid columns={15} gutter={{ base: 4 }}>
															<Grid.Col span={6}>
																<Text fz="sm" lh="xs">
																	{t("Process")}
																</Text>
															</Grid.Col>
															<Grid.Col span={9}>
																<Text fz="sm" lh="xs">
																	{salesViewData &&
																		salesViewData.process &&
																		salesViewData.process}
																</Text>
															</Grid.Col>
														</Grid>
													</Grid.Col>
												</Grid>
											</Box>
										</ScrollArea>
										<ScrollArea h={height} scrollbarSize={2} type="never">
											<Box>
												<Table stickyHeader>
													<Table.Thead>
														<Table.Tr>
															<Table.Th fz="xs" w={"20"}>
																{t("S/N")}
															</Table.Th>
															<Table.Th fz="xs" ta="left" w={"300"}>
																{t("Name")}
															</Table.Th>
															<Table.Th fz="xs" ta="center" w={"60"}>
																{t("QTY")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"80"}>
																{t("UOM")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"80"}>
																{t("Price")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"100"}>
																{t("SubTotal")}
															</Table.Th>
														</Table.Tr>
													</Table.Thead>
													<Table.Tbody>{rows}</Table.Tbody>
													<Table.Tfoot>
														<Table.Tr>
															<Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
																{t("SubTotal")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"100"}>
																{salesViewData &&
																	salesViewData.sub_total &&
																	Number(salesViewData.sub_total).toFixed(2)}
															</Table.Th>
														</Table.Tr>
														<Table.Tr>
															<Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
																{t("Discount")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"100"}>
																{salesViewData &&
																	salesViewData.discount &&
																	Number(salesViewData.discount).toFixed(2)}
															</Table.Th>
														</Table.Tr>
														<Table.Tr>
															<Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
																{t("Total")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"100"}>
																{salesViewData &&
																	salesViewData.total &&
																	Number(salesViewData.total).toFixed(2)}
															</Table.Th>
														</Table.Tr>
														<Table.Tr>
															<Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
																{t("Receive")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"100"}>
																{salesViewData &&
																	salesViewData.payment &&
																	Number(salesViewData.payment).toFixed(2)}
															</Table.Th>
														</Table.Tr>
														<Table.Tr>
															<Table.Th colSpan={"5"} ta="right" fz="xs" w={"100"}>
																{t("Due")}
															</Table.Th>
															<Table.Th ta="right" fz="xs" w={"100"}>
																{salesViewData &&
																	salesViewData.total &&
																	(
																		Number(salesViewData.total) -
																		Number(salesViewData.payment)
																	).toFixed(2)}
															</Table.Th>
														</Table.Tr>
													</Table.Tfoot>
												</Table>
											</Box>
										</ScrollArea>
									</Box>
									<Button.Group mb={"1"}>
										<Button
											fullWidth={true}
											variant="filled"
											leftSection={<IconPrinter size={14} />}
											color="green.5"
											onClick={() => {
												setPrintA4(true);
											}}
										>
											{t("Print")}
										</Button>
										<SalesPrintThermal salesViewData={salesViewData} salesItems={salesItems} />
										{!checked && isOnline && (
											<Button
												onClick={() => navigate(`/inventory/sales/edit/${salesViewData?.id}`)}
												component="a"
												fullWidth={true}
												variant="filled"
												leftSection={<IconEdit size={14} />}
												color="cyan.5"
											>
												{t("Edit")}
											</Button>
										)}
									</Button.Group>
								</Box>
							</Grid.Col>
							<Grid.Col span={1}>
								<Box bg={"white"} className={"borderRadiusAll"} pt={"16"}>
									<__ShortcutTable form="" FormSubmit={"EntityFormSubmit"} Name={"CompanyName"} />
								</Box>
							</Grid.Col>
						</>
					)}
				</Grid>
			</Box>
			{printA4 && (
				<div style={{ display: "none" }}>
					<SalesPrintA4 salesViewData={salesViewData} setPrintA4={setPrintA4} salesItems={salesItems} />
				</div>
			)}
		</>
	);
}

export default SalesTable;
