import { useEffect } from "react";
import { Box, Grid, Progress } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import VendorTable from "./VendorTable.jsx";
import VendorForm from "./VendorForm";
import VendorUpdateForm from "./VendorUpdateForm.jsx";
import {
	editEntityData,
	setEditEntityData,
	setFormLoading,
	setInsertType,
	setSearchKeyword,
} from "../../../../store/core/crudSlice.js";
import { getLoadingProgress } from "../../../global-hook/loading-progress/getLoadingProgress.js";
import CoreHeaderNavbar from "../CoreHeaderNavbar";
import { useNavigate, useParams } from "react-router";
import { useCustomerDropdownData } from "../../../global-hook/dropdown/getCustomerDropdownData.js";

function VendorIndex() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { id } = useParams();
	const navigate = useNavigate();

	const insertType = useSelector((state) => state.crudSlice?.data?.core?.insertType);
	const customerDropDownData = useCustomerDropdownData();
	const progress = getLoadingProgress();

	useEffect(() => {
		const initializeVendor = async () => {
			if (id) {
				dispatch(setInsertType({ module: "core", value: "update" }));
				dispatch(setFormLoading({ module: "core", value: true }));

				try {
					await dispatch(
						editEntityData({
							url: `core/vendor/${id}`,
							module: "core",
						})
					).unwrap();
				} finally {
					dispatch(setFormLoading({ module: "core", value: false }));
				}
			} else {
				dispatch(setInsertType({ module: "core", value: "create" }));
				dispatch(setSearchKeyword({ module: "core", value: "" }));
				dispatch(setEditEntityData({ module: "core", data: [] }));
				dispatch({
					type: "crud/resetFilters",
					payload: { module: "core", filterKey: "vendor" },
				});
				navigate("/core/vendor", { replace: true });
			}
		};

		initializeVendor();
	}, [id, dispatch, navigate]);

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
				<>
					<CoreHeaderNavbar
						pageTitle={t("ManageVendor")}
						roles={t("Roles")}
						allowZeroPercentage=""
						currencySymbol=""
					/>
					<Box p="8">
						<Grid columns={24} gutter={{ base: 8 }}>
							<Grid.Col span={15}>
								<Box bg="white" p="xs" className="borderRadiusAll">
									<VendorTable />
								</Box>
							</Grid.Col>
							<Grid.Col span={9}>
								{insertType === "create" ? (
									<VendorForm customerDropDownData={customerDropDownData} />
								) : (
									<VendorUpdateForm customerDropDownData={customerDropDownData} />
								)}
							</Grid.Col>
						</Grid>
					</Box>
				</>
			)}
		</>
	);
}

export default VendorIndex;
