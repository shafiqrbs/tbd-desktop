import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useViewportSize } from "@mantine/hooks";
import { AppShell, Center, Loader } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";
import { useNetwork } from "@mantine/hooks";
import getConfigData from "../global-hook/config-data/getConfigData";
import { useDispatch } from "react-redux";
import { setMenu } from "../../store/core/crudSlice";

const Layout = () => {
	const networkStatus = useNetwork();
	const { height } = useViewportSize();
	const location = useLocation();
	const paramPath = location.pathname;
	const [isLoading, setIsLoading] = useState(true);
	const [activated, setActivated] = useState(null);
	const [user, setUser] = useState(null);
	const { configData } = getConfigData();
	const dispatch = useDispatch();

	useEffect(() => {
		const initializeData = async () => {
			try {
				const [activationData, user] = await Promise.all([
					window.dbAPI.getDataFromTable("license_activate"),
					window.dbAPI.getDataFromTable("users"),
				]);

				setActivated(activationData);
				setUser(user);

				if (user?.id) {
					if (!configData || Object.keys(configData).length === 0) {
						const configRes = await window.dbAPI.getDataFromTable("config-data");
						if (configRes) {
							dispatch(
								setMenu({
									module: "core",
									value: {
										...configRes,
										business_model: JSON.parse(
											configRes.business_model || "{}"
										),
										currency: JSON.parse(configRes.currency || "{}"),
										domain: JSON.parse(configRes.domain || "{}"),
									},
								})
							);
						}
					}
				}
			} catch (error) {
				console.error("Error initializing data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		initializeData();
	}, []);

	if (isLoading) {
		return (
			<Center h="100vh">
				<Loader size="lg" />
			</Center>
		);
	}

	if ((activated?.user_id !== user?.id) || !activated?.active) {
		return <Navigate replace to="/activate" />;
	}

	if (!user?.id) {
		return <Navigate replace to="/login" />;
	}

	const headerHeight = 42;
	const footerHeight = 58;
	const padding = 0;
	const mainAreaHeight = height - headerHeight - footerHeight - padding;

	return (
		<AppShell padding="0">
			<AppShell.Header height={headerHeight} bg="gray.0">
				<Header isOnline={networkStatus.online} configData={configData} />
			</AppShell.Header>
			<AppShell.Main>
				{paramPath !== "/" ? (
					<Outlet context={{ isOnline: networkStatus.online, mainAreaHeight }} />
				) : (
					<MainDashboard height={mainAreaHeight} configData={configData} />
				)}
			</AppShell.Main>
			<AppShell.Footer height={footerHeight}>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
};

export default Layout;
