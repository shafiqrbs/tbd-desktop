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
	IconCurrency,
	IconScissors,
	IconX,
	IconChevronLeft,
	IconChevronRight,
	IconTicket,
	IconCurrencyTaka,
	IconPercentage,
	IconUserPlus,
} from "@tabler/icons-react";
import classes from "./css/Invoice.module.css";
import { useDispatch } from "react-redux";
import { storeEntityData } from "../../../../store/core/crudSlice.js";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";

export default function ActionButtons({
	form,
	transactionModeData,
	transactionModeId,
	handleTransactionModel,
	isOnline,
	invoiceData,
	configData,
	discountType,
	t,
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
	tableId,
	currentTableKey,
	isThisTableSplitPaymentActive,
	clearTableSplitPayment,
	isSplitPaymentActive,
	currentPaymentInput,
	setCurrentPaymentInput,
	setTableReceiveAmounts,
	setSalesDueAmount,
	setReturnOrDueText,
	customerObject,
	handleCustomerAdd,
	enableCoupon,
	setEnableCoupon,
	isDisabled,
	handleSave,
	scrollRef,
	handleScroll,
	showLeftArrow,
	showRightArrow,
	scroll,
	setDisabledDiscountButton,
}) {
	const dispatch = useDispatch();

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
						<Grid.Col span={7}>
							<Stack gap={0}>
								<Group justify="space-between" gap={0}>
									<Text fz={"sm"} fw={500} c={"black"}>
										{t("DIS.")}
									</Text>
									<Text fz={"sm"} fw={800} c={"black"}>
										{configData?.currency?.symbol} {invoiceData?.discount || 0}
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
						<Grid.Col span={5}>
							<Group justify="space-between">
								<Text fz={"sm"} fw={500} c={"black"}>
									{t("VAT")}{" "}
									{configData?.inventory_config?.config_vat?.vat_percent}%
								</Text>
								<Text fz={"sm"} fw={800} c={"black"}>
									{parseInt(
										salesTotalAmount *
											(configData?.inventory_config?.config_vat?.vat_percent /
												100)
									)}
								</Text>
							</Group>
							<Group justify="space-between">
								<Text fz={"sm"} fw={500} c={"black"}>
									{t("SD")}
								</Text>
								<Text fz={"sm"} fw={800} c={"black"}>
									{configData?.currency?.symbol} 0
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
							{configData?.currency?.symbol}{" "}
							{salesTotalWithoutDiscountAmount.toFixed(2)}
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
							{configData?.currency?.symbol} {salesDueAmount.toFixed(2)}
						</Text>
						<Text fw={500} c={"white"} size={"md"}>
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
					border:
						form.errors.transaction_mode_id && !transactionModeId
							? "1px solid red"
							: "none",
				}}
			>
				<Grid.Col span={21} className={classes["box-border"]}>
					<Box mr={4} style={{ position: "relative" }}>
						<ScrollArea
							type="never"
							pl={"1"}
							pr={"2"}
							viewportRef={scrollRef}
							onScrollPositionChange={handleScroll}
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
								<Group
									m={0}
									pt={8}
									pb={8}
									justify="flex-start"
									align="flex-start"
									gap="0"
									wrap="nowrap"
								>
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
												bg={
													mode.id === transactionModeId
														? "green.8"
														: "white"
												}
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
														src={
															isOnline
																? mode.path
																: `./transactions/${mode.name}.jpg`
														}
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
							name={
								isThisTableSplitPaymentActive ? "clearSplitPayment" : "splitPayment"
							}
							size="xl"
							bg={isThisTableSplitPaymentActive ? "red.6" : "gray.8"}
							variant="filled"
							aria-label="Settings"
							onClick={(e) => {
								if (isThisTableSplitPaymentActive) {
									clearTableSplitPayment();
								} else {
									handleClick(e);
								}
							}}
						>
							{isThisTableSplitPaymentActive ? (
								<IconX style={{ width: "70%", height: "70%" }} stroke={1.5} />
							) : (
								<IconScissors
									style={{ width: "70%", height: "70%" }}
									stroke={1.5}
								/>
							)}
						</ActionIcon>
					</Tooltip>
				</Grid.Col>
			</Grid>
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
										{customerObject && customerObject.name
											? customerObject.name
											: t("Customer")}
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
									enableCoupon === "Coupon"
										? setEnableCoupon("Discount")
										: setEnableCoupon("Coupon")
								}
								variant="filled"
								fz={"xs"}
								leftSection={
									enableCoupon === "Coupon" ? (
										<IconTicket size={14} />
									) : (
										<IconPercentage size={14} />
									)
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
											onClick={async () => {
												setDisabledDiscountButton(true);
												const newDiscountType =
													discountType === "Percent" ? "Flat" : "Percent";
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
														const resultAction = await dispatch(
															storeEntityData(data)
														);

														if (resultAction.payload?.status !== 200) {
															showNotificationComponent(
																resultAction.payload?.message ||
																	"Error updating invoice",
																"red",
																"",
																"",
																true
															);
														} else {
															await window.dbAPI.updateDataInTable(
																"invoice_table",
																{
																	id: tableId,
																	data: {
																		discount_type:
																			newDiscountType,
																		discount_amount:
																			currentDiscountValue,
																	},
																}
															);
														}
													}
												} catch (error) {
													showNotificationComponent(
														"Request failed. Please try again.",
														"red",
														"",
														"",
														true
													);
													console.error("Error updating invoice:", error);
												} finally {
													setReloadInvoiceData(true);
													setTimeout(() => {
														setDisabledDiscountButton(false);
													}, 500);
												}
											}}
										>
											{discountType === "Flat" ? (
												<IconCurrencyTaka size={16} />
											) : (
												<IconPercentage size={16} />
											)}
										</ActionIcon>
									}
									onBlur={async (event) => {
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
												const resultAction = await dispatch(
													storeEntityData(data)
												);

												if (resultAction.payload?.status !== 200) {
													showNotificationComponent(
														resultAction.payload?.message ||
															"Error updating invoice",
														"red",
														"",
														"",
														true
													);
												}
											} else {
												await window.dbAPI.updateDataInTable(
													"invoice_table",
													{
														id: tableId,
														data: {
															discount: event.target.value,
															discount_type: discountType,
														},
													}
												);
											}
										} catch (error) {
											showNotificationComponent(
												"Request failed. Please try again.",
												"red",
												"",
												"",
												true
											);
											console.error("Error updating invoice:", error);
										} finally {
											setReloadInvoiceData(true);
										}
									}}
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
							bg={"#90e0ef"}
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
								placeholder={
									isThisTableSplitPaymentActive
										? t("SplitPaymentActive")
										: t("Amount")
								}
								value={currentPaymentInput}
								error={form.errors.receive_amount}
								size={"sm"}
								disabled={isThisTableSplitPaymentActive}
								rightSection={
									<>
										{form.values.receive_amount ? (
											<Tooltip
												label={t("Close")}
												withArrow
												bg={`red.1`}
												c={"red.3"}
											>
												<IconX
													size={16}
													color={"red"}
													opacity={1}
													onClick={() => {
														form.setFieldValue("receive_amount", "");
														setTableReceiveAmounts((prev) => {
															const updated = {
																...prev,
															};
															delete updated[currentTableKey];
															return updated;
														});
														if (isThisTableSplitPaymentActive) {
															clearTableSplitPayment(currentTableKey);
														}
													}}
												/>
											</Tooltip>
										) : isSplitPaymentActive ? (
											<Tooltip
												label={t("SplitPaymentActive")}
												withArrow
												position={"left"}
											>
												<IconScissors size={16} opacity={0.7} />
											</Tooltip>
										) : (
											<Tooltip
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
												label={t("ReceiveAmountValidateMessage")}
											>
												<IconCurrency size={16} opacity={0.5} />
											</Tooltip>
										)}
									</>
								}
								leftSection={<IconPlusMinus size={16} opacity={0.5} />}
								classNames={{ input: classes.input }}
								onChange={async (event) => {
									if (!isThisTableSplitPaymentActive) {
										const newValue = event.target.value;
										setCurrentPaymentInput(newValue);
										form.setFieldValue("receive_amount", newValue);

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
										setReturnOrDueText(
											totalAmount < receiveAmount ? "Return" : "Due"
										);

										// Update the database
										if (!isOnline) {
											await window.dbAPI.updateDataInTable("invoice_table", {
												id: tableId,
												data: {
													payment: newValue,
												},
											});
										}
									}
								}}
								onBlur={async (event) => {
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
												const resultAction = await dispatch(
													storeEntityData(data)
												);

												if (resultAction.payload?.status !== 200) {
													showNotificationComponent(
														resultAction.payload?.message ||
															"Error updating invoice",
														"red",
														"",
														"",
														true
													);
												}
											} else {
												await window.dbAPI.updateDataInTable(
													"invoice_table",
													{
														id: tableId,
														data: {
															payment: newValue,
														},
													}
												);
											}
										} catch (error) {
											showNotificationComponent(
												"Request failed. Please try again.",
												"red",
												"",
												"",
												true
											);
											console.error("Error updating invoice:", error);
										} finally {
											setReloadInvoiceData(true);
										}
									}
								}}
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
						<Button
							bg={"white"}
							variant="outline"
							c={"black"}
							color="gray"
							size={"lg"}
							fullWidth={true}
						>
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
