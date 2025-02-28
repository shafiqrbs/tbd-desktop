import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter, HashRouter } from "react-router";
import "./i18n.js";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

const theme = createTheme({
	primaryColor: "indigo",
	fontFamily: "Open Sans, sans-serif",
});

const Router = import.meta.env.MODE === "development" ? BrowserRouter : HashRouter;

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Router>
			<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
				<Notifications />
				<App />
			</MantineProvider>
		</Router>
	</StrictMode>
);
