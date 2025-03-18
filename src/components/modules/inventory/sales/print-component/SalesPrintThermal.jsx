import { Button } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import getConfigData from "../../../../global-hook/config-data/getConfigData";

export default function SalesPrintThermal({ salesViewData, salesItems }) {
	const { t } = useTranslation();
	const { configData } = getConfigData();

	const handlePrint = async () => {
		await window.deviceAPI.thermalPrint({ configData, salesItems, salesViewData });
		// await window.deviceAPI.posPrint({ configData, salesItems, salesViewData });
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
