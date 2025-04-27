import { Button } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import getConfigData from "../../../../global-hook/config-data/getConfigData";
import { notifications } from "@mantine/notifications";

export default function SalesPrintThermal({ salesViewData, salesItems }) {
	const { t } = useTranslation();
	const { configData } = getConfigData();

	const handlePrint = async () => {
		const setup = await window.dbAPI.getDataFromTable("printer");
		if(!setup?.printer_name) {
			return notifications.show({
				title: "Printer not found",
				message: "Please setup printer first",
				color: "red",
			})
		}
		await window.deviceAPI.thermalPrint({ configData, salesItems, salesViewData, setup });
	};

	return (
		<Button
			fullWidth={true}
			variant="filled"
			leftSection={<IconReceipt size={14} />}
			color="red.5"
			onClick={handlePrint}
		>
			{t("Pos")}
		</Button>
	);
}
