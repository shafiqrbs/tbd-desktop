import { Drawer, Divider, Stack, Paper, Group, Text, ActionIcon, rem } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { SYNC_DATA } from "../../constants";

export default function SyncDrawer({ syncPanelOpen, setSyncPanelOpen }) {
	const handleSync = async (syncOption) => {
		try {
			let salesData, salesWithTransactions;

			switch (syncOption) {
				case "sales":
					salesData = await window.dbAPI.getDataFromTable("sales");

					salesWithTransactions = await Promise.all(
						salesData.map(async (sale) => ({
							...sale,
							sales_items: JSON.parse(sale.sales_items || "[]"),
							splitPayment:
								(await window.dbAPI.getDataFromTable("sales_transactions", {
									invoice_id: sale.invoice,
								})) || [],
						}))
					);

					console.log(salesWithTransactions);

					break;

				default:
					break;
			}
		} catch (error) {
			console.error("Error syncing sales data:", error);
		}
	};

	return (
		<Drawer
			position="right"
			opened={syncPanelOpen}
			onClose={() => setSyncPanelOpen(false)}
			padding="lg"
			size="md"
			overlayProps={{
				backgroundOpacity: 0.55,
			}}
			title="Syncing Information"
			styles={{
				title: { fontWeight: 600, fontSize: rem(20), color: "#626262" },
			}}
		>
			<Divider mb="md" />

			<Stack gap="md">
				{SYNC_DATA.map((item, index) => (
					<Paper key={index} p="md" radius="md" withBorder shadow="sm">
						<Group justify="space-between" wrap="nowrap">
							<Stack gap={4}>
								<Text fw={600} tt="capitalize">
									{item.mode}
								</Text>
								<Text size="sm" c="dimmed">
									{item.description}
								</Text>
							</Stack>
							<ActionIcon
								onClick={() => handleSync(item.mode)}
								variant="filled"
								radius="xl"
								color="teal"
								size="28px"
								className="sync-button"
							>
								<IconRefresh className="sync-icon" size={20} />
							</ActionIcon>
						</Group>
					</Paper>
				))}
			</Stack>

			<Text size="xs" c="dimmed" mt="xl" ta="center">
				Last synchronized: Today at 14:35
			</Text>
		</Drawer>
	);
}
