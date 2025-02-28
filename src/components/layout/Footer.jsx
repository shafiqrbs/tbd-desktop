import { Box, Group, Flex } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "../../assets/css/FooterNavbar.module.css";
import { useNavigate } from "react-router";

function Footer() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const links = [
		{ link: "/inventory/sales-invoice", label: t("Sales") },
		{ link: "/inventory/purchase-invoice", label: t("Purchase") },
		{ link: "/inventory/product", label: t("Product") },
		{ link: "/accounting/voucher-entry", label: t("Accounting") },
	];

	const items = links.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
			}}
		>
			{link.label}
		</a>
	));

	const leftLinks = [
		{ link: "/", label: t("Home") },
		{ link: "/sitemap", label: t("Sitemap") },
	];

	const leftItems = leftLinks.map((link) => (
		<a
			key={link.label}
			href={link.link}
			className={classes.link}
			onClick={(event) => {
				event.preventDefault();
				navigate(link.link);
			}}
		>
			{link.label}
		</a>
	));

	return (
		<Box p="0">
			<footer className={classes.footer}>
				<div className={classes.inner}>
					<Group gap={5} className={classes.links} visibleFrom="sm">
						<Flex
							gap="md"
							mih={42}
							justify="flex-start"
							align="center"
							direction="row"
							wrap="wrap"
						>
							{leftItems}
						</Flex>
					</Group>
					<Group>
						<Group ml={50} gap={5} className={classes.links} visibleFrom="sm">
							<Flex
								gap="md"
								mih={42}
								justify="flex-start"
								align="center"
								direction="row"
								wrap="wrap"
							>
								{items}
							</Flex>
						</Group>
					</Group>
				</div>
			</footer>
		</Box>
	);
}
export default Footer;
