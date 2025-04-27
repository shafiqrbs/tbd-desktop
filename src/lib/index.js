export const formatDate = (date) => {
	const formattedDate = new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(date);
	const formattedDateWithDash = formattedDate.replace(/\//g, "-");
	return formattedDateWithDash; // 13-04-2025
}

export const generateInvoiceId = () => {
	return Date.now().toString().slice(1, 13);
}