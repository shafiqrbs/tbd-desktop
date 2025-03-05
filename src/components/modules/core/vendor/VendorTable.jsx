import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { Group, Box, ActionIcon, Text, Menu, rem } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconCheck, IconDotsVertical, IconTrashX, IconAlertCircle } from "@tabler/icons-react";
import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import {
	editEntityData,
	getIndexEntityData,
	selectVendorFilters,
	setDeleteMessage,
	setFormLoading,
	setInsertType,
} from "../../../../store/core/crudSlice.js";
import KeywordSearch from "../../filter/KeywordSearch";
import { modals } from "@mantine/modals";
import { deleteEntityData } from "../../../../store/core/crudSlice";
import tableCss from "../../../../assets/css/Table.module.css";
import VendorViewDrawer from "./VendorViewDrawer.jsx";
import { notifications } from "@mantine/notifications";

function VendorTable() {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 98; //TabList height 104

	const perPage = 50;
	const [page, setPage] = useState(1);

	const [fetching, setFetching] = useState(true);
	const searchKeyword = useSelector((state) => state?.crud?.data?.core?.searchKeyword || "");
	const filters = useSelector(selectVendorFilters);
	console.log("Filters:", filters);
	const entityDataDelete = useSelector((state) => state?.crud?.data?.core?.deleteMessage || "");
	const coreVendors = JSON.parse(localStorage.getItem("core-vendors") || "[]");

	const [vendorObject, setVendorObject] = useState({});
	const navigate = useNavigate();
	const [viewDrawer, setViewDrawer] = useState(false);
	const [indexData, setIndexData] = useState([]);

	useEffect(() => {
		dispatch(
			setDeleteMessage({
				module: "core",
				message: "",
			})
		);

		if (entityDataDelete.message === "delete") {
			notifications.show({
				color: "red",
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setTimeout(() => {
				dispatch(setFetching(true));
			}, 700);
		}
	}, [entityDataDelete, dispatch, t]);

	useEffect(() => {
		const fetchData = async () => {
			setFetching((prev) => {
				if (!prev) {
					return true;
				}
				return prev;
			});

			const value = {
				url: "core/vendor",
				param: {
					term: searchKeyword,
					name: filters.name,
					mobile: filters.mobile,
					company_name: filters.company_name,
					page: page,
					offset: perPage,
				},
			};

			try {
				console.log("value", value);
				const resultAction = await dispatch(getIndexEntityData(value));
				console.log("resultAction", resultAction);
				if (getIndexEntityData.rejected.match(resultAction)) {
					console.error("Error:", resultAction);
				} else if (getIndexEntityData.fulfilled.match(resultAction)) {
					setIndexData(resultAction.payload);
				}
			} catch (err) {
				console.error("Unexpected error:", err);
			} finally {
				setFetching(false);
			}
		};

		fetchData();
	}, [dispatch, searchKeyword, filters, page]);

	return (
		<>
			<Box
				pl={`xs`}
				pr={8}
				pt={"6"}
				pb={"4"}
				className={"boxBackground borderRadiusAll border-bottom-none"}
			>
				<KeywordSearch module={"vendor"} />
			</Box>
			<Box className={"borderRadiusAll border-top-none"}>
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={indexData.data}
					columns={[
						{
							accessor: "index",
							title: t("S/N"),
							textAlignment: "right",
							render: (item) => indexData.data.indexOf(item) + 1,
						},
						{ accessor: "name", title: t("Name") },
						{ accessor: "company_name", title: t("CompanyName") },
						{ accessor: "mobile", title: t("Mobile") },
						{
							accessor: "action",
							title: t("Action"),
							textAlign: "right",
							render: (data) => (
								<Group gap={4} justify="right" wrap="nowrap">
									<Menu
										position="bottom-end"
										offset={3}
										withArrow
										trigger="hover"
										openDelay={100}
										closeDelay={400}
									>
										<Menu.Target>
											<ActionIcon
												size="sm"
												variant="outline"
												color="red"
												radius="xl"
												aria-label="Settings"
											>
												<IconDotsVertical
													height={"18"}
													width={"18"}
													stroke={1.5}
												/>
											</ActionIcon>
										</Menu.Target>
										<Menu.Dropdown>
											<Menu.Item
												onClick={() => {
													dispatch(
														setInsertType({
															module: "core",
															value: "update",
														})
													);
													dispatch(
														editEntityData({
															url: `core/vendor/${data.id}`,
															module: "core",
														})
													);
													dispatch(
														setFormLoading({
															module: "core",
															value: true,
														})
													);
													navigate(`/core/vendor/${data.id}`);
												}}
												target="_blank"
												component="a"
												w={"200"}
											>
												{t("Edit")}
											</Menu.Item>

											<Menu.Item
												onClick={() => {
													const foundVendors = coreVendors.find(
														(type) => type.id == data.id
													);
													if (foundVendors) {
														setVendorObject(foundVendors);
														setViewDrawer(true);
													} else {
														notifications.show({
															color: "red",
															title: t(
																"Something Went wrong , please try again"
															),
															icon: (
																<IconAlertCircle
																	style={{
																		width: rem(18),
																		height: rem(18),
																	}}
																/>
															),
															loading: false,
															autoClose: 900,
															style: { backgroundColor: "lightgray" },
														});
													}
												}}
												target="_blank"
												component="a"
												w={"200"}
											>
												{t("Show")}
											</Menu.Item>
											<Menu.Item
												target="_blank"
												component="a"
												w={"200"}
												mt={"2"}
												bg={"red.1"}
												c={"red.6"}
												onClick={() => {
													modals.openConfirmModal({
														title: (
															<Text size="md">
																{" "}
																{t("FormConfirmationTitle")}
															</Text>
														),
														children: (
															<Text size="sm">
																{" "}
																{t("FormConfirmationMessage")}
															</Text>
														),
														labels: {
															confirm: "Confirm",
															cancel: "Cancel",
														},
														confirmProps: { color: "red.6" },
														onCancel: () => console.log("Cancel"),
														onConfirm: () => {
															dispatch(
																deleteEntityData(
																	"core/vendor/" + data.id
																)
															);
														},
													});
												}}
												rightSection={
													<IconTrashX
														style={{ width: rem(14), height: rem(14) }}
													/>
												}
											>
												{t("Delete")}
											</Menu.Item>
										</Menu.Dropdown>
									</Menu>
								</Group>
							),
						},
					]}
					fetching={fetching}
					totalRecords={indexData.total}
					recordsPerPage={perPage}
					page={page}
					onPageChange={(p) => {
						setPage(p);
						dispatch(setFetching(true));
					}}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					scrollAreaProps={{ type: "never" }}
				/>
			</Box>
			{viewDrawer && (
				<VendorViewDrawer
					viewDrawer={viewDrawer}
					setViewDrawer={setViewDrawer}
					vendorObject={vendorObject}
				/>
			)}
		</>
	);
}

export default VendorTable;
