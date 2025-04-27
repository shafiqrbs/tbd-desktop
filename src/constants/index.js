import flagBD from "../assets/images/flags/bd.svg";
import flagGB from "../assets/images/flags/gb.svg";

const characterSets = [
	"PC437_USA",
	"PC850_MULTILINGUAL",
	"PC860_PORTUGUESE",
	"PC863_CANADIAN_FRENCH",
	"PC865_NORDIC",
	"PC851_GREEK",
	"PC857_TURKISH",
	"PC737_GREEK",
	"ISO8859_7_GREEK",
	"WPC1252",
	"PC866_CYRILLIC2",
	"PC852_LATIN2",
	"SLOVENIA",
	"PC858_EURO",
	"WPC775_BALTIC_RIM",
	"PC855_CYRILLIC",
	"PC861_ICELANDIC",
	"PC862_HEBREW",
	"PC864_ARABIC",
	"PC869_GREEK",
	"ISO8859_2_LATIN2",
	"ISO8859_15_LATIN9",
	"PC1125_UKRANIAN",
	"WPC1250_LATIN2",
	"WPC1251_CYRILLIC",
	"WPC1253_GREEK",
	"WPC1254_TURKISH",
	"WPC1255_HEBREW",
	"WPC1256_ARABIC",
	"WPC1257_BALTIC_RIM",
	"WPC1258_VIETNAMESE",
	"KZ1048_KAZAKHSTAN",
];

const languages = [
	{ label: "EN", value: "en", flag: flagGB },
	{ label: "BN", value: "bn", flag: flagBD },
];

const syncData = ["Sales", "Purchase", "Product", "Customer"];

export { characterSets, languages, syncData };
