import { useEffect, useState } from "react";
import { useOutletContext } from "react-router";
import {
	Group,
	Box,
	ActionIcon,
	Text,
	Center,
	TextInput,
	Tooltip,
	Grid,
	Flex,
	Stack,
	ScrollArea,
	Card,
	Image,
	SegmentedControl,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconLayoutGrid,
	IconListDetails,
	IconBaselineDensitySmall,
	IconSearch,
	IconInfoCircle,
	IconMinus,
	IconPlus,
	IconX,
	IconBarcode,
} from "@tabler/icons-react";
import classes from "./css/Table.module.css";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import { DataTable } from "mantine-datatable";
import tableCss from "./css/Table.module.css";
import Invoice from "./Invoice.jsx";
import { notifications } from "@mantine/notifications";
import { useCartOperations } from "./utils/CartOperations.jsx";
import __ShortcutPos from "./__ShortcutPos.jsx";

export default function NewSales({
	categoryDropdown,
	tableId,
	setTableId,
	tables,
	setTables,
	tableCustomerMap,
	updateTableCustomer,
	clearTableCustomer,
	customerObject,
	setCustomerObject,
	updateTableSplitPayment,
	clearTableSplitPayment,
	tableSplitPaymentMap,
	invoiceMode,
	invoiceData,
	reloadInvoiceData,
	setReloadInvoiceData,
	setInvoiceData,
}) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 190;
	const [selected, setSelected] = useState([]);
	const [id, setId] = useState(null);
	const { configData } = getConfigData();
	const enableTable = !!(configData?.inventory_config?.is_pos && invoiceMode === "table");
	const [loadCartProducts, setLoadCartProducts] = useState(false);

	const [originalProducts, setOriginalProducts] = useState([]);
	const [products, setProducts] = useState([]);
	const [currentStatus] = useState("");
	const [value, setValue] = useState("grid");
	const [searchValue, setSearchValue] = useState("");
	const [tableStatuses, setTableStatuses] = useState({});
	const [barcode, setBarcode] = useState("");

	const [isValidBarcode, setIsValidBarcode] = useState(true);

	const handleBarcodeSearch = (code) => {
		const product = products.find((p) => p.barcode === code || p.id.toString() === code);

		if (product) {
			handleIncrement(product.id);
			setIsValidBarcode(true);
			setBarcode("");
			notifications.show({
				title: t("ProductFound"),
				message: `${product.display_name} ${t("AddedToCart")}`,
				color: "green",
				autoClose: 1500,
			});
		} else {
			setIsValidBarcode(false);

			notifications.show({
				title: t("ProductNotFound"),
				message: t("NoProductWithBarcode"),
				color: "red",
				autoClose: 2000,
			});
		}
	};

	const updateTableStatus = (newStatus) => {
		if (!tableId) return;

		setTables((prevTables) =>
			prevTables.map((table) => {
				if (table.id === tableId) {
					const currentTime = new Date();
					let updatedStatusHistory = [...(table.statusHistory || [])];
					if (table.currentStatusStartTime) {
						const previousStatus = table.status;
						const elapsedTime = currentTime - new Date(table.currentStatusStartTime);

						updatedStatusHistory.push({
							status: previousStatus,
							startTime: table.currentStatusStartTime,
							endTime: currentTime,
							elapsedTime: elapsedTime,
						});
					}

					// Update the table-specific status
					setTableStatuses((prev) => ({
						...prev,
						[table.id]: newStatus,
					}));

					if (newStatus === "Free") {
						return {
							...table,
							status: newStatus,
							statusHistory: updatedStatusHistory,
							currentStatusStartTime: null,
							elapsedTime: "00:00:00",
						};
					}
					return {
						...table,
						status: newStatus,
						statusHistory: updatedStatusHistory,
						currentStatusStartTime: currentTime,
						elapsedTime: "00:00:00",
					};
				}
				return table;
			})
		);
	};

	useEffect(() => {
		const newTableStatuses = {};
		tables?.forEach((table) => {
			newTableStatuses[table.id] = table.status || "Free";
		});
		setTableStatuses(newTableStatuses);
	}, [tables]);

	useEffect(() => {
		async function fetchData() {
			const localProducts = await window.dbAPI.getDataFromTable("core_products");
			const filteredProducts = localProducts.filter((product) => {
				if (id) {
					return (
						product.product_nature !== "raw-materials" &&
						product.category_id === Number(id) &&
						product.sales_price !== 0
					);
				}
				return product.product_nature !== "raw-materials";
			});
			setProducts(filteredProducts);
			setOriginalProducts(filteredProducts);
		}

		fetchData();
	}, [id]);

	const { handleIncrement, handleDecrement } = useCartOperations({
		enableTable,
		tableId,
		products,
		currentStatus,
		updateTableStatus,
		setLoadCartProducts,
		setReloadInvoiceData,
	});

	const handleSelect = (productId) => {
		if (!tableId) {
			return notifications.show({
				title: "Table not selected",
				message: "Please select a table first",
				color: "red",
				autoClose: 2000,
			});
		}
		setSelected((prevSelected) =>
			prevSelected.includes(productId)
				? prevSelected.filter((id) => id !== productId)
				: [...prevSelected, productId]
		);
		setTimeout(() => {
			setSelected([]);
		}, 50);
	};

	const filterProductsbyCategory = (id) => {
		if (id === "230") {
			setId(null);
		} else {
			setId(id);
		}
	};

	const filterList = (searchValue) => {
		if (!searchValue) {
			setProducts(originalProducts);
			return;
		}

		const updatedList = originalProducts.filter((product) => {
			return product.display_name.toLowerCase().includes(searchValue.toLowerCase());
		});
		setProducts(updatedList);
	};

	useEffect(() => {
		setTables((prevTables) =>
			prevTables?.map((table) => {
				if (table.status !== "Free" && table.currentStatusStartTime) {
					const elapsedSeconds = Math.floor(
						(new Date() - new Date(table.currentStatusStartTime)) / 1000
					);
					const hours = Math.floor(elapsedSeconds / 3600)
						.toString()
						.padStart(2, "0");
					const minutes = Math.floor((elapsedSeconds % 3600) / 60)
						.toString()
						.padStart(2, "0");
					const seconds = (elapsedSeconds % 60).toString().padStart(2, "0");

					return {
						...table,
						elapsedTime: `${hours}:${minutes}:${seconds}`,
					};
				}
				return table;
			})
		);
	}, []);

	const renderStatusButtons = () => (
		<SegmentedControl
			mt={8}
			styles={{
				label: { color: "white" },
			}}
			// default color
			bg="gray.8"
			withItemsBorders={false}
			fullWidth
			color="red.6"
			value={tableStatuses[tableId]}
			onChange={(status) => updateTableStatus(status)}
			data={[
				{
					label: (
						<Center style={{ gap: 10 }}>
							<Text
								c={tableStatuses[tableId] === "Order" ? "black" : "white"}
								fw={600}
							>
								{t("Order")}
							</Text>
						</Center>
					),
					value: "Order",
				},
				{
					label: (
						<Center style={{ gap: 10 }}>
							<Text
								c={tableStatuses[tableId] === "Kitchen" ? "black" : "white"}
								fw={600}
							>
								{t("Kitchen")}
							</Text>
						</Center>
					),
					value: "Kitchen",
				},
				{
					label: (
						<Center style={{ gap: 10 }}>
							<Text
								c={tableStatuses[tableId] === "Hold" ? "black" : "white"}
								fw={600}
							>
								{t("Hold")}
							</Text>
						</Center>
					),
					value: "Hold",
				},
				{
					label: (
						<Center style={{ gap: 10 }}>
							<Text
								c={tableStatuses[tableId] === "Reserved" ? "black" : "white"}
								fw={600}
							>
								{t("Reserved")}
							</Text>
						</Center>
					),
					value: "Reserved",
				},
				{
					label: (
						<Center style={{ gap: 10 }}>
							<Text
								c={tableStatuses[tableId] === "Free" ? "black" : "white"}
								fw={600}
							>
								{t("Free")}
							</Text>
						</Center>
					),
					value: "Free",
				},
			]}
		/>
	);
	const [leftSide] = useState(false);
	return (
		<>
			<Grid columns={24} gutter={{ base: 8 }}>
				<Grid.Col span={1}>
					<__ShortcutPos FormSubmit={"EntityFormSubmit"} Name={"CompanyName"} />
				</Grid.Col>

				{leftSide ? (
					<Grid.Col span={8}>
						<Invoice
							setInvoiceData={setInvoiceData}
							products={products}
							tableId={tableId}
							setTableId={setTableId}
							tables={tables}
							setLoadCartProducts={setLoadCartProducts}
							tableCustomerMap={tableCustomerMap}
							updateTableCustomer={updateTableCustomer}
							clearTableCustomer={clearTableCustomer}
							customerObject={customerObject}
							setCustomerObject={setCustomerObject}
							loadCartProducts={loadCartProducts}
							setTables={setTables}
							updateTableSplitPayment={updateTableSplitPayment}
							clearTableSplitPayment={clearTableSplitPayment}
							tableSplitPaymentMap={tableSplitPaymentMap}
							invoiceMode={invoiceMode}
							invoiceData={invoiceData}
							reloadInvoiceData={reloadInvoiceData}
							setReloadInvoiceData={setReloadInvoiceData}
						/>
					</Grid.Col>
				) : (
					<Grid.Col span={15}>
						<Grid columns={12} gutter={{ base: 8 }}>
							<Grid.Col span={2}>
								<Box bg="white" w="100%" className="border-radius">
									<ScrollArea
										h={enableTable ? height + 30 : height + 195}
										type="never"
										scrollbars="y"
									>
										<Box pl={"8"} pr={"8"} pb={"4"}>
											{categoryDropdown.map((data) => (
												<Box
													style={{
														borderRadius: 4,
													}}
													className={`${classes["pressable-card"]} border-radius`}
													mih={40}
													mt={"4"}
													variant="default"
													key={data.value}
													onClick={() => {
														filterProductsbyCategory(data.value);
													}}
													bg={data.value === id ? "green.8" : "gray.8"}
												>
													<Text
														size={"sm"}
														pl={14}
														pt={8}
														fw={500}
														c={data.value === id ? "white" : "gray.4"}
													>
														{data.label}
													</Text>
												</Box>
											))}
										</Box>
									</ScrollArea>
								</Box>
							</Grid.Col>
							<Grid.Col span={10}>
								<Stack gap={0}>
									<Box
										bg={"gray.8"}
										pt={0}
										pr={4}
										pl={4}
										pb={4}
										className="border-radius"
									>
										<Grid
											columns={12}
											gutter={{ base: 4 }}
											align="center"
											mt={4}
										>
											<Grid.Col span={3}>
												<Tooltip
													label={t("BarcodeValidateMessage")}
													opened={!isValidBarcode}
													px={16}
													py={2}
													position="top-end"
													bg={`red.4`}
													c={"white"}
													withArrow
													offset={2}
													zIndex={999}
													transitionProps={{
														transition: "pop-bottom-left",
														duration: 500,
													}}
												>
													<TextInput
														type="number"
														name="barcode"
														id="barcode"
														size="md"
														label={""}
														placeholder={t("Barcode")}
														value={barcode}
														onChange={(event) => {
															setBarcode(event.target.value);
															// handleBarcodeSearch(barcode);
														}}
														onKeyPress={(e) => {
															if (e.key === "Enter" && barcode) {
																handleBarcodeSearch(barcode);
															}
														}}
														autoComplete="off"
														leftSection={
															<IconBarcode size={16} opacity={0.5} />
														}
														rightSection={
															barcode ? (
																<Tooltip
																	label={t("Clear")}
																	withArrow
																	bg={`gray.1`}
																	c={`gray.7`}
																>
																	<ActionIcon
																		size="sm"
																		variant="transparent"
																		onClick={() => {
																			setBarcode("");
																			setIsValidBarcode(true);
																		}}
																	>
																		<IconX
																			color="red"
																			size={16}
																		/>
																	</ActionIcon>
																</Tooltip>
															) : (
																<Tooltip
																	label={t("ScanOrTypeBarcode")}
																	px={16}
																	py={2}
																	withArrow
																	position="left"
																	c="black"
																	bg="gray.1"
																	transitionProps={{
																		transition:
																			"pop-bottom-left",
																		duration: 500,
																	}}
																>
																	<IconInfoCircle
																		size={16}
																		opacity={0.5}
																	/>
																</Tooltip>
															)
														}
													/>
												</Tooltip>
											</Grid.Col>
											<Grid.Col span={6}>
												<TextInput
													radius="sm"
													leftSection={
														<IconSearch size={16} opacity={0.5} />
													}
													size="md"
													placeholder={t("SearchFood")}
													rightSection={
														searchValue ? (
															<Tooltip
																label="Clear"
																withArrow
																position="top"
															>
																<IconX
																	color="red"
																	size={16}
																	opacity={0.5}
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		setSearchValue("");
																		filterList("");
																	}}
																/>
															</Tooltip>
														) : (
															<Tooltip
																label="Field is required"
																withArrow
																position="top"
																color="red"
															>
																<IconInfoCircle
																	size={16}
																	opacity={0.5}
																/>
															</Tooltip>
														)
													}
													onChange={(event) => {
														setSearchValue(event.target.value);
														filterList(event.target.value);
													}}
												/>
											</Grid.Col>
											<Grid.Col span={3}>
												<SegmentedControl
													styles={{
														label: { color: "white" },
													}}
													bg={"green.6"}
													withItemsBorders={false}
													fullWidth
													color="green.4"
													value={value}
													onChange={setValue}
													data={[
														{
															label: (
																<Center style={{ gap: 10 }}>
																	<IconLayoutGrid
																		height={"24"}
																		width={"24"}
																		stroke={1.5}
																	/>
																</Center>
															),
															value: "grid",
														},
														{
															label: (
																<Center style={{ gap: 10 }}>
																	<IconListDetails
																		height={"24"}
																		width={"24"}
																		stroke={1.5}
																	/>
																</Center>
															),
															value: "list",
														},
														{
															label: (
																<Center style={{ gap: 10 }}>
																	<IconBaselineDensitySmall
																		height={"24"}
																		width={"24"}
																		stroke={1.5}
																	/>
																	{/* <span>Minimal</span> */}
																</Center>
															),
															value: "minimal",
														},
													]}
												/>
											</Grid.Col>
										</Grid>
									</Box>
									<Box
										bg="white"
										w={"100%"}
										h={enableTable ? height - 22 : height + 141}
										mt={4}
										className="border-radius"
									>
										<ScrollArea
											h={enableTable ? height - 22 : height + 141}
											type="never"
											pt={"8"}
											pl={"xs"}
											pr={"xs"}
											pb={"6"}
											scrollbars="y"
										>
											{/* 1  */}
											{value === "grid" && (
												<Grid columns={12} gutter={{ base: 8 }}>
													{products.length > 0 ? (
														products?.map((product) => (
															<Grid.Col span={3} key={product.id}>
																<Card
																	shadow="md"
																	radius="md"
																	padding="xs"
																	styles={() => ({
																		root: {
																			cursor: "pointer",
																			transition:
																				"transform 0.5s ease-in-out",
																			transform:
																				selected.includes(
																					product.id
																				)
																					? "scale(0.97)"
																					: undefined,
																			border: selected.includes(
																				product.id
																			)
																				? "3px solid green.8"
																				: "3px solid white",
																		},
																	})}
																	onClick={() => {
																		handleSelect(product.id);
																		handleIncrement(product.id);
																	}}
																>
																	<Image
																		radius="sm"
																		mih={120}
																		mah={120}
																		w="auto"
																		fit="cover"
																		src={`${
																			import.meta.env
																				.VITE_IMAGE_GATEWAY_URL
																		}/uploads/inventory/product/feature_image/${
																			product.feature_image
																		}`}
																		fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
																			product.display_name
																		)}`}
																	/>
																	<Text
																		fw={600}
																		size="sm"
																		fz={"13"}
																		mt={"4"}
																		ta={"left"}
																	>
																		{product.display_name}
																	</Text>

																	<Text
																		styles={{
																			root: {
																				marginTop: "auto",
																			},
																		}}
																		ta={"right"}
																		fw={900}
																		fz={"18"}
																		size="md"
																		c={"green.9"}
																	>
																		{
																			configData?.currency
																				?.symbol
																		}{" "}
																		{product.sales_price}
																	</Text>
																</Card>
															</Grid.Col>
														))
													) : (
														<>
															<Flex
																m={"sm"}
																h={"100%"}
																w={"100%"}
																justify="center"
																align="center"
															>
																<Text
																	ta={"center"}
																	fw={"normal"}
																	fz={"md"}
																	c={"black"}
																>
																	No product found in this
																	category
																</Text>
															</Flex>
														</>
													)}
												</Grid>
											)}
											{/* 2 */}
											{value === "list" && (
												<Grid columns={12} gutter={8}>
													{products.length > 0 ? (
														products?.map((product) => (
															<Grid.Col key={product.id} span={6}>
																<Card
																	shadow="md"
																	radius="md"
																	styles={() => ({
																		root: {
																			cursor: "pointer",
																			transform:
																				selected.includes(
																					product.id
																				)
																					? "scale(0.97)"
																					: undefined,
																			border: selected.includes(
																				product.id
																			)
																				? "3px solid #00542b"
																				: "3px solid #eaeced",
																		},
																	})}
																	padding="xs"
																	onClick={() => {
																		handleSelect(product.id);
																		handleIncrement(product.id);
																	}}
																>
																	<Grid columns={12}>
																		<Grid.Col span={6}>
																			<Card p={0}>
																				<Image
																					mih={120}
																					mah={120}
																					miw={70}
																					fit="cover"
																					// src={product.img}
																					src={`${
																						import.meta
																							.env
																							.VITE_IMAGE_GATEWAY_URL
																					}/uploads/inventory/product/feature_image/${
																						product.feature_image
																					}`}
																					fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
																						product.display_name
																					)}`}
																				/>
																			</Card>
																		</Grid.Col>
																		<Grid.Col span={6}>
																			<Stack
																				radius="md"
																				mih={"118"}
																				bg="var(--mantine-color-body)"
																				align="stretch"
																				justify="space-between"
																				gap="md"
																			>
																				<Text
																					fw={600}
																					size="sm"
																					fz={"13"}
																					mt={"4"}
																				>
																					{
																						product.display_name
																					}
																				</Text>
																				<Flex
																					gap="md"
																					justify="flex-end"
																					align="flex-end"
																					direction="row"
																					wrap="nowrap"
																				>
																					<Text
																						ta={"right"}
																						fw={900}
																						fz={"18"}
																						size="md"
																						c={
																							"green.9"
																						}
																					>
																						{
																							configData
																								?.currency
																								?.symbol
																						}{" "}
																						{
																							product.sales_price
																						}
																					</Text>
																				</Flex>
																			</Stack>
																		</Grid.Col>
																	</Grid>
																</Card>
															</Grid.Col>
														))
													) : (
														<>
															<Flex
																m={"sm"}
																h={"100%"}
																w={"100%"}
																justify="center"
																align="center"
															>
																<Text
																	ta={"center"}
																	fw={"normal"}
																	fz={"md"}
																	c={"black"}
																>
																	No product found in this
																	category
																</Text>
															</Flex>
														</>
													)}
												</Grid>
											)}
											{/* 3 */}
											{value === "minimal" && (
												<>
													<DataTable
														classNames={{
															root: tableCss.root,
															table: tableCss.table,
															header: tableCss.header,
															footer: tableCss.footer,
															pagination: tableCss.pagination,
														}}
														records={products}
														columns={[
															{
																accessor: "id",
																title: "S/N",
																render: (data, index) => index + 1,
															},
															{
																accessor: "display_name",
																title: t("Product"),
															},
															{
																accessor: "price",
																title: t("Price"),
																textAlign: "center",
																render: (data) => (
																	<>
																		{
																			configData?.currency
																				?.symbol
																		}{" "}
																		{data.sales_price}
																	</>
																),
															},
															{
																accessor: "qty",
																title: t("Qty"),
																textAlign: "center",
																backgroundColor: "blue",
																render: (data) => (
																	<Group
																		gap={8}
																		justify="center"
																		align="center"
																	>
																		<ActionIcon
																			size={"sm"}
																			bg={"gray.7"}
																			onClick={async () => {
																				handleDecrement(
																					data.id
																				);
																			}}
																			disabled={
																				invoiceData?.invoice_items?.find(
																					(item) =>
																						item.product_id ===
																						data.id
																				)?.quantity == 1
																			}
																		>
																			<IconMinus
																				height={"12"}
																				width={"12"}
																			/>
																		</ActionIcon>
																		<Text
																			size="sm"
																			ta={"center"}
																			fw={600}
																			maw={30}
																			miw={30}
																		>
																			{invoiceData?.invoice_items?.find(
																				(item) =>
																					item.product_id ===
																					data.id
																			)?.quantity ?? 0}
																		</Text>
																		<ActionIcon
																			size={"sm"}
																			bg={"gray.7"}
																			onClick={() =>
																				handleIncrement(
																					data.id
																				)
																			}
																		>
																			<IconPlus
																				height={"12"}
																				width={"12"}
																			/>
																		</ActionIcon>
																	</Group>
																),
															},
														]}
														loaderSize="xs"
														loaderColor="grape"
														height={height - 30}
														scrollAreaProps={{ type: "never" }}
													/>
												</>
											)}
										</ScrollArea>
									</Box>
								</Stack>
							</Grid.Col>
						</Grid>
						{enableTable && renderStatusButtons()}
					</Grid.Col>
				)}
				{leftSide ? (
					<Grid.Col span={15}>
						<Grid columns={12} gutter={{ base: 8 }}>
							<Grid.Col span={2}>
								<Box bg="white" w={"100%"} className="border-radius">
									<ScrollArea
										h={enableTable ? height + 32 : height + 195}
										type="never"
										scrollbars="y"
									>
										<Box pl={"8"} pr={"8"} pb={"8"}>
											{categoryDropdown.map((data) => (
												<Box
													style={{
														borderRadius: 4,
													}}
													className={`${classes["pressable-card"]} border-radius`}
													mih={40}
													mt={"4"}
													variant="default"
													key={data.value}
													onClick={() => {
														filterProductsbyCategory(data.value);
													}}
													bg={data.value === id ? "green.8" : "gray.8"}
												>
													<Text
														size={"md"}
														pl={14}
														pt={8}
														fw={500}
														c={data.value === id ? "white" : "gray.4"}
													>
														{data.label}
													</Text>
												</Box>
											))}
										</Box>
									</ScrollArea>
								</Box>
							</Grid.Col>
							<Grid.Col span={10}>
								<Stack gap={0}>
									<Box
										bg={"gray.8"}
										pt={0}
										pr={4}
										pl={4}
										pb={4}
										className="border-radius"
									>
										<Grid gutter={{ base: 4 }} align="center" mt={4}>
											<Grid.Col span={3}>
												<Tooltip
													label={t("BarcodeValidateMessage")}
													opened={!isValidBarcode}
													px={16}
													py={2}
													position="top-end"
													bg={`red.4`}
													c={"white"}
													withArrow
													offset={2}
													zIndex={999}
													transitionProps={{
														transition: "pop-bottom-left",
														duration: 500,
													}}
												>
													<TextInput
														type="number"
														name="barcode"
														id="barcode"
														size="md"
														label={""}
														placeholder={t("Barcode")}
														value={barcode}
														onChange={(event) => {
															setBarcode(event.target.value);
														}}
														onKeyPress={(e) => {
															if (e.key === "Enter" && barcode) {
																handleBarcodeSearch(barcode);
															}
														}}
														autoComplete="off"
														leftSection={
															<IconBarcode size={16} opacity={0.5} />
														}
														rightSection={
															barcode ? (
																<Tooltip
																	label={t("Clear")}
																	withArrow
																	bg={`gray.1`}
																	c={`gray.7`}
																>
																	<ActionIcon
																		size="sm"
																		variant="transparent"
																		onClick={() => {
																			setBarcode("");
																			setIsValidBarcode(true);
																		}}
																	>
																		<IconX
																			color="red"
																			size={16}
																		/>
																	</ActionIcon>
																</Tooltip>
															) : (
																<Tooltip
																	label={t("ScanOrTypeBarcode")}
																	px={16}
																	py={2}
																	withArrow
																	position={"left"}
																	c={"black"}
																	bg={`gray.1`}
																	transitionProps={{
																		transition:
																			"pop-bottom-left",
																		duration: 500,
																	}}
																>
																	<IconInfoCircle
																		size={16}
																		opacity={0.5}
																	/>
																</Tooltip>
															)
														}
													/>
												</Tooltip>
											</Grid.Col>
											<Grid.Col span={7}>
												<TextInput
													radius="sm"
													leftSection={
														<IconSearch size={16} opacity={0.5} />
													}
													size="md"
													placeholder={t("SearchFood")}
													rightSection={
														searchValue ? (
															<Tooltip
																label="Clear"
																withArrow
																position="top"
															>
																<IconX
																	color="red"
																	size={16}
																	opacity={0.5}
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		setSearchValue("");
																		filterList("");
																	}}
																/>
															</Tooltip>
														) : (
															<Tooltip
																label="Field is required"
																withArrow
																position="top"
																color="red"
															>
																<IconInfoCircle
																	size={16}
																	opacity={0.5}
																/>
															</Tooltip>
														)
													}
													onChange={(event) => {
														setSearchValue(event.target.value);
														filterList(event.target.value);
													}}
												/>
											</Grid.Col>
											<Grid.Col span={2}>
												<SegmentedControl
													styles={{
														label: { color: "white" },
													}}
													bg={"green.6"}
													withItemsBorders={false}
													fullWidth
													color="green.4"
													value={value}
													onChange={setValue}
													data={[
														{
															label: (
																<Center style={{ gap: 10 }}>
																	<IconLayoutGrid
																		height={"24"}
																		width={"24"}
																		stroke={1.5}
																	/>
																</Center>
															),
															value: "grid",
														},
														{
															label: (
																<Center style={{ gap: 10 }}>
																	<IconListDetails
																		height={"24"}
																		width={"24"}
																		stroke={1.5}
																	/>
																</Center>
															),
															value: "list",
														},
														{
															label: (
																<Center style={{ gap: 10 }}>
																	<IconBaselineDensitySmall
																		height={"24"}
																		width={"24"}
																		stroke={1.5}
																	/>
																</Center>
															),
															value: "minimal",
														},
													]}
												/>
											</Grid.Col>
										</Grid>
									</Box>
									<Box
										bg="white"
										w={"100%"}
										h={enableTable ? height - 22 : height + 141}
										mt={4}
										className="border-radius"
									>
										<ScrollArea
											h={enableTable ? height - 22 : height + 141}
											type="never"
											pt={"8"}
											pl={"xs"}
											pr={"xs"}
											pb={"6"}
											scrollbars="y"
										>
											{value === "grid" && (
												<Grid columns={12} gutter={{ base: 8 }}>
													{products.length > 0 ? (
														products?.map((product) => (
															<Grid.Col span={3} key={product.id}>
																<Card
																	shadow="md"
																	radius="md"
																	padding="xs"
																	styles={() => ({
																		root: {
																			cursor: "pointer",
																			transition:
																				"transform 0.5s ease-in-out",
																			transform:
																				selected.includes(
																					product.id
																				)
																					? "scale(0.97)"
																					: undefined,
																			border: selected.includes(
																				product.id
																			)
																				? "3px solid green.8"
																				: "3px solid white",
																		},
																	})}
																	onClick={(e) => {
																		e.preventDefault();
																		e.stopPropagation();
																		handleSelect(product.id);
																		handleIncrement(product.id);
																	}}
																>
																	<Image
																		radius="sm"
																		mih={120}
																		mah={120}
																		w="auto"
																		fit="cover"
																		src={`${
																			import.meta.env
																				.VITE_IMAGE_GATEWAY_URL
																		}/uploads/inventory/product/feature_image/${
																			product.feature_image
																		}`}
																		fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
																			product.display_name
																		)}`}
																	/>
																	<Text
																		fw={600}
																		size="sm"
																		fz={"13"}
																		mt={"4"}
																		ta={"left"}
																	>
																		{product.display_name}
																	</Text>

																	<Text
																		styles={{
																			root: {
																				marginTop: "auto",
																			},
																		}}
																		ta={"right"}
																		fw={900}
																		fz={"18"}
																		size="md"
																		c={"green.9"}
																	>
																		{
																			configData?.currency
																				?.symbol
																		}{" "}
																		{product.sales_price}
																	</Text>
																</Card>
															</Grid.Col>
														))
													) : (
														<>
															<Flex
																m={"sm"}
																h={"100%"}
																w={"100%"}
																justify="center"
																align="center"
															>
																<Text
																	ta={"center"}
																	fw={"normal"}
																	fz={"md"}
																	c={"black"}
																>
																	No product found in this
																	category
																</Text>
															</Flex>
														</>
													)}
												</Grid>
											)}
											{value === "list" && (
												<Grid columns={12} gutter={8}>
													{products.length > 0 ? (
														products?.map((product) => (
															<Grid.Col key={product.id} span={6}>
																<Card
																	shadow="md"
																	radius="md"
																	styles={() => ({
																		root: {
																			cursor: "pointer",
																			transform:
																				selected.includes(
																					product.id
																				)
																					? "scale(0.97)"
																					: undefined,
																			border: selected.includes(
																				product.id
																			)
																				? "3px solid #00542b"
																				: "3px solid #eaeced",
																		},
																	})}
																	padding="xs"
																	onClick={() => {
																		handleSelect(product.id);
																		handleIncrement(product.id);
																	}}
																>
																	<Grid columns={12}>
																		<Grid.Col span={6}>
																			<Card p={0}>
																				<Image
																					mih={120}
																					mah={120}
																					miw={70}
																					fit="cover"
																					src={`${
																						import.meta
																							.env
																							.VITE_IMAGE_GATEWAY_URL
																					}/uploads/inventory/product/feature_image/${
																						product.feature_image
																					}`}
																					fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
																						product.display_name
																					)}`}
																				/>
																			</Card>
																		</Grid.Col>
																		<Grid.Col span={6}>
																			<Stack
																				radius="md"
																				mih={"118"}
																				bg="var(--mantine-color-body)"
																				align="stretch"
																				justify="space-between"
																				gap="md"
																			>
																				<Text
																					fw={600}
																					size="sm"
																					fz={"13"}
																					mt={"4"}
																				>
																					{
																						product.display_name
																					}
																				</Text>
																				<Flex
																					gap="md"
																					justify="flex-end"
																					align="flex-end"
																					direction="row"
																					wrap="nowrap"
																				>
																					<Text
																						ta={"right"}
																						fw={900}
																						fz={"18"}
																						size="md"
																						c={
																							"green.9"
																						}
																					>
																						{
																							configData
																								?.currency
																								?.symbol
																						}{" "}
																						{
																							product.sales_price
																						}
																					</Text>
																				</Flex>
																			</Stack>
																		</Grid.Col>
																	</Grid>
																</Card>
															</Grid.Col>
														))
													) : (
														<>
															<Flex
																m={"sm"}
																h={"100%"}
																w={"100%"}
																justify="center"
																align="center"
															>
																<Text
																	ta={"center"}
																	fw={"normal"}
																	fz={"md"}
																	c={"black"}
																>
																	No product found in this
																	category
																</Text>
															</Flex>
														</>
													)}
												</Grid>
											)}
											{value === "minimal" && (
												<>
													<DataTable
														classNames={{
															root: tableCss.root,
															table: tableCss.table,
															header: tableCss.header,
															footer: tableCss.footer,
															pagination: tableCss.pagination,
														}}
														records={products}
														columns={[
															{
																accessor: "id",
																title: "S/N",
																render: (data, index) => index + 1,
															},
															{
																accessor: "display_name",
																title: t("Product"),
															},
															{
																accessor: "price",
																title: t("Price"),
																textAlign: "center",
																render: (data) => (
																	<>
																		{
																			configData?.currency
																				?.symbol
																		}{" "}
																		{data.sales_price}
																	</>
																),
															},
															{
																accessor: "qty",
																title: t("Qty"),
																textAlign: "center",
																backgroundColor: "blue",
																render: (data) => (
																	<Group
																		gap={8}
																		justify="center"
																		align="center"
																	>
																		<ActionIcon
																			size={"sm"}
																			bg={"gray.7"}
																			onClick={() =>
																				handleDecrement(
																					data.id
																				)
																			}
																		>
																			<IconMinus
																				height={"12"}
																				width={"12"}
																			/>
																		</ActionIcon>
																		<Text
																			size="sm"
																			ta={"center"}
																			fw={600}
																			maw={30}
																			miw={30}
																		>
																			{}
																		</Text>
																		<ActionIcon
																			size={"sm"}
																			bg={"gray.7"}
																			onClick={() => {
																				handleIncrement(
																					data.id
																				);
																			}}
																		>
																			<IconPlus
																				height={"12"}
																				width={"12"}
																			/>
																		</ActionIcon>
																	</Group>
																),
															},
														]}
														loaderSize="xs"
														loaderColor="grape"
														height={height - 30}
														scrollAreaProps={{ type: "never" }}
													/>
												</>
											)}
										</ScrollArea>
									</Box>
								</Stack>
							</Grid.Col>
						</Grid>
						{enableTable && renderStatusButtons()}
					</Grid.Col>
				) : (
					<Grid.Col span={8}>
						<Invoice
							setInvoiceData={setInvoiceData}
							products={products}
							tableId={tableId}
							tables={tables}
							setTables={setTables}
							setLoadCartProducts={setLoadCartProducts}
							tableCustomerMap={tableCustomerMap}
							updateTableCustomer={updateTableCustomer}
							clearTableCustomer={clearTableCustomer}
							customerObject={customerObject}
							setCustomerObject={setCustomerObject}
							loadCartProducts={loadCartProducts}
							updateTableSplitPayment={updateTableSplitPayment}
							clearTableSplitPayment={clearTableSplitPayment}
							tableSplitPaymentMap={tableSplitPaymentMap}
							invoiceMode={invoiceMode}
							invoiceData={invoiceData}
							reloadInvoiceData={reloadInvoiceData}
							setReloadInvoiceData={setReloadInvoiceData}
							setTableId={setTableId}
						/>
					</Grid.Col>
				)}
			</Grid>
		</>
	);
}
