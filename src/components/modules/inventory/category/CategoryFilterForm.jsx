import { useState } from "react";
import { rem, Grid, Tooltip, TextInput, ActionIcon } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconFilter, IconInfoCircle, IconRestore, IconSearch, IconX } from "@tabler/icons-react";
import { useHotkeys } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFetching, setSearchKeyword, resetFilters } from "../../../../store/core/crudSlice.js";
import FilterModel from "../../filter/FilterModel.jsx";

function CategoryFilterForm(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [searchKeywordTooltip, setSearchKeywordTooltip] = useState(false);
	const [filterModel, setFilterModel] = useState(false);

	// Get filter data from core slice
	const filters = useSelector((state) => {
		const moduleGroup = getModuleGroup(props.module);
		return state.crud?.data?.[moduleGroup]?.filters || {};
	});

	const searchKeyword = useSelector((state) => state.crud?.data?.core?.searchKeyword || "");

	// Helper function to determine module group
	const getModuleGroup = (module) => {
		switch (module) {
			case "category":
				return "inventory";
			default:
				return module;
		}
	};

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
				filterKey: "category",
			})
		);
	};

	return (
		<>
			<Grid justify="flex-end" align="flex-end">
				<Grid.Col span={3}>
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
						transitionProps={{ transition: "pop-bottom-left", duration: 5000 }}
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
				<Grid.Col span={2}>
					<ActionIcon.Group mt="1">
						<ActionIcon
							variant="transparent"
							c="red.4"
							size="lg"
							mr={16}
							aria-label="Filter"
							onClick={() => {
								if (searchKeyword.length > 0) {
									dispatch(setFetching(true));
									setSearchKeywordTooltip(false);
								} else {
									setSearchKeywordTooltip(true);
									setTimeout(() => setSearchKeywordTooltip(false), 1500);
								}
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
								<IconSearch style={{ width: rem(20) }} stroke={2.0} />
							</Tooltip>
						</ActionIcon>

						<ActionIcon
							variant="transparent"
							size="lg"
							c="gray.6"
							mr={16}
							aria-label="Settings"
							onClick={() => setFilterModel(true)}
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
								<IconFilter style={{ width: rem(20) }} stroke={2.0} />
							</Tooltip>
						</ActionIcon>

						<ActionIcon
							variant="transparent"
							c="gray.6"
							size="lg"
							aria-label="Settings"
						>
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
									style={{ width: rem(20) }}
									stroke={2.0}
									onClick={handleReset}
								/>
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

export default CategoryFilterForm;
