import { useState, useMemo } from "react";
import { useOutletContext } from "react-router";
import { rem, Grid, Tooltip, TextInput, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconFilter,
	IconInfoCircle,
	IconRestore,
	IconSearch,
	IconX,
	IconPdf,
	IconFileTypeXls,
} from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFetching, setSearchKeyword, resetFilters } from "../../../store/core/crudSlice.js";
import FilterModel from "./FilterModel.jsx";

function KeywordSearch(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline } = useOutletContext();

	const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
	const [filterModel, setFilterModel] = useState(false);

	// Helper function to determine module group
	const getModuleGroup = (module) => {
		switch (module) {
			case "customer":
			case "vendor":
			case "user":
			case "warehouse":
			case "category-group":
				return "core";
			case "product":
			case "category":
				return "inventory";
			case "production-setting":
				return "production";
			default:
				return module;
		}
	};

	// Helper function to get filter key
	const getFilterKey = (module) => {
		switch (module) {
			case "category-group":
				return "categoryGroup";
			case "production-setting":
				return "setting";
			default:
				return module;
		}
	};

	// Fix: Use useSelector instead of useMemo with state
	const filters = useSelector((state) => {
		const moduleGroup = getModuleGroup(props.module);
		return state?.crud?.data?.[moduleGroup]?.filters || {};
	});

	const searchKeyword = useSelector((state) => {
		const moduleGroup = getModuleGroup(props.module);
		return state?.crud?.data?.[moduleGroup]?.searchKeyword || "";
	});

	useHotkeys([["alt+F", () => document.getElementById("SearchKeyword").focus()]], []);

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && searchKeyword.length > 0) {
			dispatch(setFetching(true));
			setSearchKeywordTooltip(false);
		} else {
			setSearchKeywordTooltip(true);
			setTimeout(() => setSearchKeywordTooltip(false), 1500);
		}
	};

	const handleReset = () => {
		const moduleGroup = getModuleGroup(props.module);
		const filterKey = getFilterKey(props.module);

		dispatch(setFetching(true));

		// Reset search keyword
		dispatch(
			setSearchKeyword({
				module: moduleGroup,
				value: "",
			})
		);

		// Reset filters
		dispatch(
			resetFilters({
				module: moduleGroup,
				filterKey,
			})
		);
	};

	return (
		<>
			<Grid justify="space-between" align="stretch" gutter={{ base: 2 }} grow>
				<Grid.Col span="8">
					<Tooltip
						label={t("EnterSearchAnyKeyword")}
						opened={searchKeywordTooltip}
						px={16}
						py={2}
						position="top-end"
						color="red"
						withArrow
						offset={2}
						zIndex={100}
						transitionProps={{ transition: "pop-bottom-left", duration: 1000 }}
					>
						<TextInput
							leftSection={<IconSearch size={16} opacity={0.5} />}
							size="sm"
							placeholder={t("EnterSearchAnyKeyword")}
							onKeyDown={handleKeyDown}
							onChange={(e) => {
								const value = e.currentTarget.value;
								dispatch({
									type: "crud/setSearchKeyword",
									payload: {
										module: getModuleGroup(props.module),
										value,
									},
								});

								if (!value) {
									setSearchKeywordTooltip(true);
									setTimeout(() => setSearchKeywordTooltip(false), 1000);
								} else {
									setSearchKeywordTooltip(false);
								}
							}}
							value={searchKeyword}
							id="SearchKeyword"
							rightSection={
								searchKeyword ? (
									<Tooltip label={t("Close")} withArrow bg="red.5">
										<IconX
											color="red"
											size={16}
											opacity={0.5}
											onClick={() => {
												dispatch({
													type: "crud/setSearchKeyword",
													payload: {
														module: getModuleGroup(props.module),
														value: "",
													},
												});
											}}
										/>
									</Tooltip>
								) : (
									<Tooltip
										label={t("FieldIsRequired")}
										withArrow
										position="bottom"
										c="red"
										bg="red.1"
									>
										<IconInfoCircle size={16} opacity={0.5} />
									</Tooltip>
								)
							}
						/>
					</Tooltip>
				</Grid.Col>
				<Grid.Col span="auto">
					<ActionIcon.Group mt="1" justify="center">
						<ActionIcon
							variant="default"
							c="red.4"
							size="lg"
							aria-label="Filter"
							onClick={() => {
								searchKeyword.length > 0
									? (dispatch(setFetching(true)), setSearchKeywordTooltip(false))
									: (setSearchKeywordTooltip(true),
									  setTimeout(() => {
											setSearchKeywordTooltip(false);
									  }, 1500));
							}}
						>
							<Tooltip
								label={t("SearchButton")}
								px={16}
								py={2}
								withArrow
								position="bottom"
								c="red"
								bg="red.1"
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconSearch style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
						<ActionIcon
							variant="default"
							size="lg"
							c="gray.6"
							aria-label="Settings"
							onClick={(e) => {
								setFilterModel(true);
							}}
						>
							<Tooltip
								label={t("FilterButton")}
								px={16}
								py={2}
								withArrow
								position="bottom"
								c="red"
								bg="red.1"
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconFilter style={{ width: rem(18) }} stroke={1.0} />
							</Tooltip>
						</ActionIcon>
						<ActionIcon variant="default" c="gray.6" size="lg" aria-label="Settings">
							<Tooltip
								label={t("ResetButton")}
								px={16}
								py={2}
								withArrow
								position="bottom"
								c="red"
								bg="red.1"
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconRestore
									style={{ width: rem(18) }}
									stroke={1.5}
									onClick={handleReset}
								/>
							</Tooltip>
						</ActionIcon>
						<ActionIcon
							variant="default"
							c="green.8"
							size="lg"
							aria-label="Filter"
							onClick={() => {
								searchKeyword.length > 0
									? (dispatch(setFetching(true)), setSearchKeywordTooltip(false))
									: (setSearchKeywordTooltip(true),
									  setTimeout(() => {
											setSearchKeywordTooltip(false);
									  }, 1500));
							}}
						>
							<Tooltip
								label={t("DownloadPdfFile")}
								px={16}
								py={2}
								withArrow
								position="bottom"
								c="red"
								bg="red.1"
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconPdf style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>

						<ActionIcon
							variant="default"
							c="green.8"
							size="lg"
							aria-label="Filter"
							onClick={() => {
								if (props.module === "stock") {
									props.setDownloadStockXls(true);
								}
							}}
						>
							<Tooltip
								label={t("DownloadExcelFile")}
								px={16}
								py={2}
								withArrow
								position="bottom"
								c="red"
								bg="red.1"
								transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
							>
								<IconFileTypeXls style={{ width: rem(18) }} stroke={1.5} />
							</Tooltip>
						</ActionIcon>
					</ActionIcon.Group>
				</Grid.Col>
			</Grid>

			{filterModel && (
				<FilterModel
					filterModel={filterModel}
					setFilterModel={setFilterModel}
					module={props.module}
				/>
			)}
		</>
	);
}

export default KeywordSearch;
