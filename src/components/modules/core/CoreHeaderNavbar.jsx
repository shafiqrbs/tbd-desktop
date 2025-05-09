import { Group, Menu, rem, ActionIcon, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "../../../assets/css/HeaderSearch.module.css";
import {
	IconInfoCircle,
	IconSettings,
	IconAdjustments,
	IconMap2,
	IconLetterMSmall,
} from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";

function CoreHeaderNavbar(props) {
	const { pageTitle } = props;
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const links = [
		{ link: "/core/customer", label: t("Customers") },
		{ link: "/core/vendor", label: t("Vendors") },
		{ link: "/core/user", label: t("Users") },
	];
	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={location.pathname == link.link ? classes.active : classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link, { replace: true });
			}}
		>
			{link.label}
		</a>
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
									component="button"
									onClick={() => {
										navigate("/core/setting");
									}}
									leftSection={
										<IconAdjustments
											style={{ width: rem(14), height: rem(14) }}
										/>
									}
								>
									{t("Setting")}
								</Menu.Item>
								<Menu.Item
									component="button"
									onClick={() => {
										navigate("/core/warehouse");
									}}
									leftSection={
										<IconMap2 style={{ width: rem(14), height: rem(14) }} />
									}
								>
									{t("Warehouse")}
								</Menu.Item>
								<Menu.Item
									component="button"
									onClick={() => {
										navigate("/core/marketing-executive");
									}}
									leftSection={
										<IconLetterMSmall
											style={{ width: rem(14), height: rem(14) }}
										/>
									}
								>
									{t("MarketingExecutive")}
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
									{t("Configuration")}
								</Menu.Item>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</div>
			</header>
		</>
	);
}

export default CoreHeaderNavbar;
