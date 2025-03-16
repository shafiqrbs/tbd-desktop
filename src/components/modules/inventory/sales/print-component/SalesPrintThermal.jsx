import { Button } from "@mantine/core";
import { IconReceipt } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { Printer, Text, Row, Line, Br, Cut, render } from "react-thermal-printer";
import getConfigData from "../../../../global-hook/config-data/getConfigData";
import { Fragment } from "react";

export default function SalesPrintThermal({ salesViewData, salesItems }) {
	const { t } = useTranslation();
	const { configData } = getConfigData();

	const handlePrint = async () => {
		const receipt = (
			<Printer type="epson" width={42}>
				{/* ================== Business Name ================ */}
				<Text align="center" size={{ width: 2, height: 2 }} bold>
					{configData?.domain?.name}
				</Text>
				<Br />
				<Line />

				{/* Email */}
				<Row left={t("Email")} right={configData?.domain?.email || "N/A"} />

				{/* Mobile */}
				<Row left={t("Mobile")} right={configData?.domain?.mobile || "N/A"} />

				{/* Address */}
				<Row left={t("Address")} right={configData?.domain?.address || "N/A"} />

				<Line />
				<Br />

				{/* ================= Invoice Title ================= */}
				<Text align="center" size={{ width: 2, height: 2 }} bold>
					{t("RetailInvoice")}
				</Text>
				<Br />
				<Line />

				{/* Invoice ID */}
				<Row left={t("Invoice")} right={salesViewData?.invoice || "N/A"} />

				{/* Created Time */}
				<Row left={t("Created")} right={salesViewData?.created || "N/A"} />

				{/* Created By */}
				<Row left={t("CreatedBy")} right={salesViewData?.createdByName || "N/A"} />

				<Line />
				<Br />

				{/* ================= Bill To Title =============== */}
				<Text align="center" size={{ width: 2, height: 2 }} bold>
					{t("BillTo")}
				</Text>
				<Br />
				<Line />

				{/* Customer Name */}
				<Row left={t("Customer")} right={salesViewData?.customerName || "N/A"} />

				{/* Customer Mobile */}
				<Row left={t("Mobile")} right={salesViewData?.customerMobile || "N/A"} />

				{/* Customer Address */}
				<Row left={t("Address")} right={salesViewData?.customer_address || "N/A"} />

				<Line />
				<Br />

				{/* ================ Table Header ================= */}
				<Row
					left={<Text bold>{t("Name")}</Text>}
					right={
						<>
							<Text>{t("QTY")}</Text>
							<Text>{t("Unit")}</Text>
							<Text>{t("Price")}</Text>
							<Text>{t("Total")}</Text>
						</>
					}
					gap={2}
				/>
				<Line />
				<Br />

				<>
					{salesItems?.map((element, index) => (
						<Fragment key={index}>
							<Row
								left={<Text>{element?.item_name}</Text>}
								right={
									<>
										<Text>{element?.quantity}</Text>
										<Text>{element?.purchase_price}</Text>
										<Text>{element?.sales_price}</Text>
										<Text>{element?.sub_total}</Text>
									</>
								}
								gap={2}
							/>
							<Line />
							<Br />
						</Fragment>
					))}
				</>

				{/* ================= SubTotal ================ */}
				<Row
					left={<Text>{t("SubTotal")}</Text>}
					right={
						<Text>
							{salesViewData?.sub_total
								? Number(salesViewData?.sub_total).toFixed(2)
								: "N/A"}
						</Text>
					}
					gap={2}
				/>
				<Line />
				<Br />

				{/* ================= Discount =============== */}
				<Row
					left={<Text>{t("Discount")}</Text>}
					right={
						<Text>
							{salesViewData?.discount
								? Number(salesViewData?.discount).toFixed(2)
								: "N/A"}
						</Text>
					}
					gap={2}
				/>
				<Line />
				<Br />

				{/* ================== Total =============== */}
				<Row
					left={<Text>{t("Total")}</Text>}
					right={
						<Text>
							{salesViewData?.total ? Number(salesViewData?.total).toFixed(2) : "N/A"}
						</Text>
					}
					gap={2}
				/>
				<Line />
				<Br />

				{/* ================= Receive ================ */}
				<Row
					left={<Text>{t("Receive")}</Text>}
					right={
						<Text>
							{salesViewData?.payment
								? Number(salesViewData.payment).toFixed(2)
								: "N/A"}
						</Text>
					}
					gap={2}
				/>
				<Line />
				<Br />

				{/* ================ Due =============== */}
				<Row
					left={<Text>{t("Due")}</Text>}
					right={
						<Text>
							{(
								Number(salesViewData?.total) - Number(salesViewData?.payment)
							).toFixed(2)}
						</Text>
					}
					gap={2}
				/>
				<Line />
				<Br />

				{/* ================ Footer Text =============== */}
				<Text>{configData?.print_footer_text}</Text>
				<Br />
				<Text align="center">{"© " + configData?.domain?.name}</Text>

				<Cut />
			</Printer>
		);

		const data = await render(receipt);

		// Send to printer using serial port
		const port = await navigator.serial.requestPort();
		await port.open({ baudRate: 9600 });

		const writer = port.writable?.getWriter();
		await writer.write(data);
		writer.releaseLock();
		await port.close();
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
