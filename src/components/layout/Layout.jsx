import { Outlet } from "react-router";
import { Button } from "@mantine/core";

export default function Layout() {
	return (
		<div>
			<Button variant="filled" color="violet" radius="xl">
				Button change
			</Button>
			<Button variant="outline">I am another button</Button>
			<Outlet />
		</div>
	);
}
