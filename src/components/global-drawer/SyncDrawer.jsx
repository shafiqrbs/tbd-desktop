import { Drawer, Divider, Stack, Paper, Group, Text, ActionIcon, rem } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { SYNC_DATA } from "../../constants";
import { storeEntityData } from "../../store/core/crudSlice";
import { useDispatch } from "react-redux";
import { showNotificationComponent } from "../core-component/showNotificationComponent";

export default function SyncDrawer({ syncPanelOpen, setSyncPanelOpen }) {
	const dispatch = useDispatch();

	const handleSync = async (syncOption) => {
		try {
			let salesData, salesWithTransactions, output, value, resultAction;

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

					output = {
						created_by: await window.dbAPI.getDataFromTable("users"),
						content: salesWithTransactions,
					};

					value = {
						url: `inventory/pos/data-process`,
						data: output,
						module: "pos",
					};

					resultAction = await dispatch(storeEntityData(value));

					if (resultAction.payload?.status !== 200) {
						showNotificationComponent(
							resultAction.payload?.message || "Error syncing sales data",
							"red",
							"",
							"",
							true
						);
					} else {
						showNotificationComponent(
							resultAction.payload?.message || "Sales data synced successfully",
							"teal",
							"lightgray",
							"",
							"",
							true
						);
					}

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
				Last synchronized: Today at {new Date().toLocaleTimeString()}
			</Text>
		</Drawer>
	);
}
