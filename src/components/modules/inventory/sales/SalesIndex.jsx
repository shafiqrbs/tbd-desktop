import { Box, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";
import _SalesTable from "./_SalesTable";
import _SalesPurchaseHeaderNavbar from "../../domain/configuration/_SalesPurchaseHeaderNavbar";

function SalesIndex() {
	const { t } = useTranslation();

	const progress = getLoadingProgress();
	const { configData } = getConfigData();

	return (
		<>
			{progress !== 100 && (
				<Progress
					color="red"
					size="sm"
					striped
					animated
					value={progress}
					transitionDuration={200}
				/>
			)}
			{progress === 100 && (
				<Box>
					{configData?.id && (
						<>
							<_SalesPurchaseHeaderNavbar
								pageTitle={t("ManageSales")}
								roles={t("Roles")}
								allowZeroPercentage={configData?.inventory_config?.zero_stock}
								currencySymbol={configData?.inventory_config?.currency?.symbol}
							/>
							<Box p={"8"}>
								<_SalesTable
									allowZeroPercentage={configData?.inventory_config?.zero_stock}
									currencySymbol={configData?.inventory_config?.currency?.symbol}
								/>
							</Box>
						</>
					)}
				</Box>
			)}
		</>
	);
}

export default SalesIndex;
