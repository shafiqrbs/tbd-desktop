import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _GenericInvoiceForm from "./_GenericInvoiceForm.jsx";
import _WholeSaleGenericInvoiceForm from "./whole-sale/_GenericInvoiceForm.jsx";
import _SalesPurchaseHeaderNavbar from "../../domain/configuration/_SalesPurchaseHeaderNavbar.jsx";

function SalesInvoice() {
	const { t } = useTranslation();
	const insertType = useSelector((state) => state.crudSlice.data?.sales?.insertType || "create");
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
								pageTitle={t("SalesInvoice")}
								roles={t("Roles")}
								allowZeroPercentage={configData?.zero_stock}
								currencySymbol={configData?.currency?.symbol}
							/>
							<Box p={"8"}>
								{insertType === "create" &&
									configData?.business_model?.slug === "general" && (
										<_GenericInvoiceForm
											allowZeroPercentage={configData?.zero_stock}
											currencySymbol={configData?.currency?.symbol}
											domainId={configData?.domain_id}
											isSMSActive={configData?.is_active_sms}
											isZeroReceiveAllow={configData?.is_zero_receive_allow}
											isWarehouse={configData?.sku_warehouse}
										/>
									)}
								{insertType === "create" &&
									configData?.business_model?.slug === "Distribution" && (
										<_WholeSaleGenericInvoiceForm
											allowZeroPercentage={configData?.zero_stock}
											currencySymbol={configData?.currency?.symbol}
											domainId={configData?.domain_id}
											isSMSActive={configData?.is_active_sms}
											isZeroReceiveAllow={configData?.is_zero_receive_allow}
										/>
									)}
							</Box>
						</>
					)}
				</Box>
			)}
		</>
	);
}

export default SalesInvoice;
