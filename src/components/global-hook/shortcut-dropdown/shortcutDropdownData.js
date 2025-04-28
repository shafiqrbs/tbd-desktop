import { IconCode } from "@tabler/icons-react";

const shortcutDropdownData = (t, configData) => {
	configData = {
		data: JSON.parse(configData?.data || "{}"),
	};

	const data = [
		{
			group: "Core",
			actions: configData?.data?.domain?.modules?.includes("core")
				? [
						{
							id: "customer",
							icon: IconCode,
							label: t("CustomerN"),
							description: t("WhereWePresentTheCustomerInformationN"),
						},
				  ]
				: [],
		},
		{
			group: "Procurement",
			actions: configData?.data?.domain?.modules?.includes("procurement")
				? [
						{
							id: "requisition",
							icon: IconCode,
							label: t("Requisition"),
							description: t("WhereWePresentTheTransactionModeInformationN"),
						},
						{
							id: "new-requisition",
							icon: IconCode,
							label: t("NewRequisition"),
							description: t("WhereWePresentTheTransactionModeInformationN"),
						},
				  ]
				: [],
		},
		{
			group: "Sales & Purchase",
			actions: configData?.data?.domain?.modules?.includes("sales-purchase")
				? [
						{
							id: "sales",
							icon: IconCode,
							label: t("SalesN"),
							description: t("WhereWePresentTheSalesInformationN"),
						},
						{
							id: "sales-invoice",
							icon: IconCode,
							label: t("NewSalesN"),
							description: t("WhereWePresentTheSalesInvoiceInformationN"),
						},
						{
							id: "purchase",
							icon: IconCode,
							label: t("PurchaseN"),
							description: t("WhereWePresentThePurchaseInformationN"),
						},
						{
							id: "purchase-invoice",
							icon: IconCode,
							label: t("NewPurchaseN"),
							description: t("WhereWePresentThePurchaseInvoiceInformationN"),
						},
						{
							id: "opening-stock",
							icon: IconCode,
							label: t("NewOpeningN"),
							description: t("WhereWePresentThePurchaseInvoiceInformationN"),
						},
						{
							id: "opening-approve-stock",
							icon: IconCode,
							label: t("OpeningApproveN"),
							description: t("WhereWePresentThePurchaseInvoiceInformationN"),
						},
				  ]
				: [],
		},
	];

	return data;
};
export default shortcutDropdownData;
