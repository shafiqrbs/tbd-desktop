import { ModalsProvider } from "@mantine/modals";
import "./lang/i18next";

import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import AppRoute from "./AppRoute";

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ModalsProvider>
					<AppRoute />
				</ModalsProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;
