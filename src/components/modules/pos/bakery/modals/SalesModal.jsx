import SalesOverviewTabs from "../../../inventory/sales/SalesOverviewTabs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getIndexEntityData } from "../../../../../store/core/crudSlice.js";
import { useOutletContext } from "react-router";

export default function SalesModal() {
	const { isOnline } = useOutletContext();
	const dispatch = useDispatch();
	const [salesFilterData, setSalesFilterData] = useState({
		searchKeyword: "",
		customer_id: "",
		start_date: "",
		end_date: "",
	});

	const [fetching, setFetching] = useState(false);
	const [indexData, setIndexData] = useState({
		data: {
			data: [],
			total: 0,
		},
	});

	// indexData.data.data // i am getting sales data here in an array of objects

	// 	{
	//     "id": 15,
	//     "created": "24-06-2025",
	//     "invoice": "INV-062500009",
	//     "sub_total": 650,
	//     "total": 650,
	//     "approved_by_id": 3,
	//     "payment": 650,
	//     "discount": null,
	//     "is_domain_sales_completed": null,
	//     "discount_calculation": 0,
	//     "discount_type": "Flat",
	//     "invoice_batch_id": null,
	//     "customerId": 2,
	//     "customerName": "Default",
	//     "customerMobile": "01521434990",
	//     "createdByUser": "sandra_foods",
	//     "createdByName": "sandrafoods",
	//     "createdById": 3,
	//     "salesById": 3,
	//     "salesByUser": "sandra_foods",
	//     "salesByName": "sandrafoods",
	//     "process": null,
	//     "mode_name": "Cash",
	//     "customer_address": null,
	//     "customer_group": "Domain",
	//     "balance": null,
	//     "sales_items": [
	//         {
	//             "id": 49,
	//             "sale_id": 15,
	//             "product_id": 686,
	//             "unit_id": 44,
	//             "item_name": "Burger Bun",
	//             "name": "Burger Bun",
	//             "uom": "Pcs",
	//             "quantity": 10,
	//             "sales_price": 65,
	//             "purchase_price": 0,
	//             "price": 65,
	//             "sub_total": 650,
	//             "bonus_quantity": 0,
	//             "warehouse_name": null,
	//             "warehouse": null,
	//             "warehouse_location": null,
	//             "warehouse_id": null
	//         }
	//     ]
	// }

	// this is the single data structure

	useEffect(() => {
		fetchData();
	}, [salesFilterData]);

	const fetchData = async (page = 1, perPage = 10) => {
		setFetching(true);
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
				page: page,
				offset: perPage,
			},
			module: "sales",
		};

		try {
			if (isOnline) {
				const resultAction = await dispatch(getIndexEntityData(value));

				if (getIndexEntityData.rejected.match(resultAction)) {
					console.error("Error:", resultAction);
				} else if (getIndexEntityData.fulfilled.match(resultAction)) {
					setIndexData(resultAction?.payload);
				}
			} else {
				const result = await window.dbAPI.getDataFromTable("sales");
				let filteredData = [...result];

				if (salesFilterData?.searchKeyword) {
					const searchTerm = salesFilterData.searchKeyword?.trim()?.toLowerCase() || "";
					filteredData = filteredData.filter(
						(item) =>
							item.invoice?.toLowerCase().includes(searchTerm) ||
							item.customerName?.toLowerCase().includes(searchTerm) ||
							item.customerMobile?.toLowerCase().includes(searchTerm) ||
							item.customer_address?.toLowerCase().includes(searchTerm)
					);
				}

				if (salesFilterData?.customer_id) {
					filteredData = filteredData.filter(
						(item) => item.customerId === Number(salesFilterData.customer_id)
					);
				}

				if (salesFilterData?.start_date) {
					const startDate = new Date(salesFilterData.start_date);
					startDate.setHours(0, 0, 0, 0);
					filteredData = filteredData.filter((item) => {
						if (!item.created) return false;
						// strip out time portion if present and parse date from "DD-MM-YYYY" format
						const dateOnly = item.created.split(",")[0]; // remove time portion if exists
						const [day, month, year] = dateOnly.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						itemDate.setHours(0, 0, 0, 0);
						return itemDate >= startDate;
					});
				}

				if (salesFilterData?.end_date) {
					const endDate = new Date(salesFilterData.end_date);
					endDate.setHours(23, 59, 59, 999);
					filteredData = filteredData.filter((item) => {
						if (!item.created) return false;
						// strip out time portion if present and parse date from "DD-MM-YYYY" format
						const dateOnly = item.created.split(",")[0]; // remove time portion if exists
						const [day, month, year] = dateOnly.split("-");
						const itemDate = new Date(Number(year), Number(month) - 1, Number(day));
						itemDate.setHours(0, 0, 0, 0);
						return itemDate <= endDate;
					});
				}

				filteredData.reverse();

				const totalRecords = filteredData.length;
				const startIndex = (page - 1) * perPage;
				const endIndex = startIndex + perPage;
				const paginatedData = filteredData.slice(startIndex, endIndex);

				setIndexData({
					data: {
						data: paginatedData,
						total: totalRecords,
					},
				});
			}
		} catch (err) {
			console.error("Unexpected error:", err);
		} finally {
			setFetching(false);
		}
	};
	return <SalesOverviewTabs data={indexData} fetching={fetching} />;
}
