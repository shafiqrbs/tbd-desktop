import { useNavigate } from "react-router";
import {
	rem,
	Text,
	Card,
	SimpleGrid,
	Container,
	useMantineTheme,
	List,
	ThemeIcon,
	ScrollArea,
	Grid,
	NavLink,
	Box,
	Title,
	Divider,
	Image,
	Tooltip,
} from "@mantine/core";
import {
	IconUsers,
	IconUsersGroup,
	IconBuildingStore,
	IconBasket,
	IconShoppingCartUp,
	IconShoppingBagSearch,
	IconCurrencyMonero,
	IconShoppingBagPlus,
	IconMoneybag,
	IconListDetails,
	IconCategory,
	IconCategory2,
	IconShoppingCart,
	IconShoppingBag,
	IconList,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import classes from "../../../assets/css/FeaturesCards.module.css";
import pos from "../../../assets/images/pos/pos.png";

function MainDashboard(props) {
	const { configData } = props;
	const { t } = useTranslation();
	const height = props.height - 105;
	const navigate = useNavigate();
	const theme = useMantineTheme();

	return (
		<Container fluid mt={"xs"}>
			<SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs" mb={"xs"}>
				<Card shadow="md" radius="md" className={classes.card} padding="lg">
					<Grid gutter={{ base: 2 }}>
						<Grid.Col span={6}>
							<Tooltip
								label={t("PointOfSales")}
								withArrow
								position="top-center"
								bg={`red.4`}
								px={16}
								py={2}
								c={"white"}
								offset={2}
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<Image
									bg="#905a23"
									h={60}
									radius="sm"
									src={pos}
									fit="cover"
									w="100%"
									onClick={() => {
										navigate("/pos/bakery");
									}}
									style={{ cursor: "pointer" }}
								/>
							</Tooltip>
						</Grid.Col>
						<Grid.Col span={"6"}>
							<Title order={4} align="center" mt={0} mb={0}>
								{t("Sales")}
							</Title>
							<Divider my={5} />
							<Grid columns={18}>
								<Grid.Col span={8}>
									<Title order={5} align="right" mt={0} mb={0}>
										{configData?.currency?.symbol} 0.00
									</Title>
								</Grid.Col>
								<Grid.Col span={2}>
									<Box
										style={{
											border: "1px solid #e0e0e0",
											height: "100%",
											width: "2px",
										}}
									></Box>
								</Grid.Col>
								<Grid.Col span={8}>
									<Title order={5} align="left" mt={0} mb={0}>
										0
									</Title>
								</Grid.Col>
							</Grid>
						</Grid.Col>
					</Grid>
				</Card>

				<Card shadow="md" radius="md" className={classes.card} padding="lg">
					<Grid gutter={{ base: 2 }}>
						<Grid.Col span={2}>
							<IconMoneybag
								style={{ width: rem(42), height: rem(42) }}
								stroke={2}
								color={theme.colors.blue[6]}
							/>
						</Grid.Col>
						<Grid.Col span={10}>
							<Text fz="md" fw={500} className={classes.cardTitle}>
								{t("AccountingOverview")}
							</Text>
						</Grid.Col>
					</Grid>
				</Card>
				<Card shadow="md" radius="md" className={classes.card} padding="lg">
					<Grid gutter={{ base: 2 }}>
						<Grid.Col span={2}>
							<IconShoppingCart
								style={{ width: rem(42), height: rem(42) }}
								stroke={2}
								color={theme.colors.blue[6]}
							/>
						</Grid.Col>
						<Grid.Col span={10}>
							<Text fz="md" fw={500} className={classes.cardTitle}>
								{t("Procurement")}
							</Text>
						</Grid.Col>
					</Grid>
				</Card>
				<Card shadow="md" radius="md" className={classes.card} padding="lg">
					<Grid gutter={{ base: 2 }}>
						<Grid.Col span={2}>
							<IconMoneybag
								style={{ width: rem(42), height: rem(42) }}
								stroke={2}
								color={theme.colors.orange[6]}
							/>
						</Grid.Col>
						<Grid.Col span={10}>
							<Text fz="md" fw={500} className={classes.cardTitle}>
								{t("InventoryandProduct")}
							</Text>
						</Grid.Col>
					</Grid>
				</Card>
			</SimpleGrid>
			<ScrollArea h={height} scrollbarSize={2} type="never">
				<SimpleGrid cols={{ base: 1, md: 4 }} spacing="xs">
					{configData?.modules?.includes("sales-purchase") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconBuildingStore
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.teal[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("SalesandPurchase")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/sales"
											label={t("Sales")}
											component="button"
											onClick={() => {
												navigate("inventory/sales");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/sales", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBagSearch />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/sales-invoice"
											label={t("NewSales")}
											component="button"
											onClick={() => {
												navigate("inventory/sales-invoice");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/sales-invoice",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBagPlus />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/purchase"
											label={t("Purchase")}
											component="button"
											onClick={() => {
												navigate("inventory/purchase");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/purchase", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingCartUp />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/purchase-invoice"
											label={t("NewPurchase")}
											component="button"
											onClick={() => {
												navigate("inventory/purchase-invoice");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/purchase-invoice",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconList />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/invoice-batch"
											label={t("InvoiceBatch")}
											component="button"
											onClick={() => {
												navigate("inventory/invoice-batch");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/invoice-batch",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconList />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/opening-stock"
											label={t("OpeningStock")}
											component="button"
											onClick={() => {
												navigate("inventory/opening-stock");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/opening-stock",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="teal.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconList />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/opening-approve-stock"
											label={t("OpeningApprove")}
											component="button"
											onClick={() => {
												navigate("inventory/opening-approve-stock");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/opening-approve-stock",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}

					{configData?.modules?.includes("accounting") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconMoneybag
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.blue[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("AccountingandFinancial")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/voucher-entry"
											label={t("VoucherEntry")}
											component="button"
											onClick={() => {
												navigate("/accounting/voucher-entry");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/accounting/voucher-entry",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCurrencyMonero />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/accounting/transaction-mode"
											label={t("TransactionMode")}
											component="button"
											onClick={() => {
												navigate("accounting/transaction-mode");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/accounting/transaction-mode",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/ledger"
											label={t("Ledger")}
											component="button"
											onClick={() => {
												navigate("/accounting/ledger");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/accounting/ledger", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/head-group"
											label={t("HeadGroup")}
											component="button"
											onClick={() => {
												navigate("/accounting/head-group");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/accounting/head-group", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconBasket />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="accounting/head-subgroup"
											label={t("HeadSubGroup")}
											component="button"
											onClick={() => {
												navigate("/accounting/head-subgroup");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/accounting/head-subgroup",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}
					{configData?.modules?.includes("procurement") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconShoppingCart
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.blue[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("Procurement")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									{configData?.child_domain_exists && (
										<List.Item
											pl={"xs"}
											icon={
												<ThemeIcon
													color="blue.6"
													size={20}
													radius="xl"
													variant="outline"
												>
													<IconShoppingBag />
												</ThemeIcon>
											}
										>
											<NavLink
												pl={"md"}
												href="/procurement/requisition-board"
												label={t("AllRequisition")}
												component="button"
												onClick={() => {
													navigate("/procurement/requisition-board");
												}}
												onAuxClick={(e) => {
													// Handle middle mouse button click for browsers that support it
													if (e.button === 1) {
														window.open(
															"/procurement/requisition-board",
															"_blank"
														);
													}
												}}
											/>
										</List.Item>
									)}

									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBag />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/procurement/requisition"
											label={t("Requisition")}
											component="button"
											onClick={() => {
												navigate("/procurement/requisition");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/procurement/requisition",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBagPlus />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/procurement/new-requisition"
											label={t("NewRequisition")}
											component="button"
											onClick={() => {
												navigate("/procurement/new-requisition");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/procurement/new-requisition",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}
					{configData?.modules?.includes("inventory") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconMoneybag
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.orange[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("InventoryandProduct")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconListDetails />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/stock"
											label={t("ManageStock")}
											component="button"
											onClick={() => {
												navigate("inventory/stock");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/stock", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconListDetails />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/product"
											label={t("ManageProduct")}
											component="button"
											onClick={() => {
												navigate("inventory/product");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/product", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/category"
											label={t("Category")}
											component="button"
											onClick={() => {
												navigate("inventory/category");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/category", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/category-group"
											label={t("CategoryGroup")}
											component="button"
											onClick={() => {
												navigate("inventory/category-group");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/category-group",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/stock-transfer"
											label={t("StockTransfer")}
											component="button"
											onClick={() => {
												navigate("inventory/stock-transfer");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/stock-transfer",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/stock-reconciliation"
											label={t("StockReconciliation")}
											component="button"
											onClick={() => {
												navigate("inventory/stock-reconciliation");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/stock-reconciliation",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/coupon-code"
											label={t("CouponCode")}
											component="button"
											onClick={() => {
												navigate("inventory/coupon-code");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/coupon-code", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/barcode-print"
											label={t("BarcodePrint")}
											component="button"
											onClick={() => {
												navigate("inventory/barcode-print");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open(
														"/inventory/barcode-print",
														"_blank"
													);
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/particular"
											label={t("Particular")}
											component="button"
											onClick={() => {
												navigate("inventory/particular");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/particular", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="yellow.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCategory2 />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/inventory/config"
											label={t("Configuration")}
											component="button"
											onClick={() => {
												navigate("inventory/config");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/inventory/config", "_blank");
												}
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}
					{configData?.modules?.includes("domain") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconMoneybag
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.blue[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("ManageDomain")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="blue.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconCurrencyMonero />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/domain"
											label={t("ManageDomain")}
											component="button"
											onClick={() => {
												navigate("/domain");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/domain", "_blank");
												}
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}
					{configData?.modules?.includes("core") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconMoneybag
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.cyan[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("CustomerAndVendor")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="cyan.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconUsersGroup />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="core/customer"
											label={t("ManageCustomers")}
											component="button"
											onClick={() => {
												navigate("core/customer");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/core/customer", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="cyan.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconUsersGroup />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="core/vendor"
											label={t("ManageVendors")}
											component="button"
											onClick={() => {
												navigate("core/vendor");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/core/vendor", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="cyan.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconUsers />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="core/user"
											label={t("ManageUsers")}
											component="button"
											onClick={() => {
												navigate("core/user");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/core/user", "_blank");
												}
											}}
										/>
									</List.Item>

									{configData?.sku_warehouse == 1 && (
										<List.Item
											pl="xs"
											icon={
												<ThemeIcon
													color="cyan.6"
													size={20}
													radius="xl"
													variant="outline"
												>
													<IconUsers />
												</ThemeIcon>
											}
										>
											<NavLink
												pl="md"
												href="/core/warehouse"
												label={t("Warehouse")}
												component="button"
												onClick={() => navigate("/core/warehouse")}
												onAuxClick={(e) =>
													e.button === 1 &&
													window.open("/core/warehouse", "_blank")
												}
											/>
										</List.Item>
									)}

									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="cyan.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconUsers />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="core/file-upload"
											label={t("ManageFile")}
											component="button"
											onClick={() => {
												navigate("core/file-upload");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/core/file-upload", "_blank");
												}
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="cyan.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconUsers />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="core/setting"
											label={t("Setting")}
											component="button"
											onClick={() => {
												navigate("core/setting");
											}}
											onAuxClick={(e) => {
												// Handle middle mouse button click for browsers that support it
												if (e.button === 1) {
													window.open("/core/setting", "_blank");
												}
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}
					{configData?.modules?.includes("production") && (
						<Card shadow="md" radius="md" className={classes.card} padding="lg">
							<Grid gutter={{ base: 2 }}>
								<Grid.Col span={2}>
									<IconShoppingCart
										style={{ width: rem(42), height: rem(42) }}
										stroke={2}
										color={theme.colors.red[6]}
									/>
								</Grid.Col>
								<Grid.Col span={10}>
									<Text fz="md" fw={500} className={classes.cardTitle}>
										{t("Production")}
									</Text>
								</Grid.Col>
							</Grid>
							<Box fz="sm" c="dimmed" mt="sm">
								<List spacing="ms" size="sm" center>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="red.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBag />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/production/batch"
											label={t("ProductionBatch")}
											component="button"
											onClick={() => {
												navigate("/production/batch");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="red.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBag />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/production/batch/new"
											label={t("NewBatch")}
											component="button"
											onClick={() => {
												navigate("/production/batch/new");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="red.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBag />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/production/items"
											label={t("ProductionItems")}
											component="button"
											onClick={() => {
												navigate("/production/items");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="red.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBag />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/production/setting"
											label={t("ProductionSetting")}
											component="button"
											onClick={() => {
												navigate("/production/setting");
											}}
										/>
									</List.Item>
									<List.Item
										pl={"xs"}
										icon={
											<ThemeIcon
												color="red.6"
												size={20}
												radius="xl"
												variant="outline"
											>
												<IconShoppingBag />
											</ThemeIcon>
										}
									>
										<NavLink
											pl={"md"}
											href="/production/config"
											label={t("Configuration")}
											component="button"
											onClick={(e) => {
												navigate("/production/config");
											}}
										/>
									</List.Item>
								</List>
							</Box>
						</Card>
					)}
				</SimpleGrid>
			</ScrollArea>
		</Container>
	);
}

export default MainDashboard;
