import { Group, Menu, rem, ActionIcon, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "../../../../assets/css/HeaderSearch.module.css";
import { IconInfoCircle, IconBrandProducthunt, IconBrandCodesandbox } from "@tabler/icons-react";
import { useLocation, useNavigate } from "react-router";

function InventoryHeaderNavbar(props) {
	const { pageTitle } = props;
	const { t } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();

	const links = [
		{ link: "/inventory/stock", label: t("Stock") },
		{ link: "/inventory/product", label: t("Products") },
		{ link: "/inventory/category", label: t("Category") },
		{ link: "/inventory/category-group", label: t("CategoryGroup") },
	];
	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={location.pathname == link.link ? classes.active : classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
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
									onClick={(e) => {
										navigate("/inventory/opening-stock");
									}}
									leftSection={
										<IconBrandCodesandbox
											style={{ width: rem(14), height: rem(14) }}
										/>
									}
								>
									{t("OpeningStockN")}
								</Menu.Item>
								<Menu.Item
									component="button"
									onClick={(e) => {
										navigate("/inventory/particular");
									}}
									leftSection={
										<IconBrandProducthunt
											style={{ width: rem(14), height: rem(14) }}
										/>
									}
								>
									{t("Particular")}
								</Menu.Item>
								<Menu.Item
									component="button"
									onClick={(e) => {
										navigate("/inventory/config");
									}}
									leftSection={
										<IconBrandCodesandbox
											style={{ width: rem(14), height: rem(14) }}
										/>
									}
								>
									{t("Configuration")}
								</Menu.Item>

								{/* <Menu.Item
                                    component="button" onClick={(e) => { navigate('/inventory/stock') }} leftSection={<IconStack2 style={{ width: rem(14), height: rem(14) }} />}>
                                    {t('Stock')}
                                </Menu.Item> */}
							</Menu.Dropdown>
						</Menu>
					</Group>
				</div>
			</header>
		</>
	);
}

export default InventoryHeaderNavbar;
