import { NavLink, Outlet } from "react-router";

export default function Layout() {
	return (
		<div>
			<NavLink to="/login">Login</NavLink>
			<Outlet />
		</div>
	);
}
