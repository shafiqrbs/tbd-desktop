import { Button } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import getConfigData from "../../../../global-hook/config-data/getConfigData";

const options = {
	preview: false,
	silent: true,
	margin: "0 0 0 0",
	copies: 1,
	printerName: import.meta.env.VITE_PRINTER_NAME,
	timeOutPerLine: 1000,
	pageSize: "80mm",
};

export default function SalesPrintThermal({ salesViewData, salesItems }) {
	const { t } = useTranslation();
	const { configData } = getConfigData();

	console.log("ConfigData:", configData);
	console.log("salesViewData:", salesViewData, "salesItems:", salesItems);

	const handlePrint = async () => {
		const data = [
			{
				type: "text",
				value: configData?.domain?.name,
				style: { fontWeight: "600", textAlign: "center", fontSize: "16px" },
			},
			{
				type: "divider",
				style: { borderTop: "1px dashed black" },
			},
			{
				type: "table",
				style: { border: "1px solid #ddd", fontFamily: "sans-serif", fontSize: "10px" },
				tableBody: [
					[
						{ type: "text", value: "Email" },
						{ type: "text", value: configData?.domain?.email || "N/A" },
					],
					[
						{ type: "text", value: "Mobile" },
						{ type: "text", value: configData?.domain?.mobile || "N/A" },
					],
					[
						{ type: "text", value: "Address" },
						{ type: "text", value: configData?.domain?.address || "N/A" },
					],
				],
			},
			{
				type: "text",
				value: t("RetailInvoice"),
				style: { fontWeight: "600", textAlign: "center", fontSize: "12px" },
			},
			{
				type: "divider",
				style: { borderTop: "1px dashed black" },
			},
			{
				type: "table",
				style: { border: "1px solid #ddd", fontFamily: "sans-serif", fontSize: "10px" },
				tableBody: [
					[
						{ type: "text", value: "Invoice" },
						{ type: "text", value: salesViewData?.invoice || "N/A" },
					],
					[
						{ type: "text", value: "Created" },
						{ type: "text", value: salesViewData?.created || "N/A" },
					],
					[
						{ type: "text", value: "Created By" },
						{ type: "text", value: salesViewData?.createdByName || "N/A" },
					],
				],
			},
			{
				type: "text",
				value: t("BillTo"),
				style: { fontWeight: "600", textAlign: "center", fontSize: "12px" },
			},
			{
				type: "divider",
				style: { borderTop: "1px dashed black" },
			},
			{
				type: "table",
				style: { border: "1px solid #ddd", fontFamily: "sans-serif", fontSize: "10px" },
				tableBody: [
					[
						{ type: "text", value: "Customer" },
						{ type: "text", value: salesViewData?.customerName || "N/A" },
					],
					[
						{ type: "text", value: "Mobile" },
						{ type: "text", value: salesViewData?.customerMobile || "N/A" },
					],
					[
						{ type: "text", value: "Address" },
						{ type: "text", value: salesViewData?.customer_address || "N/A" },
					],
				],
			},
			{
				type: "table",
				style: {
					border: "1px solid #ddd",
					fontFamily: "sans-serif",
					fontSize: "10px",
					marginTop: "10px",
				},
				tableHeader: [
					{ type: "text", value: t("Name") },
					{ type: "text", value: t("QTY") },
					{ type: "text", value: t("Unit") },
					{ type: "text", value: t("Price") },
					{ type: "text", value: t("Total") },
				],
				tableBody: salesItems?.map((element) => [
					{ type: "text", value: element?.item_name },
					{ type: "text", value: element?.quantity },
					{ type: "text", value: element?.purchase_price },
					{ type: "text", value: element?.sales_price },
					{ type: "text", value: element?.sub_total },
				]),
			},
			{
				type: "table",
				style: { border: "1px solid #ddd", fontFamily: "sans-serif", fontSize: "10px" },
				tableBody: [
					[
						{ type: "text", value: t("SubTotal") },
						{ type: "text", value: salesViewData?.sub_total || "0.00" },
					],
					[
						{ type: "text", value: t("Discount") },
						{ type: "text", value: salesViewData?.discount || "0.00" },
					],
					[
						{ type: "text", value: t("Total") },
						{ type: "text", value: salesViewData?.total || "0.00" },
					],
					[
						{ type: "text", value: t("Receive") },
						{ type: "text", value: salesViewData?.payment || "0.00" },
					],
					[
						{ type: "text", value: t("Due") },
						{
							type: "text",
							value: (
								Number(salesViewData?.total) - Number(salesViewData?.payment)
							).toFixed(2),
						},
					],
				],
			},
			{
				type: "text",
				value: "© " + configData?.domain?.name,
				style: { textAlign: "center", fontSize: "10px", fontWeight: "600" },
			},
		];

		await window.deviceAPI.posPrint(data, options);
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
