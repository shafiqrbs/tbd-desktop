import {
	IconCurrencyDollar,
	IconShoppingCart,
	IconPackage,
	IconUsers,
	IconTrendingUp,
	IconDiscount,
	IconReceipt,
} from "@tabler/icons-react";
import { SimpleGrid, Card, Text, Group, RingProgress, Stack, Grid, ThemeIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";

function BakeryDashboardModal() {
	const { t } = useTranslation();

	// Dashboard metrics data
	const stats = {
		// Sales metrics
		todaySales: 1250.5,
		totalOrders: 45,
		averageOrderValue: 27.78,
		dailyTarget: 2000,
		monthlySales: 28500,
		monthlyTarget: 50000,

		// Inventory metrics
		lowStockItems: 8,
		totalProducts: 120,
		stockValue: 15000,

		// Customer metrics
		activeCustomers: 120,
		newCustomers: 15,
		customerRetention: 85,

		// Popular items with sales data
		popularItems: [
			{ name: "Croissant", sales: 85, revenue: 425 },
			{ name: "Baguette", sales: 65, revenue: 325 },
			{ name: "Sourdough", sales: 45, revenue: 225 },
		],

		// Promotional metrics
		activePromotions: 3,
		promotionRevenue: 450,
	};

	return (
		<Stack spacing="md">
			{/* Primary Metrics Section - Shows key performance indicators */}
			<SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
				{/* Sales Card - Shows today's sales and progress towards target */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="space-between" mb="xs">
						<ThemeIcon size="xl" radius="md" variant="light" color="green">
							<IconCurrencyDollar size={24} />
						</ThemeIcon>
						<Text size="xs" c="dimmed">
							{t("Today's Sales")}
						</Text>
					</Group>
					<Text fw={700} size="xl">
						${stats.todaySales.toFixed(2)}
					</Text>
					<Text size="xs" c="dimmed" mt={7}>
						{((stats.todaySales / stats.dailyTarget) * 100).toFixed(1)}% of daily target
					</Text>
				</Card>

				{/* Orders Card - Shows total orders and average order value */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="space-between" mb="xs">
						<ThemeIcon size="xl" radius="md" variant="light" color="blue">
							<IconShoppingCart size={24} />
						</ThemeIcon>
						<Text size="xs" c="dimmed">
							{t("Total Orders")}
						</Text>
					</Group>
					<Text fw={700} size="xl">
						{stats.totalOrders}
					</Text>
					<Text size="xs" c="dimmed" mt={7}>
						Avg. ${stats.averageOrderValue.toFixed(2)} per order
					</Text>
				</Card>

				{/* Inventory Card - Shows stock status and total products */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="space-between" mb="xs">
						<ThemeIcon size="xl" radius="md" variant="light" color="orange">
							<IconPackage size={24} />
						</ThemeIcon>
						<Text size="xs" c="dimmed">
							{t("Inventory Status")}
						</Text>
					</Group>
					<Text fw={700} size="xl">
						{stats.lowStockItems} / {stats.totalProducts}
					</Text>
					<Text size="xs" c="dimmed" mt={7}>
						${stats.stockValue.toLocaleString()} in stock
					</Text>
				</Card>

				{/* Customer Card - Shows customer metrics */}
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Group justify="space-between" mb="xs">
						<ThemeIcon size="xl" radius="md" variant="light" color="grape">
							<IconUsers size={24} />
						</ThemeIcon>
						<Text size="xs" c="dimmed">
							{t("Customer Metrics")}
						</Text>
					</Group>
					<Text fw={700} size="xl">
						{stats.activeCustomers}
					</Text>
					<Text size="xs" c="dimmed" mt={7}>
						{stats.newCustomers} new this month
					</Text>
				</Card>
			</SimpleGrid>

			{/* Secondary Metrics Section - Shows detailed analytics */}
			<Grid>
				{/* Sales Progress Card - Shows monthly sales progress with circular indicator */}
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="sm" padding="lg" radius="md" withBorder>
						<Group justify="space-between" mb="md">
							<Text fw={500}>{t("Monthly Sales Progress")}</Text>
							<ThemeIcon size="lg" radius="md" variant="light" color="blue">
								<IconTrendingUp size={20} />
							</ThemeIcon>
						</Group>
						<Group justify="center">
							<RingProgress
								size={150}
								thickness={20}
								roundCaps
								sections={[
									{
										value: (stats.monthlySales / stats.monthlyTarget) * 100,
										color: "blue",
									},
								]}
								label={
									<Text ta="center" size="xl" fw={700}>
										{((stats.monthlySales / stats.monthlyTarget) * 100).toFixed(
											1
										)}
										%
									</Text>
								}
							/>
						</Group>
						<Text ta="center" mt="md" size="sm" c="dimmed">
							${stats.monthlySales.toLocaleString()} / $
							{stats.monthlyTarget.toLocaleString()}
						</Text>
					</Card>
				</Grid.Col>

				{/* Customer Retention Card - Shows customer loyalty metrics */}
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="sm" padding="lg" radius="md" withBorder>
						<Group justify="space-between" mb="md">
							<Text fw={500}>{t("Customer Retention")}</Text>
							<ThemeIcon size="lg" radius="md" variant="light" color="grape">
								<IconUsers size={20} />
							</ThemeIcon>
						</Group>
						<Group justify="center">
							<RingProgress
								size={150}
								thickness={20}
								roundCaps
								sections={[
									{
										value: stats.customerRetention,
										color: "grape",
									},
								]}
								label={
									<Text ta="center" size="xl" fw={700}>
										{stats.customerRetention}%
									</Text>
								}
							/>
						</Group>
						<Text ta="center" mt="md" size="sm" c="dimmed">
							{t("Customer Retention Rate")}
						</Text>
					</Card>
				</Grid.Col>

				{/* Popular Items Card - Shows top selling items with revenue */}
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="sm" padding="lg" radius="md" withBorder>
						<Group justify="space-between" mb="md">
							<Text fw={500}>{t("Top Selling Items")}</Text>
							<ThemeIcon size="lg" radius="md" variant="light" color="green">
								<IconReceipt size={20} />
							</ThemeIcon>
						</Group>
						<Stack spacing="xs">
							{stats.popularItems.map((item, index) => (
								<Group key={index} justify="space-between">
									<Text size="sm">{item.name}</Text>
									<Group gap="xs">
										<Text size="sm" fw={500}>
											{item.sales} {t("sales")}
										</Text>
										<Text size="sm" c="dimmed">
											${item.revenue}
										</Text>
									</Group>
								</Group>
							))}
						</Stack>
					</Card>
				</Grid.Col>

				{/* Promotions Card - Shows active promotions and their impact */}
				<Grid.Col span={{ base: 12, md: 6 }}>
					<Card shadow="sm" padding="lg" radius="md" withBorder>
						<Group justify="space-between" mb="md">
							<Text fw={500}>{t("Active Promotions")}</Text>
							<ThemeIcon size="lg" radius="md" variant="light" color="orange">
								<IconDiscount size={20} />
							</ThemeIcon>
						</Group>
						<Stack spacing="xs">
							<Group justify="space-between">
								<Text size="sm">{t("Number of Promotions")}</Text>
								<Text size="sm" fw={500}>
									{stats.activePromotions}
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="sm">{t("Promotion Revenue")}</Text>
								<Text size="sm" fw={500}>
									${stats.promotionRevenue}
								</Text>
							</Group>
							<Group justify="space-between">
								<Text size="sm">{t("Promotion Rate")}</Text>
								<Text size="sm" fw={500}>
									{stats?.promotionRate || 0}%
								</Text>
							</Group>
						</Stack>
					</Card>
				</Grid.Col>
			</Grid>
		</Stack>
	);
}

export default BakeryDashboardModal;
