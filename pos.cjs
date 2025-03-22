const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const printer = new ThermalPrinter({
	type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
	interface: "//localhost//RP328", // Printer interface
	characterSet: "PC437_USA", // Printer character set - default: SLOVENIA
	lineCharacter: "-", // Set character for lines - default: "-"
	width: 64,
	options: {
		timeout: 5000,
	},
});

const thermalPrint = ({ configData, salesItems, salesViewData }) => {
	printer.bold(true);
	printer.setTextSize(1, 1);
	printer.alignCenter();
	printer.println(`${configData?.domain?.name || "TBD"}`);
	printer.bold(false);
	printer.setTypeFontB();
	printer.setTextSize(0, 0);
	printer.drawLine();

	printer.alignLeft();
	printer.setTextSize(0, 0);
	printer.println(`Email  : ${configData?.domain?.email || "N/A"}`);
	printer.setTextSize(0, 0);
	printer.println(`Mobile : ${configData?.domain?.mobile || "N/A"}`);
	printer.setTextSize(0, 0);
	printer.println(`Address: ${configData?.domain?.address || "N/A"}`);
	printer.drawLine();

	printer.alignCenter();
	printer.bold(true);
	printer.setTextSize(0, 0);
	printer.println(`Retail Invoice ${salesViewData?.invoice || "N/A"}`);
	printer.bold(false);
	printer.drawLine();

	printer.setTypeFontB();
	printer.tableCustom([
		{ text: `${salesViewData?.created || "N/A"}`, align: "LEFT", width: 0.5 },
		{ text: `${salesViewData?.customerName || "N/A"}`, align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: `${salesViewData?.createdByName || "N/A"}`, align: "LEFT", width: 0.5 },
		{ text: `${salesViewData?.customerMobile || "N/A"}`, align: "RIGHT", width: 0.5 },
	]);
	printer.drawLine();

	// Table Header
	printer.setTypeFontB();
	printer.bold(true);
	printer.tableCustom([
		{ text: "Name", align: "LEFT", width: 0.5 },
		{ text: "QTY", align: "CENTER", width: 0.1 },
		{ text: "Price", align: "RIGHT", width: 0.2 },
		{ text: "Total", align: "RIGHT", width: 0.2 },
	]);
	printer.bold(false);
	printer.drawLine();

	// Table Rows (Sales Items)
	salesItems.forEach((item) => {
		printer.tableCustom([
			{ text: `${item?.item_name || "-"}`, align: "LEFT", width: 0.5 },
			{ text: `${item?.quantity?.toString() || "0"}`, align: "CENTER", width: 0.1 },
			{ text: `${item?.sales_price?.toString() || "0.00"}`, align: "RIGHT", width: 0.2 },
			{ text: `${item?.sub_total?.toString() || "0.00"}`, align: "RIGHT", width: 0.2 },
		]);
	});

	printer.drawLine();
	// Totals
	printer.tableCustom([
		{ text: "SubTotal", align: "LEFT", bold: true, width: 0.5 },
		{ text: `${salesViewData?.sub_total?.toFixed(2) || "0.00"}`, align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Discount", align: "LEFT", bold: true, width: 0.5 },
		{ text: `${salesViewData?.discount?.toFixed(2) || "0.00"}`, align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Total", align: "LEFT", bold: true, width: 0.5 },
		{ text: `${salesViewData?.total?.toFixed(2) || "0.00"}`, align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Receive", align: "LEFT", bold: true, width: 0.5 },
		{ text: `${salesViewData?.payment?.toFixed(2) || "0.00"}`, align: "RIGHT", width: 0.5 },
	]);
	printer.drawLine();
	printer.tableCustom([
		{ text: "Due", align: "LEFT", bold: true, width: 0.5 },
		{
			text: `${(Number(salesViewData?.total) - Number(salesViewData?.payment)).toFixed(2)}`,
			align: "RIGHT",
			width: 0.5,
		},
	]);

	printer.drawLine();

	printer.alignCenter();
	printer.bold(true);
	printer.setTextSize(0, 0);
	printer.println(`© ${configData?.domain?.name || "TBD"}`);
	printer.bold(false);

	printer.cut();
	printer
		.execute()
		.then((data) => console.log("Printing data: ", data))
		.catch((err) => console.error(err));
};

module.exports = {
	thermalPrint,
};
