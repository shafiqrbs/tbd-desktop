import {
	Group,
	Menu,
	rem,
	ActionIcon,
	Text,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "../../../../assets/css/HeaderSearch.module.css";
import {
	IconInfoCircle,
	IconSettings,
	IconTable,
} from "@tabler/icons-react";
import { NavLink, useLocation, useNavigate } from "react-router";

function _SalesPurchaseHeaderNavbar(props) {
	const { t } = useTranslation();
	const links = [
		{ link: "/inventory/sales", label: t("Sales") },
		{ link: "/inventory/sales-invoice", label: t("NewSales") },
		{ link: "/inventory/purchase", label: t("Purchase") },
		{ link: "/inventory/purchase-invoice", label: t("NewPurchase") },
	];
	const { pageTitle } = props;
	const navigate = useNavigate();
	const location = useLocation();

	const items = links.map((link) => (
		<NavLink
			key={link.label}
			// onClick={() => navigate(link.link)}
			to={link.link}
			className={location.pathname == link.link ? classes.active : classes.link}
		>
			{link.label}
		</NavLink>
	));
	return (
		<>
			<header className={classes.header}>
				<div className={classes.inner}>
					<Group ml={10}>
						<Text>{pageTitle}</Text>
					</Group>
					<Group>
						<Group ml={50} gap={5} className={classes.links} visibleFrom="sm" mt={"2"}>
							{items}
						</Group>
						<Menu
							withArrow
							arrowPosition="center"
							trigger="hover"
							openDelay={100}
							closeDelay={400}
							mr={"8"}
						>
							<Menu.Target>
								<ActionIcon
									mt={"4"}
									variant="filled"
									color="red.5"
									radius="xl"
									aria-label="Settings"
								>
									<IconInfoCircle height={"12"} width={"12"} stroke={1.5} />
								</ActionIcon>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Item
									href="/inventory/opening-stock"
									component="button"
									onClick={() => {
										navigate("/inventory/opening-stock");
									}}
									leftSection={
										<IconTable style={{ width: rem(14), height: rem(14) }} />
									}
								>
									{t("OpeningStock")}
								</Menu.Item>
								<Menu.Item
									href="/inventory/opening-approve-stock"
									component="button"
									onClick={() => {
										navigate("/inventory/opening-approve-stock");
									}}
									leftSection={
										<IconTable style={{ width: rem(14), height: rem(14) }} />
									}
								>
									{t("ApproveStock")}
								</Menu.Item>
								<Menu.Item
									href="/inventory/config"
									component="button"
									onClick={() => {
										navigate("/inventory/config");
									}}
									leftSection={
										<IconSettings style={{ width: rem(14), height: rem(14) }} />
									}
								>
									{t("Setting")}
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</div>
			</header>
		</>
	);
}

export default _SalesPurchaseHeaderNavbar;
