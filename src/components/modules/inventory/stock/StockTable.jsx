import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import {
	Group,
	Box,
	Button,
	Switch,
	Menu,
	ActionIcon,
	rem,
	Text,
	Image,
	Modal,
} from "@mantine/core";

import { DataTable } from "mantine-datatable";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getIndexEntityData, setFetching } from "../../../../store/core/crudSlice.js";
import tableCss from "../../../../assets/css/Table.module.css";
import __StockSearch from "./__StockSearch.jsx";
import { setDeleteMessage } from "../../../../store/core/crudSlice.js";
import OverviewModal from "../product-overview/OverviewModal.jsx";
import { IconCheck, IconDotsVertical, IconTrashX } from "@tabler/icons-react";
// import { showEntityData } from "../../../../store/core/crudSlice.js";
import { notifications } from "@mantine/notifications";
import { showNotificationComponent } from "../../../core-component/showNotificationComponent.jsx";
import { editEntityData, setFormLoading, setInsertType } from "../../../../store/core/crudSlice.js";
import { modals } from "@mantine/modals";
import AddMeasurement from "../modal/AddMeasurement.jsx";
import { Carousel } from "@mantine/carousel";
import Autoplay from "embla-carousel-autoplay";
import SelectForm from "../../../form-builders/SelectForm.jsx";
import { useForm } from "@mantine/form";
import getConfigData from "../../../global-hook/config-data/getConfigData.js";

function StockTable({ categoryDropdown, locationData, hiddenColumns = [], visibleColumns = [] }) {
	const dispatch = useDispatch();
	const { t } = useTranslation();
	const { mainAreaHeight, isOnline } = useOutletContext();
	const height = mainAreaHeight - 120; //TabList height 104

	const navigate = useNavigate();
	const perPage = 50;
	const [page, setPage] = useState(1);
	const [opened, setOpened] = useState(false);
	const autoplay = useRef(Autoplay({ delay: 2000 }));

	const fetching = useSelector((state) => state.crudSlice.data?.stock?.fetching);
	const searchKeyword = useSelector((state) => state.crudSlice.data?.stock?.searchKeyword);
	const [indexData, setIndexData] = useState([]);
	const productFilterData = useSelector((state) => state.crudSlice.data?.stock?.filters?.product);
	const entityDataDelete = useSelector((state) => state.crudSlice.data?.stock?.entityDataDelete);

	// Sync `configData` with localStorage
	const { configData } = getConfigData();

	const [viewModal, setViewModal] = useState(false);
	const [checked, setChecked] = useState({});
	const [switchEnable, setSwitchEnable] = useState({});
	const [measurementDrawer, setMeasurementDrawer] = useState(false);
	const [id, setId] = useState("null");
	const [downloadStockXLS, setDownloadStockXls] = useState(false);

	// Configuration flags
	const isColor = configData?.is_color === 1;
	const isGrade = configData?.is_grade === 1;
	const isSize = configData?.is_size === 1;
	const isModel = configData?.is_model === 1;
	const isBrand = configData?.is_brand === 1;

	const handleSwitch = (event, item) => {
		setChecked((prev) => ({ ...prev, [item.product_id]: !prev[item.product_id] }));
		setSwitchEnable((prev) => ({ ...prev, [item.product_id]: true }));

		setTimeout(() => {
			setSwitchEnable((prev) => ({ ...prev, [item.product_id]: false }));
		}, 5000);
	};

	useEffect(() => {
		const fetchData = async () => {
			// Set fetching to true at the start
			dispatch(
				setFetching({
					fetching: true,
					message: "Fetching data...",
					module: "stock",
				})
			);

			const value = {
				url: "inventory/product",
				params: {
					term: searchKeyword,
					name: productFilterData?.name,
					alternative_name: productFilterData?.alternative_name,
					sku: productFilterData?.sku,
					sales_price: productFilterData?.sales_price,
					page: page,
					offset: perPage,
					type: "stock",
				},
				module: "stock",
			};

			try {
				if (isOnline) {
					const resultAction = await dispatch(getIndexEntityData(value));

					if (getIndexEntityData.rejected.match(resultAction)) {
						console.error("Error:", resultAction);
					} else if (getIndexEntityData.fulfilled.match(resultAction)) {
						setIndexData(resultAction.payload);
					}
				} else {
					const productsWithCategories = await window.dbAPI.getJoinedTableData({
						table1: "core_products",
						table2: "categories",
						foreignKey: "category_id",
						select: {
							table1: ["*"],
							table2: ["id", "name"],
						},
						rename: {
							"categories.id": "category_id",
							"categories.name": "category_name",
						},
					});

					setIndexData({
						data: {
							data: productsWithCategories,
							total: productsWithCategories.length,
						},
					});
				}
			} catch (err) {
				console.error("Unexpected error:", err);
			} finally {
				// Set fetching to false after data is loaded or if there's an error
				dispatch(
					setFetching({
						fetching: false,
						message: "",
						module: "stock",
					})
				);
			}
		};

		fetchData();
	}, [downloadStockXLS, searchKeyword, productFilterData, page, isOnline]);

	useEffect(() => {
		dispatch(
			setDeleteMessage({
				module: "stock",
			})
		);
		if (entityDataDelete === "success") {
			notifications.show({
				color: "red",
				title: t("DeleteSuccessfully"),
				icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
				loading: false,
				autoClose: 700,
				style: { backgroundColor: "lightgray" },
			});

			setTimeout(() => {
				dispatch(
					setFetching({
						fetching: true,
						message: "Fetching data...",
						module: "stock",
					})
				);
			}, 700);
		}
	}, [entityDataDelete]);

	useEffect(() => {
		if (downloadStockXLS) {
			const fetchData = async () => {
				const value = {
					url: "inventory/generate/stock-item/xlsx",
					params: {},
					module: "stock",
				};

				try {
					const resultAction = await dispatch(getIndexEntityData(value));
					if (getIndexEntityData.rejected.match(resultAction)) {
						console.error("Error:", resultAction);
					} else if (getIndexEntityData.fulfilled.match(resultAction)) {
						if (resultAction.payload.status === 200) {
							const href = `${
								import.meta.env.VITE_API_GATEWAY_URL + "stock-item/download"
							}`;

							const anchorElement = document.createElement("a");
							anchorElement.href = href;
							document.body.appendChild(anchorElement);
							anchorElement.click();
							document.body.removeChild(anchorElement);
						} else {
							showNotificationComponent(resultAction.payload.error, "red");
						}
					}
				} catch (err) {
					console.error("Unexpected error:", err);
				} finally {
					setDownloadStockXls(false);
				}
			};

			fetchData();
		}
	}, [downloadStockXLS, dispatch]);

	// Location Dropdown
	const form = useForm({
		initialValues: {
			location_id: "",
		},
	});
	const [locationMap, setLocationMap] = useState({});

	// Define all possible columns
	const allColumns = [
		{
			accessor: "index",
			title: t("S/N"),
			textAlignment: "right",
			render: (item) =>
				(indexData?.data?.data?.indexOf(item) || 0) + 1 + (page - 1) * perPage,
		},
		{ accessor: "category_name", title: t("Category") },
		{ accessor: "product_name", title: t("Name") },
		{ accessor: "barcode", title: t("Barcode") },
		{
			accessor: "unit_name",
			title: t("Unit"),
			render: (item) => (
				<Text
					component="a"
					size="sm"
					variant="subtle"
					c="red.4"
					onClick={() => {
						setId(item.product_id);
						setMeasurementDrawer(true);
					}}
					style={{ cursor: "pointer" }}
				>
					{item.unit_name}
				</Text>
			),
		},
		{
			accessor: "purchase_price",
			title: t("PurchasePrice"),
			textAlign: "center",
		},
		{
			accessor: "sales_price",
			title: t("SalesPrice"),
			textAlign: "center",
		},
		{
			accessor: "feature_image",
			textAlign: "center",
			title: t("Image"),
			render: (item) => {
				const baseUrl = import.meta.env.VITE_IMAGE_GATEWAY_URL;
				const imageKeys = [
					"feature_image",
					"path_one",
					"path_two",
					"path_three",
					"path_four",
				];
				const images = imageKeys
					.map((key) => item?.images?.[key])
					.filter(Boolean)
					.map((path) => `${baseUrl}/${path}`);

				return (
					<>
						<Image
							mih={50}
							mah={50}
							fit="contain"
							src={
								images.length > 0
									? images[0]
									: `https://placehold.co/120x80/FFFFFF/2f9e44?text=${encodeURIComponent(
											item.product_name
									  )}`
							}
							style={{ cursor: "pointer" }}
							onClick={() => setOpened(true)}
						/>

						<Modal
							opened={opened}
							onClose={() => setOpened(false)}
							size="lg"
							centered
							styles={{
								content: { overflow: "hidden" },
							}}
						>
							<Carousel
								withIndicators
								height={700}
								onMouseEnter={autoplay.current.stop}
								onMouseLeave={autoplay.current.reset}
							>
								{images.map((img, index) => (
									<Carousel.Slide key={index}>
										<div
											style={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												height: "100%",
												overflow: "hidden",
											}}
										>
											<Image
												src={img}
												fit="contain"
												style={{
													transition: "transform 0.3s ease-in-out",
													maxWidth: "100%",
													maxHeight: "100%",
												}}
												onMouseEnter={(e) =>
													(e.currentTarget.style.transform = "scale(1.2)")
												}
												onMouseLeave={(e) =>
													(e.currentTarget.style.transform = "scale(1)")
												}
											/>
										</div>
									</Carousel.Slide>
								))}
							</Carousel>
						</Modal>
					</>
				);
			},
		},
		{ accessor: "vat", title: t("Vat") },
		{
			accessor: "bonus_quantity",
			title: t("BonusQuantityTable"),
			textAlign: "center",
		},
		{ accessor: "quantity", title: t("Quantity"), textAlign: "center" },
		{
			accessor: "rem_quantity",
			title: t("RemainQuantity"),
			textAlign: "center",
		},
		{ accessor: "brand_name", title: t("Brand"), hidden: !isBrand },
		{ accessor: "grade_name", title: t("Grade"), hidden: !isGrade },
		{ accessor: "color_name", title: t("Color"), hidden: !isColor },
		{ accessor: "size_name", title: t("Size"), hidden: !isSize },
		{ accessor: "model_name", title: t("Model"), hidden: !isModel },
		{
			accessor: "status",
			title: t("Status"),
			render: (item) => (
				<>
					<Switch
						disabled={switchEnable[item.product_id] || false}
						checked={checked[item.product_id] || item.status == 1}
						color="red"
						radius="xs"
						size="md"
						onLabel="Enable"
						offLabel="Disable"
						onChange={(event) => {
							handleSwitch(event, item);
						}}
					/>
				</>
			),
		},
		{
			accessor: "location",
			title: t("Rack"),
			width: 120,
			textAlign: "center",
			render: (item) => (
				<>
					<SelectForm
						tooltip={t("ChooseProductLocation")}
						placeholder={t("Rack")}
						required={true}
						name={"location_id"}
						form={form}
						dropdownValue={locationData}
						id={"location_id"}
						searchable={true}
						value={locationMap[item.product_id] || null}
						changeValue={(value) => {
							setLocationMap((prev) => ({
								...prev,
								[item.product_id]: value,
							}));
						}}
					/>
				</>
			),
		},
		{
			accessor: "action",
			title: t("Action"),
			textAlign: "right",
			render: (item) => (
				<Group gap={4} justify="right" wrap="nowrap">
					<Button
						component="a"
						size="compact-xs"
						radius="xs"
						variant="filled"
						fw={"100"}
						fz={"12"}
						color="red.3"
						mr={"4"}
					>
						{" "}
						{t("View")}
					</Button>
					{!item.parent_id && (
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
									<IconDotsVertical height={"18"} width={"18"} stroke={1.5} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									onClick={() => {
										dispatch(setInsertType("update"));
										dispatch(
											editEntityData("inventory/product/" + item.product_id)
										);
										dispatch(setFormLoading(true));
										navigate(`/inventory/product/${item.product_id}`);
									}}
								>
									{t("Edit")}
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
												<Text size="md"> {t("FormConfirmationTitle")}</Text>
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
												console.log("ok pressed");
											},
										});
									}}
									rightSection={
										<IconTrashX
											style={{
												width: rem(14),
												height: rem(14),
											}}
										/>
									}
								>
									{t("Delete")}
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					)}
				</Group>
			),
		},
	];

	// Filter columns based on props
	const filteredColumns = allColumns.filter((column) => {
		// If visibleColumns is provided, only show those columns
		if (visibleColumns.length > 0) {
			return visibleColumns.includes(column.accessor);
		}
		// Otherwise, show all columns except those in hiddenColumns
		return !hiddenColumns.includes(column.accessor);
	});

	return (
		<>
			<Box
				pl={`xs`}
				pb={"xs"}
				pr={8}
				pt={"xs"}
				mb={"xs"}
				className={"boxBackground borderRadiusAll"}
			>
				<__StockSearch
					module={"stock"}
					setDownloadStockXls={setDownloadStockXls}
					categoryDropdown={categoryDropdown}
				/>
			</Box>
			<Box className={"borderRadiusAll"}>
				<DataTable
					classNames={{
						root: tableCss.root,
						table: tableCss.table,
						header: tableCss.header,
						footer: tableCss.footer,
						pagination: tableCss.pagination,
					}}
					records={indexData?.data?.data || []}
					columns={filteredColumns}
					fetching={fetching || downloadStockXLS}
					totalRecords={indexData?.data?.total}
					recordsPerPage={perPage}
					page={page}
					onPageChange={(p) => {
						setPage(p);
						dispatch(
							setFetching({
								fetching: true,
								message: "Fetching data...",
								module: "stock",
							})
						);
					}}
					loaderSize="xs"
					loaderColor="grape"
					height={height}
					scrollAreaProps={{ type: "never" }}
				/>
			</Box>
			{viewModal && <OverviewModal viewModal={viewModal} setViewModal={setViewModal} />}
			{measurementDrawer && (
				<AddMeasurement
					measurementDrawer={measurementDrawer}
					setMeasurementDrawer={setMeasurementDrawer}
					id={id}
				/>
			)}
		</>
	);
}

export default StockTable;
