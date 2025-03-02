import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useViewportSize } from "@mantine/hooks";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";
import commonDataStoreIntoLocalStorage from "../global-hook/local-storage/commonDataStoreIntoLocalStorage";
import { useNetwork } from "@mantine/hooks";

const Layout = () => {
	const networkStatus = useNetwork();
	const { height } = useViewportSize();
	const location = useLocation();
	const paramPath = location.pathname;
	const [configData, setConfigData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem("user") || "{}");

	useEffect(() => {
		const initializeData = async () => {
			if (user?.id && !isLoading) {
				setIsLoading(true);
				try {
					await commonDataStoreIntoLocalStorage(user.id);
					const storedConfigData = localStorage.getItem("config-data");
					if (storedConfigData) {
						setConfigData(JSON.parse(storedConfigData));
					}
				} catch (error) {
					console.error("Error initializing data:", error);
					// Don't clear localStorage here, just log the error
				} finally {
					setIsLoading(false);
				}
			}
		};

		initializeData();
	}, [user?.id]);

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
					<MainDashboard height={mainAreaHeight} />
				)}
			</AppShell.Main>
			<AppShell.Footer height={footerHeight}>
				<Footer />
			</AppShell.Footer>
		</AppShell>
	);
};

export default Layout;
