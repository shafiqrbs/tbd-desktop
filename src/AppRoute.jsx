import { Route, Routes } from "react-router";
import Login from "./components/Login";
import Activate from "./components/Activate";
import NotFound from "./components/NotFound";
import Layout from "./components/layout/Layout";
import VendorIndex from "./components/modules/core/vendor/VendorIndex";
import SalesIndex from "./components/modules/inventory/sales/SalesIndex";
// import PurchaseEdit from "./components/modules/inventory/purchase/PurchaseEdit";
import PurchaseIndex from "./components/modules/inventory/purchase/PurchaseIndex";
import PurchaseInvoice from "./components/modules/inventory/purchase/PurchaseInvoice";
// import SalesEdit from "./components/modules/inventory/sales/SalesEdit";
import SalesInvoice from "./components/modules/inventory/sales/SalesInvoice.jsx";
import BakeryIndex from "./components/modules/pos/bakery/BakeryIndex";

export default function AppRoute() {
	return (
		<Routes>
			<Route path="/activate" element={<Activate />} />
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Layout />}>
				<Route path="core">
					<Route index path="vendor" element={<VendorIndex />} />
					<Route path="vendor/:id" element={<VendorIndex />} />
				</Route>
				<Route path="inventory">
					{/* <Route path="sales/edit/:id" element={<SalesEdit />} /> */}
					<Route path="sales" element={<SalesIndex />} />
					{/* <Route path="sales" element={<DashboardBarChart />} /> */}
					{/* <Route path="sales" element={<TestInput />} /> */}
					<Route path="purchase" element={<PurchaseIndex />} />
					<Route path="sales-invoice" element={<SalesInvoice />} />
					{/* <Route path="purchase/edit/:id" element={<PurchaseEdit />} /> */}
					<Route path="purchase-invoice" element={<PurchaseInvoice />} />
				</Route>
				<Route path="pos">
					<Route path="bakery" element={<BakeryIndex />} />
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
