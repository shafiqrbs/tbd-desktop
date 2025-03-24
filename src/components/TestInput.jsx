import { TextInput } from "@mantine/core";

export default function TestInput() {
	return (
		<TextInput
			label="App name"
			placeholder="Appza"
			defaultValue={appBuildSettings?.app_name}
			onChange={(event) => {
				setAppBuildSettings({ ...appBuildSettings, app_name: event.currentTarget.value });

				console.log(appBuildSettings.app_name);
			}}
		/>
	);
}
