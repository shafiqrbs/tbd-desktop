import { Route, Routes } from "react-router";
import Login from "./components/Login";
import Layout from "./components/layout/Layout";

export default function AppRoute() {
	return (
		<Routes>
			<Route path="/login" element={<Login />} />
			<Route path="/" element={<Layout />}>
				<Route index element={<h1>Test</h1>} />
			</Route>
		</Routes>
	);
}
