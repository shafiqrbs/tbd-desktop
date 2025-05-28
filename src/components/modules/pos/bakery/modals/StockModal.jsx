import StockTable from "../../../inventory/stock/StockTable";
import getSettingParticularDropdownData from "../../../../global-hook/dropdown/getSettingParticularDropdownData.js";
import { useSelector } from "react-redux";

export default function StockModal() {
	const categoryDropdownData = useSelector((state) => state.utilitySlice.categoryDropdownData);
	const categoryDropdown = categoryDropdownData?.map((type) => {
		return { label: type.name, value: String(type.id) };
	});

	const locationData = getSettingParticularDropdownData("location");
	return (
		<StockTable
			categoryDropdown={categoryDropdown}
			locationData={locationData}
			visibleColumns={[
				"index",
				"category_name",
				"product_name",
				"unit_name",
				"purchase_price",
				"sales_price",
				"quantity",
			]}
		/>
	);
}
