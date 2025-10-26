import { useState, useMemo, useEffect } from "react";
import { Box, Grid, Tabs } from "@mantine/core";
import _SalesTable from "./_SalesTable";
import tabCss from "../../../../assets/css/Tab.module.css";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "../../../../store/core/crudSlice";
import { useOutletContext } from "react-router";

// =============== static tab options for sales views ================
const TAB_OPTIONS = [
	{ key: "all", label: "All Sales" },
	{ key: "today", label: "Today" },
	{ key: "week", label: "This Week" },
	{ key: "month", label: "This Month" },
	{ key: "cash", label: "Cash Sales" },
	{ key: "discount_type", label: "Flat Sales" },
];

export default function SalesOverviewTabs({ fetching: parentFetching }) {
	// =============== state for selected tab ================
	const [activeTab, setActiveTab] = useState("all");
	const [salesData, setSalesData] = useState({});
	const { isOnline } = useOutletContext();
	const dispatch = useDispatch();

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		const value = {
			url: "inventory/sales",
			params: {
				term: "",
				customer_id: "",
				start_date: "",
				end_date: "",
				page: 1,
				offset: 50,
			},
			module: "sales",
		};
		if (isOnline) {
			const resultAction = await dispatch(getIndexEntityData(value));

			if (getIndexEntityData.rejected.match(resultAction)) {
				console.error("Error:", resultAction);
			} else if (getIndexEntityData.fulfilled.match(resultAction)) {
				setSalesData(resultAction?.payload);
			}
		} else {
			const result = await window.dbAPI.getDataFromTable("sales");
			setSalesData({
				data: {
					data: result,
				},
			});
		}
	};

	// =============== filter logic for each tab ================
	const filteredData = useMemo(() => {
		if (!salesData?.data?.data) return { ...salesData, data: { ...salesData?.data, data: [] } };
		const sales = salesData.data.data;
		const now = new Date();
		if (activeTab === "today") {
			const result = {
				...salesData,
				data: {
					...salesData.data,
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
			console.log(result);
			return result;
		}
		if (activeTab === "week") {
			const startOfWeek = new Date(now);
			startOfWeek.setDate(now.getDate() - now.getDay());
			startOfWeek.setHours(0, 0, 0, 0);
			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			endOfWeek.setHours(23, 59, 59, 999);
			const result = {
				...salesData,
				data: {
					...salesData.data,
					data: sales.filter((item) => {
						if (!item.created) return false;
						const [day, month, year] = item.created.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						return itemDate >= startOfWeek && itemDate <= endOfWeek;
					}),
				},
			};
			console.log(result);
			return result;
		}
		if (activeTab === "month") {
			const result = {
				...salesData,
				data: {
					...salesData.data,
					data: sales.filter((item) => {
						if (!item.created) return false;
						const [day, month, year] = item.created.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
					}),
				},
			};
			console.log(result);
			return result;
		}
		if (activeTab === "cash") {
			console.log(sales);
			const result = {
				...salesData,
				data: {
					...salesData.data,
					data: sales.filter((item) => item.mode_name?.toLowerCase() === "cash"),
				},
			};
			console.log(result);
			return result;
		}
		if (activeTab === "discount_type") {
			const result = {
				...salesData,
				data: {
					...salesData.data,
					data: sales.filter((item) => item.discount_type?.toLowerCase() === "flat"),
				},
			};
			console.log(result);
			return result;
		}
		// default: all
		return salesData;
	}, [activeTab, salesData]);

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
				<_SalesTable data={filteredData} fetching={parentFetching} />
			</Grid.Col>
		</Grid>
	);
}
