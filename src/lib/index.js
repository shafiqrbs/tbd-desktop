export const formatDate = (date) => {
	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
	const formattedDateWithDash = formattedDate.replace(/\//g, "-");
	return formattedDateWithDash; // 13-04-2025
};

export const generateInvoiceId = () => {
	return Date.now().toString().slice(1, 13);
};

export const applyDiscount = (price, discount) => {
	return price - (price * discount) / 100;
};

export const applyVat = (price, vat) => {
	return price + (price * vat) / 100;
};

export const applyZakat = (price, zakat) => {
	return price * zakat;
};

export const applyAIT = (price, ait) => {
	return price * ait;
};

export const applyCoupon = (price, coupon) => {
	return price - (price * coupon) / 100;
};
