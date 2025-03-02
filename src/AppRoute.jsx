import { Route, Routes } from "react-router";
import Login from "./components/Login";
import Layout from "./components/layout/Layout";
import VendorIndex from "./components/modules/core/vendor/VendorIndex";
import NotFound from "./components/NotFound";

export default function AppRoute() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Layout />}>
				<Route path="core">
					<Route index path="vendor" element={<VendorIndex />} />
					<Route path="vendor/:id" element={<VendorIndex />} />
				</Route>
			</Route>
			<Route path="*" element={<NotFound />} />
		</Routes>
	);
}
