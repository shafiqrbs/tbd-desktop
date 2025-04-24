import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { MantineProvider, createTheme } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { HashRouter } from "react-router";
import "./i18n.js";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/charts/styles.css";
import "mantine-datatable/styles.layer.css";

const theme = createTheme({
	primaryColor: "indigo",
	fontFamily: "Open Sans, sans-serif",
});

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<HashRouter>
			<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
				<Notifications />
				<App />
			</MantineProvider>
		</HashRouter>
	</StrictMode>
);
