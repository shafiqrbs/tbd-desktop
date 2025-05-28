import {
	IconDashboard,
	IconIcons,
	IconCategory,
	IconShoppingBag,
	IconSettingsAutomation,
} from "@tabler/icons-react";
import { Button, Flex, Text, Tooltip, ScrollArea } from "@mantine/core";
import { useNavigate, useOutletContext } from "react-router";
import getAccessControl from "../../../global-hook/access_control/getAccessControl";
import { useTranslation } from "react-i18next";

export default function NavigationGeneral() {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 20;
	const navigate = useNavigate();
	const userRole = getAccessControl();
	const { t } = useTranslation();
	return (
		<>
			<ScrollArea h={height - 8} bg="white" type="never" className="border-radius">
				<Flex direction={`column`} align={"center"} gap={"16"}>
					<Flex direction={`column`} align={"center"} pt={5}>
						<Tooltip
							label={t("Stock")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#3F51B5"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#3F51B5"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {
									navigate("/inventory/stock");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconIcons size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Stock")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mt={"xs"}>
						<Tooltip
							label={t("Product")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#4CAF50"}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#4CAF50"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {
									navigate("/inventory/product");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDashboard size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Product")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("Category")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#6f1225"}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#6f1225"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {
									navigate("/inventory/category");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDashboard size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Category")}
							</Text>
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("Group")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#E53935"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#E53935"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {
									navigate("/inventory/category-group");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconCategory size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Group")}
							</Text>
						</Flex>
					</Flex>

					<Flex direction={`column`} align={"center"}>
						<Tooltip
							label={t("Setting")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={"#F59E0B"}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Button
								bg={"#F59E0B"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={(e) => {
									navigate("/inventory/particular");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconShoppingBag size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							<Text
								size="xs"
								c="black"
								ta="center"
								w={56}
								style={{
									wordBreak: "break-word",
									hyphens: "auto",
								}}
							>
								{t("Particular")}
							</Text>
						</Flex>
					</Flex>
					{userRole &&
						userRole.length > 0 &&
						(userRole.includes("role_accounting") ||
							userRole.includes("role_domain")) && (
							<Flex direction={`column`} align={"center"}>
								<Tooltip
									label={t("Configuration")}
									px={16}
									py={2}
									withArrow
									position={"left"}
									c={"white"}
									bg={"#6e66d6"}
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<Button
										bg={"#6e66d6"}
										size="md"
										pl={"12"}
										pr={"12"}
										variant={"light"}
										color={`black`}
										radius="xl"
										onClick={(e) => {
											navigate("/inventory/config");
										}}
									>
										<Flex direction={`column`} align={"center"}>
											<IconSettingsAutomation size={16} color={"white"} />
										</Flex>
									</Button>
								</Tooltip>
								<Flex direction={`column`} align={"center"} fz={"12"} c={"red"}>
									<Text
										size="xs"
										c="black"
										ta="center"
										w={56}
										style={{
											wordBreak: "break-word",
											hyphens: "auto",
										}}
									>
										{t("Config")}
									</Text>
								</Flex>
							</Flex>
						)}
				</Flex>
			</ScrollArea>
		</>
	);
}
