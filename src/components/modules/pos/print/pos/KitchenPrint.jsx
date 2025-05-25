import { useEffect } from "react";
import getConfigData from "../../../../global-hook/config-data/getConfigData";
import { notifications } from "@mantine/notifications";

export default function KitchenPrint(props) {
	const { selectedProducts, setPrint, salesByUserName } = props;
	const configData = getConfigData();

	useEffect(() => {
		const handlePrint = async () => {
			const setup = await window.dbAPI.getDataFromTable("printer");
			if (!setup?.printer_name) {
				return notifications.show({
					title: "Printer not found",
					message: "Please setup printer first",
					color: "red",
				});
			}

			const status = await window.deviceAPI.kitchenPrint({
				configData,
				selectedProducts,
				salesByUserName,
				setup,
			});

			if (!status?.success) {
				notifications.show({
					color: "red",
					title: "Printing Failed",
					message: status.message,
					style: { backgroundColor: "#f1f1f1" },
				});
			}

			setPrint(false);
		};

		handlePrint();
	}, []);

	return null;
}
