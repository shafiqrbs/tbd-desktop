import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useViewportSize } from "@mantine/hooks";
import { AppShell } from "@mantine/core";
import Header from "./Header";
import Footer from "./Footer";
import MainDashboard from "../modules/dashboard/MainDashboard";
import commonDataStoreIntoLocalStorage from "../global-hook/local-storage/commonDataStoreIntoLocalStorage";

const Layout = () => {
	const [isOnline, setNetworkStatus] = useState(navigator.onLine);
	const { height } = useViewportSize();
	const paramPath = window.location.pathname;
	const [configData, setConfigData] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const user = JSON.parse(localStorage.getItem("user") || "{}");

	useEffect(() => {
		const handleNetworkStatus = () => setNetworkStatus(window.navigator.onLine);
		window.addEventListener("offline", handleNetworkStatus);
		window.addEventListener("online", handleNetworkStatus);
		return () => {
			window.removeEventListener("online", handleNetworkStatus);
			window.removeEventListener("offline", handleNetworkStatus);
		};
	}, []);

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
				<Header isOnline={isOnline} configData={configData} />
			</AppShell.Header>
			<AppShell.Main>
				{paramPath !== "/" ? (
					<Outlet context={{ isOnline, mainAreaHeight }} />
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
