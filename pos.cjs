const escpos = require("escpos");
escpos.USB = require("escpos-usb");

const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

const print = ({ configData, salesItems, salesViewData }) => {
	console.log("print data: ", configData, salesItems, salesViewData);

	const device = new escpos.USB();
	const options = { encoding: "GB18030" };
	const printer = new escpos.Printer(device, options);

	device.open(function (error) {
		if (error) {
			throw error;
		}

		printer
			.font("a")
			.align("ct")
			.style("bu")
			.size(1, 1)
			.text("The quick brown fox jumps over the lazy dog")
			.text("敏捷的棕色狐狸跳过懒狗")
			.barcode("1234567", "EAN8")
			.table(["One", "Two", "Three"])
			.tableCustom(
				[
					{ text: "Left", align: "LEFT", width: 0.33, style: "B" },
					{ text: "Center", align: "CENTER", width: 0.33 },
					{ text: "Right", align: "RIGHT", width: 0.33 },
				],
				{ encoding: "cp857", size: [1, 1] }
			)
			.qrimage("https://github.com/song940/node-escpos", function (err) {
				console.error(err);
				this.cut();
				this.close();
			});
	});
};

const thermalPrint = ({ configData, salesItems, salesViewData }) => {
	console.log("print thermal data: ", configData, salesItems, salesViewData);

	const epsonPrinter = new ThermalPrinter({
		type: PrinterTypes.EPSON, // Printer type: 'star' or 'epson'
		interface: "\\.COM3", // Printer interface
		characterSet: "PC437_USA", // Printer character set - default: SLOVENIA
		lineCharacter: "-", // Set character for lines - default: "-"
		options: {
			timeout: 5000,
		},
	});
	epsonPrinter.alignCenter();
	epsonPrinter.bold(true);
	epsonPrinter.println("Hello world, numbers:=[0123456789]");
	epsonPrinter.bold(false);
	epsonPrinter.newLine();
	epsonPrinter.printBarcode("a clever fox jumps over a lazy dog", 69, {
		hriPos: 0,
		hriFont: 0,
		width: 4,
		height: 50,
	});
	epsonPrinter.cut();
	epsonPrinter
		.execute()
		.then((data) => console.log("Printing data: ", data))
		.catch((err) => console.error(err));
};

module.exports = {
	print,
	thermalPrint,
};
