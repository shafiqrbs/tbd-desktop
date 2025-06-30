import { useState, useMemo, useEffect } from "react";
import { Box, Grid, Tabs } from "@mantine/core";
import _SalesTable from "./_SalesTable";
import tabCss from "../../../../assets/css/Tab.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getIndexEntityData } from "../../../../store/core/crudSlice";

// =============== static tab options for sales views ================
const TAB_OPTIONS = [
	{ key: "all", label: "All Sales" },
	{ key: "today", label: "Today" },
	{ key: "week", label: "This Week" },
	{ key: "month", label: "This Month" },
	{ key: "credit", label: "Credit Sales" },
	{ key: "cash", label: "Cash Sales" },
];

export default function SalesOverviewTabs({ fetching: parentFetching }) {
	// =============== state for selected tab ================
	const [activeTab, setActiveTab] = useState("all");
	const [data, setData] = useState({});
	const [fetching, setFetchingState] = useState(true);
	const dispatch = useDispatch();
	const salesFilterData = useSelector((state) => state.crudSlice.data?.sales?.filters?.sales);

	// =============== fetch data on mount and when filters change ================
	useEffect(() => {
		const fetchData = async () => {
			setFetchingState(true);
			const options = {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			};
			const value = {
				url: "inventory/sales",
				params: {
					term: salesFilterData?.searchKeyword || "",
					customer_id: salesFilterData?.customer_id || "",
					start_date:
						(salesFilterData?.start_date &&
							new Date(salesFilterData?.start_date).toLocaleDateString(
								"en-CA",
								options
							)) ||
						"",
					end_date:
						(salesFilterData?.end_date &&
							new Date(salesFilterData?.end_date || Date.now()).toLocaleDateString(
								"en-CA",
								options
							)) ||
						"",
					page: 1,
					offset: 1000,
				},
				module: "sales",
			};
			try {
				const resultAction = await dispatch(getIndexEntityData(value));
				if (getIndexEntityData.fulfilled.match(resultAction)) {
					setData(resultAction?.payload);
				}
			} catch (err) {
				console.error("Unexpected error:", err);
			} finally {
				setFetchingState(false);
			}
		};
		fetchData();
	}, [salesFilterData]);

	// =============== filter logic for each tab ================
	const filteredData = useMemo(() => {
		if (!data?.data?.data) return { ...data, data: { ...data?.data, data: [] } };
		const sales = data.data.data;
		const now = new Date();
		if (activeTab === "today") {
			return {
				...data,
				data: {
					...data.data,
					data: sales.filter((item) => {
						if (!item.created) return false;
						const [day, month, year] = item.created.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						return (
							itemDate.getDate() === now.getDate() &&
							itemDate.getMonth() === now.getMonth() &&
							itemDate.getFullYear() === now.getFullYear()
						);
					}),
				},
			};
		}
		if (activeTab === "week") {
			const startOfWeek = new Date(now);
			startOfWeek.setDate(now.getDate() - now.getDay());
			startOfWeek.setHours(0, 0, 0, 0);
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			endOfWeek.setHours(23, 59, 59, 999);
			return {
				...data,
				data: {
					...data.data,
					data: sales.filter((item) => {
						if (!item.created) return false;
						const [day, month, year] = item.created.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						return itemDate >= startOfWeek && itemDate <= endOfWeek;
					}),
				},
			};
		}
		if (activeTab === "month") {
			return {
				...data,
				data: {
					...data.data,
					data: sales.filter((item) => {
						if (!item.created) return false;
						const [day, month, year] = item.created.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						return (
							itemDate.getMonth() === now.getMonth() &&
							itemDate.getFullYear() === now.getFullYear()
						);
					}),
				},
			};
		}
		if (activeTab === "credit") {
			return {
				...data,
				data: {
					...data.data,
					data: sales.filter((item) => item.mode_name?.toLowerCase() === "credit"),
				},
			};
		}
		if (activeTab === "cash") {
			return {
				...data,
				data: {
					...data.data,
					data: sales.filter((item) => item.mode_name?.toLowerCase() === "cash"),
				},
			};
		}
		// default: all
		return data;
	}, [activeTab, data]);

	return (
		<Grid columns={24} gutter={{ base: 8 }}>
			<Grid.Col span={4}>
				<p>Sales Overview</p>
				<Box mt={8} mb={18} h={2} w="56px" bg="red" />
				{/* =============== mantine tabs with custom style ================ */}
				<Tabs
					color="#f8eedf"
					value={activeTab}
					onChange={setActiveTab}
					variant="pills"
					keepMounted={false}
					orientation="vertical"
					w="100%"
					styles={{
						tab: {
							background: "#f1f3f5",
						},
					}}
					classNames={{
						tab: tabCss.tab,
					}}
				>
					<Tabs.List w="100%">
						{TAB_OPTIONS.map((tab) => (
							<Tabs.Tab key={tab.key} value={tab.key} h={40} w="100%">
								{tab.label}
							</Tabs.Tab>
						))}
					</Tabs.List>
				</Tabs>
				{/* =============== sales table for selected tab ================ */}
			</Grid.Col>
			<Grid.Col span={20}>
				<_SalesTable
					data={filteredData}
					fetching={fetching || parentFetching}
					showDetails={false}
				/>
			</Grid.Col>
		</Grid>
	);
}
