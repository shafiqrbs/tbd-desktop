const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const thermalPrint = ({ configData, salesItems, salesViewData }) => {
	console.log("print thermal data: ", configData, salesItems, salesViewData);

	const printer = new ThermalPrinter({
		type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
		interface: "localhost//RT378", // Printer interface
		characterSet: "PC437_USA", // Printer character set - default: SLOVENIA
		lineCharacter: "=", // Set character for lines - default: "-"
		options: {
			timeout: 5000,
		},
	});

	printer.setLineSpacing(30);

	printer.alignCenter();
	printer.bold(true);
	printer.setTextSize(0, 0);
	printer.println(configData?.domain?.name || "TBD");
	printer.bold(false);
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
	printer.println("Retail Invoice");
	printer.bold(false);
	printer.drawLine();

	printer.alignLeft();
	printer.bold(true);
	printer.setTextSize(0, 0);
	printer.println(`Invoice    : ${salesViewData?.invoice || "N/A"}`);
	printer.setTextSize(0, 0);
	printer.println(`Created    : ${salesViewData?.created || "N/A"}`);
	printer.setTextSize(0, 0);
	printer.println(`Created By : ${salesViewData?.createdByName || "N/A"}`);
	printer.bold(false);
	printer.drawLine();

	printer.alignCenter();
	printer.bold(true);
	printer.setTextSize(0, 0);
	printer.println("BllTo");
	printer.bold(false);
	printer.drawLine();

	printer.alignLeft();
	printer.bold(true);
	printer.setTextSize(0, 0);
	printer.println(`Customer   : ${salesViewData?.customerName || "N/A"}`);
	printer.setTextSize(0, 0);
	printer.println(`Mobile     : ${salesViewData?.customerMobile || "N/A"}`);
	printer.setTextSize(0, 0);
	printer.println(`Address    : ${salesViewData?.customer_address || "N/A"}`);
	printer.bold(false);
	printer.drawLine();

	// Table Header
	printer.tableCustom([
		{ text: "Name", align: "LEFT", width: 0.3 },
		{ text: "QTY", align: "CENTER", width: 0.15 },
		{ text: "Unit", align: "CENTER", width: 0.15 },
		{ text: "Price", align: "RIGHT", width: 0.2 },
		{ text: "Total", align: "RIGHT", width: 0.2 },
	]);

	// Table Rows (Sales Items)
	salesItems.forEach((item) => {
		printer.tableCustom([
			{ text: item?.item_name || "-", align: "LEFT", width: 0.3 },
			{ text: item?.quantity?.toString() || "0", align: "CENTER", width: 0.15 },
			{ text: item?.purchase_price?.toString() || "0.00", align: "CENTER", width: 0.15 },
			{ text: item?.sales_price?.toString() || "0.00", align: "RIGHT", width: 0.2 },
			{ text: item?.sub_total?.toString() || "0.00", align: "RIGHT", width: 0.2 },
		]);
	});

	printer.drawLine();

	// Totals
	printer.tableCustom([
		{ text: "SubTotal", align: "LEFT", bold: true, width: 0.5 },
		{ text: salesViewData?.sub_total || "0.00", align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Discount", align: "LEFT", bold: true, width: 0.5 },
		{ text: salesViewData?.discount || "0.00", align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Total", align: "LEFT", bold: true, width: 0.5 },
		{ text: salesViewData?.total || "0.00", align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Receive", align: "LEFT", bold: true, width: 0.5 },
		{ text: salesViewData?.payment || "0.00", align: "RIGHT", width: 0.5 },
	]);
	printer.tableCustom([
		{ text: "Due", align: "LEFT", bold: true, width: 0.5 },
		{
			text: (Number(salesViewData?.total) - Number(salesViewData?.payment)).toFixed(2),
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
