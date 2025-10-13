import {
	Stack,
	Grid,
	Box,
	ScrollArea,
	ActionIcon,
	Flex,
	Image,
	TextInput,
	Button,
	Tooltip,
	Text,
	Group,
} from "@mantine/core";
import {
	IconDeviceFloppy,
	IconPrinter,
	IconPlusMinus,
	IconScissors,
	IconX,
	IconChevronLeft,
	IconChevronRight,
	IconTicket,
	IconCurrencyTaka,
	IconPercentage,
	IconUserPlus,
	IconChefHat,
} from "@tabler/icons-react";
import classes from "./css/Invoice.module.css";
import { useDispatch } from "react-redux";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { useScroll } from "./utils/ScrollOperations.jsx";
import { useTranslation } from "react-i18next";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import { useOutletContext } from "react-router";
import { calculateVATAmount } from "../../../../lib/index.js";
import { useEffect, useState } from "react";
import SelectForm from "../../../form-builders/SelectForm";

export default function ActionButtons({
	form,
	salesByUser,
	setSalesByUser,
	transactionModeData,
	transactionModeId,
	handleTransactionModel,
	invoiceData,
	discountType,
	enableTable,
	handleClick,
	salesTotalAmount,
	salesTotalWithoutDiscountAmount,
	salesDueAmount,
	returnOrDueText,
	salesDiscountAmount,
	setSalesDiscountAmount,
	setDiscountType,
	setReloadInvoiceData,
	setInvoiceData,
	tableId,
	currentTableKey,
	isThisTableSplitPaymentActive,
	clearTableSplitPayment,
	currentPaymentInput,
	setCurrentPaymentInput,
	setTableReceiveAmounts,
	setSalesDueAmount,
	setReturnOrDueText,
	customerObject,
	handleCustomerAdd,
	isDisabled,
	handleSave,
}) {
	const { configData } = getConfigData();
	const { isOnline } = useOutletContext();
	const dispatch = useDispatch();
	const { scrollRef, showLeftArrow, showRightArrow, handleScroll, scroll } = useScroll();
	const { t } = useTranslation();
	const [enableCoupon, setEnableCoupon] = useState("Coupon");
	const [disabledDiscountButton, setDisabledDiscountButton] = useState(false);
	const [salesByDropdownData, setSalesByDropdownData] = useState([]);

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
		fetchData();
	}, []);

	// =============== utility function to determine kitchen products ================
	const getKitchenProducts = (items) => {
		if (!items || items.length === 0) return [];

		return items.filter((item) => {
			if (!item || item.quantity <= 0) return false;

			// =============== for now, we'll consider all products as kitchen items ================
			return true;
		});
	};

	const handleDiscount = async () => {
		setDisabledDiscountButton(true);
		const newDiscountType = discountType === "Percent" ? "Flat" : "Percent";
		setDiscountType(newDiscountType);
		const currentDiscountValue = salesDiscountAmount;

		const data = {
			url: "inventory/pos/inline-update",
			data: {
				invoice_id: tableId,
				field_name: "discount_type",
				value: newDiscountType,
				discount_amount: currentDiscountValue,
			},
			module: "pos",
		};

		setSalesDiscountAmount(currentDiscountValue);

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
				} else {
					await window.dbAPI.updateDataInTable("invoice_table", {
						id: tableId,
						data: {
							discount_type: newDiscountType,
							discount_amount: currentDiscountValue,
						},
					});
				}
			}
		} catch (error) {
			showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
			console.error("Error updating invoice:", error);
		} finally {
			setReloadInvoiceData(true);
			setTimeout(() => {
				setDisabledDiscountButton(false);
			}, 500);
		}
	};

	const handleDiscountBlur = async (event) => {
		const data = {
			url: "inventory/pos/inline-update",
			data: {
				invoice_id: tableId,
				field_name: "discount",
				value: event.target.value,
				discount_type: discountType,
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
						discount: event.target.value,
						discount_type: discountType,
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

	const handlePaymentChange = async (event) => {
		if (!isThisTableSplitPaymentActive) {
			const newValue = event.target.value;
			setCurrentPaymentInput(newValue);
			form.setFieldValue("receive_amount", newValue);

			setInvoiceData((prev) => ({ ...prev, payment: newValue }));

			// Only update table receive amounts, don't trigger immediate calculations
			setTableReceiveAmounts((prev) => ({
				...prev,
				[currentTableKey]: newValue,
			}));

			// Calculate due amount immediately for display
			const totalAmount = salesTotalAmount - salesDiscountAmount;
			const receiveAmount = Number(newValue) || 0;
			const dueAmount = totalAmount - receiveAmount;
			setSalesDueAmount(dueAmount);
			setReturnOrDueText(totalAmount < receiveAmount ? "Return" : "Due");

			// Update the database
			if (!isOnline) {
				await window.dbAPI.updateDataInTable("invoice_table", {
					id: tableId,
					data: {
						payment: newValue === "" ? null : newValue,
					},
				});
			}
		}
	};

	const handlePaymentBlur = async (event) => {
		if (!isThisTableSplitPaymentActive) {
			const newValue = event.target.value;

			const data = {
				url: "inventory/pos/inline-update",
				data: {
					invoice_id: tableId,
					field_name: "amount",
					value: newValue,
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
					await window.dbAPI.updateDataInTable("invoice_table", {
						id: tableId,
						data: {
							payment: newValue === "" ? null : newValue,
						},
					});
				}
			} catch (error) {
				showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
				console.error("Error updating invoice:", error);
			} finally {
				setReloadInvoiceData(true);
			}
		}
	};

	const handlePrintAll = async () => {
		// =============== first save the sale ================
		await handleSave({ withPos: false });

		// =============== then handle kitchen printing ================
		if (invoiceData?.invoice_items?.length > 0) {
			// =============== determine kitchen products based on category or product type ================
			const kitchenProducts = getKitchenProducts(invoiceData.invoice_items);

			if (kitchenProducts.length > 0) {
				// =============== trigger kitchen print ================
				// =============== this will open the kitchen print drawer ================
				handleClick({ currentTarget: { name: "kitchen" } });
			}
		}
	};

	return (
		<Stack align="stretch" justify={"center"} mt={6} gap={4} pl={4} pr={2} mb={0}>
			<Grid
				columns={12}
				gutter={4}
				justify="center"
				align="center"
				className={classes["box-white"]}
				pb={4}
				bg={"gray.0"}
			>
				<Grid.Col span={6} pl={4} pr={4}>
					<Grid bg={"gray.0"} pl={4} pr={4}>
						<Grid.Col span={6}>
							<Stack gap={0}>
								<Group justify="space-between" gap={0}>
									<Text fz={"sm"} fw={500} c={"black"}>
										{t("DIS.")}
									</Text>
									<Text fz={"sm"} fw={800} c={"black"}>
										{configData?.inventory_config?.currency?.symbol} {invoiceData?.discount || 0}
									</Text>
								</Group>
								<Group justify="space-between">
									<Text fz={"sm"} fw={500} c={"black"}>
										{t("Type")}
									</Text>
									<Text fz={"sm"} fw={800} c={"black"}>
										{discountType === "Flat" ? t("Flat") : t("Percent")}
									</Text>
								</Group>
							</Stack>
						</Grid.Col>
						<Grid.Col span={6}>
							<Group justify="space-between">
								<Text fz={"sm"} fw={500} c={"black"}>
									{t("VAT")} {configData?.inventory_config?.config_vat?.vat_percent}%
								</Text>
								<Text fz={"sm"} fw={800} c={"black"}>
									{calculateVATAmount(
										salesTotalWithoutDiscountAmount,
										configData?.inventory_config?.config_vat
									)}
								</Text>
							</Group>
							<Group justify="space-between">
								<Text fz={"sm"} fw={500} c={"black"}>
									{t("SD")}
								</Text>
								<Text fz={"sm"} fw={800} c={"black"}>
									{configData?.inventory_config?.currency?.symbol} 0
								</Text>
							</Group>
						</Grid.Col>
					</Grid>
				</Grid.Col>
				<Grid.Col span={3}>
					<Stack
						gap={0}
						className={classes["box-border"]}
						align="center"
						justify="center"
						bg={"gray.8"}
						pt={4}
						pb={4}
					>
						<Text fw={800} c={"white"} size={"lg"}>
							{configData?.inventory_config?.currency?.symbol}{" "}
							{salesTotalWithoutDiscountAmount ? salesTotalWithoutDiscountAmount.toFixed(2) : 0.0}
						</Text>
						<Text fw={500} c={"white"} size={"md"}>
							{t("Total")}
						</Text>
					</Stack>
				</Grid.Col>
				<Grid.Col span={3}>
					<Stack
						gap={0}
						className={classes["box-border"]}
						align="center"
						justify="center"
						bg={"red"}
						pt={4}
						pb={4}
					>
						<Text fw={800} c={"white"} size={"lg"}>
							{configData?.inventory_config?.currency?.symbol}{" "}
							{salesDueAmount ? salesDueAmount.toFixed(2) : 0.0}
						</Text>
						<Text fw={500} c="white" size="md">
							{returnOrDueText === "Due" ? t("Due") : t("Return")}
						</Text>
					</Stack>
				</Grid.Col>
			</Grid>
			<Grid
				columns={24}
				gutter={2}
				align="center"
				justify="center"
				className={classes["box-border"]}
				mb={4}
				style={{
					borderRadius: 4,
					border: form.errors.transaction_mode_id && !transactionModeId ? "1px solid red" : "none",
				}}
			>
				<Grid.Col span={21} className={classes["box-border"]}>
					<Box mr={4} style={{ position: "relative" }}>
						<ScrollArea
							type="never"
							pl={"1"}
							scrollbars="x"
							pr={"2"}
							viewportRef={scrollRef}
							onScrollPositionChange={handleScroll}
							w={450}
						>
							<Tooltip
								label={t("TransactionMode")}
								opened={!!form.errors.transaction_mode_id}
								px={16}
								py={2}
								bg={"orange.8"}
								c={"white"}
								withArrow
								offset={{ mainAxis: 5, crossAxis: -364 }}
								zIndex={999}
								transitionProps={{
									transition: "pop-bottom-left",
									duration: 500,
								}}
							>
								<Group m={0} py={8} justify="flex-start" align="flex-start" gap="0" wrap="nowrap">
									{transactionModeData.map((mode, index) => (
										<Box
											onClick={() => {
												handleTransactionModel(mode.id, mode.name);
											}}
											key={index}
											p={4}
											style={{
												position: "relative",
												cursor: "pointer",
											}}
										>
											<Flex
												bg={mode.id === transactionModeId ? "green.8" : "white"}
												direction="column"
												align="center"
												justify="center"
												p={2}
												style={{
													color: "black",
												}}
											>
												<Tooltip
													label={mode.name}
													withArrow
													px={16}
													py={2}
													offset={2}
													zIndex={999}
													position="top"
													color="red"
												>
													<Image
														mih={48}
														mah={48}
														w={56}
														h={48}
														fit="fit"
														alt={mode.name}
														src={isOnline ? mode.path : `./transactions/${mode.name}.jpg`}
														fallbackSrc={`https://placehold.co/120x80/FFFFFF/2f9e44`}
													/>
												</Tooltip>
											</Flex>
										</Box>
									))}
								</Group>
							</Tooltip>
						</ScrollArea>

						{showLeftArrow && (
							<ActionIcon
								variant="filled"
								color="gray.2"
								radius="xl"
								size="lg"
								h={24}
								w={24}
								style={{
									position: "absolute",
									left: 5,
									top: "50%",
									transform: "translateY(-50%)",
								}}
								onClick={() => scroll("left")}
							>
								<IconChevronLeft height={18} width={18} stroke={2} color="black" />
							</ActionIcon>
						)}
						{showRightArrow && (
							<ActionIcon
								variant="filled"
								color="gray.2"
								radius="xl"
								size="lg"
								h={24}
								w={24}
								style={{
									position: "absolute",
									right: 5,
									top: "50%",
									transform: "translateY(-50%)",
								}}
								onClick={() => scroll("right")}
							>
								<IconChevronRight height={18} width={18} stroke={2} color="black" />
							</ActionIcon>
						)}
					</Box>
				</Grid.Col>
				<Grid.Col span={3} style={{ textAlign: "right" }} pr={"8"}>
					<Tooltip
						label={t("TransactionMode")}
						px={16}
						py={2}
						bg={"gry.8"}
						c={"white"}
						withArrow
						zIndex={999}
						transitionProps={{
							transition: "pop-bottom-left",
							duration: 500,
						}}
					>
						<ActionIcon
							name={isThisTableSplitPaymentActive ? "clearSplitPayment" : "splitPayment"}
							size="xl"
							bg={isThisTableSplitPaymentActive ? "red.6" : "gray.8"}
							variant="filled"
							aria-label="Settings"
							onClick={(e) => {
								if (isThisTableSplitPaymentActive) {
									clearTableSplitPayment(currentTableKey);
								} else {
									handleClick(e);
								}
							}}
						>
							{isThisTableSplitPaymentActive ? (
								<IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
							) : (
								<IconScissors style={{ width: "70%", height: "70%" }} stroke={1.5} />
							)}
						</ActionIcon>
					</Tooltip>
				</Grid.Col>
			</Grid>
			<Group gap={6} mb={4} preventGrowOverflow={false} grow align="center" wrap="nowrap">
				<SelectForm
					pt="4"
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
					style={{ width: "100%" }}
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
							mt={4}
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
			<Box m={0} mb={"12"}>
				<Grid columns={24} gutter={{ base: 8 }} pr={"2"} align="center" justify="center">
					<Grid.Col span={6}>
						<Tooltip
							label={t("ChooseCustomer")}
							opened={!!form.errors.customer_id}
							bg={"orange.8"}
							c={"white"}
							withArrow
							px={16}
							py={2}
							offset={2}
							zIndex={999}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								disabled={!tableId}
								fullWidth
								size="sm"
								color="#0077b6"
								leftSection={
									customerObject && customerObject.name ? (
										<></>
									) : (
										<IconUserPlus height={14} width={14} stroke={2} />
									)
								}
								onClick={handleCustomerAdd}
							>
								<Stack gap={0}>
									<Text fw={600} size="xs">
										{customerObject && customerObject.name ? customerObject.name : t("Customer")}
									</Text>
									<Text size="xs">{customerObject && customerObject.mobile}</Text>
								</Stack>
							</Button>
						</Tooltip>
					</Grid.Col>
					<Grid.Col span={6}>
						<Tooltip
							label={t("ClickRightButtonForPercentFlat")}
							px={16}
							py={2}
							position="top"
							bg={"red.4"}
							c={"white"}
							withArrow
							offset={2}
							zIndex={999}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								fullWidth={true}
								onClick={() =>
									enableCoupon === "Coupon" ? setEnableCoupon("Discount") : setEnableCoupon("Coupon")
								}
								variant="filled"
								fz={"xs"}
								leftSection={
									enableCoupon === "Coupon" ? <IconTicket size={14} /> : <IconPercentage size={14} />
								}
								color="gray"
							>
								{enableCoupon === "Coupon" ? t("Coupon") : t("Discount")}
							</Button>
						</Tooltip>
					</Grid.Col>
					<Grid.Col span={6} bg={"red.3"}>
						{enableCoupon === "Coupon" ? (
							<TextInput
								type="text"
								placeholder={t("CouponCode")}
								value={form.values.coupon_code}
								error={form.errors.coupon_code}
								size={"sm"}
								classNames={{ input: classes.input }}
								onChange={(event) => {
									form.setFieldValue("coupon_code", event.target.value);
								}}
								rightSection={
									<>
										<Tooltip
											label={t("CouponCode")}
											px={16}
											py={2}
											withArrow
											position={"left"}
											c={"black"}
											bg={`gray.1`}
											transitionProps={{
												transition: "pop-bottom-left",
												duration: 500,
											}}
										>
											<IconTicket size={16} opacity={0.5} />
										</Tooltip>
									</>
								}
							/>
						) : (
							<Tooltip
								label={t("ClickRightButtonForPercentFlat")}
								px={16}
								py={2}
								position="top"
								bg={"red.4"}
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
									style={{ textAlign: "right" }}
									placeholder={t("Discount")}
									value={salesDiscountAmount}
									error={form.errors.discount}
									size={"sm"}
									classNames={{ input: classes.input }}
									onChange={(event) => {
										form.setFieldValue("discount", event.target.value);
										const newValue = event.target.value;
										setSalesDiscountAmount(newValue);
										form.setFieldValue("discount", newValue);
									}}
									rightSection={
										<ActionIcon
											size={32}
											bg={"red.5"}
											variant="filled"
											onClick={handleDiscount}
											disabled={disabledDiscountButton}
										>
											{discountType === "Flat" ? (
												<IconCurrencyTaka size={16} />
											) : (
												<IconPercentage size={16} />
											)}
										</ActionIcon>
									}
									onBlur={handleDiscountBlur}
								/>
							</Tooltip>
						)}
					</Grid.Col>
					<Grid.Col span={6} bg={"green"}>
						<Tooltip
							label={t("ReceiveAmountValidateMessage")}
							opened={!!form.errors.receive_amount}
							px={16}
							py={2}
							position="top-end"
							bg="#90e0ef"
							c="white"
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
								placeholder={isThisTableSplitPaymentActive ? t("SplitPaymentActive") : t("Amount")}
								value={currentPaymentInput}
								error={form.errors.receive_amount}
								size={"sm"}
								disabled={isThisTableSplitPaymentActive}
								leftSection={<IconPlusMinus size={16} opacity={0.5} />}
								classNames={{ input: classes.input }}
								onChange={handlePaymentChange}
								onBlur={handlePaymentBlur}
							/>
						</Tooltip>
					</Grid.Col>
				</Grid>
			</Box>
			<Grid columns={12} gutter={{ base: 2 }}>
				<Grid.Col span={enableTable ? 3 : 4}>
					<Tooltip
						label={t("Hold")}
						px={16}
						py={2}
						color="red"
						withArrow
						offset={2}
						zIndex={100}
						transitionProps={{
							transition: "pop-bottom-left",
							duration: 2000,
						}}
					>
						<Button bg={"white"} variant="outline" c={"black"} color="gray" size={"lg"} fullWidth={true}>
							<Text size="md">{t("Hold")}</Text>
						</Button>
					</Tooltip>
				</Grid.Col>
				{enableTable && (
					<Grid.Col span={3}>
						<Tooltip
							label={t("PrintAll")}
							px={16}
							py={2}
							color="red"
							withArrow
							offset={2}
							zIndex={100}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 2000,
							}}
						>
							<Button
								disabled={isDisabled}
								bg={"white"}
								variant="outline"
								c={"black"}
								color="gray"
								size={"lg"}
								fullWidth={true}
								onClick={handlePrintAll}
							>
								<Text size="md">{t("AllPrint")}</Text>
							</Button>
						</Tooltip>
					</Grid.Col>
				)}
				<Grid.Col span={enableTable ? 3 : 4}>
					<Button
						disabled={isDisabled}
						bg={"#264653"}
						c={"white"}
						size={"lg"}
						fullWidth={true}
						leftSection={<IconPrinter />}
						onClick={() => handleSave({ withPos: true })}
					>
						{t("Pos")}
					</Button>
				</Grid.Col>
				<Grid.Col span={enableTable ? 3 : 4}>
					<Button
						size={"lg"}
						c={"white"}
						bg={"#38b000"}
						fullWidth={true}
						leftSection={<IconDeviceFloppy />}
						onClick={() => handleSave({ withPos: false })}
					>
						{t("Save")}
					</Button>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}
