import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesPurchaseHeaderNavbar from "../../domain/configuration/_SalesPurchaseHeaderNavbar.jsx";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";

function PurchaseInvoice() {
	const { t } = useTranslation();
	const progress = getLoadingProgress();
	const { configData } = getConfigData();

	return (
		<>
			{progress !== 100 && (
				<Progress
					color="red"
					size={"sm"}
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			)}
			{progress === 100 && (
				<Box>
					{configData && (
						<>
							<_SalesPurchaseHeaderNavbar
								pageTitle={t("PurchaseInvoice")}
								roles={t("Roles")}
								allowZeroPercentage={configData?.zero_stock}
								currencySymbol={configData?.currency?.symbol}
							/>
							<Box p={"8"}>
								{
									// configData?.business_model?.slug === 'general' &&
									<_GenericInvoiceForm
										allowZeroPercentage={configData?.zero_stock}
										currencySymbol={configData?.currency?.symbol}
										isPurchaseByPurchasePrice={
											configData?.is_purchase_by_purchase_price
										}
										isWarehouse={configData?.sku_warehouse}
									/>
								}
							</Box>
						</>
					)}
				</Box>
			)}
		</>
	);
}

export default PurchaseInvoice;
