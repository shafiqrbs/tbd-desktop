import { useState } from "react";
import { IconDashboard, IconReportMoney, IconBuildingCottage } from "@tabler/icons-react";
import { Button, Flex, Tooltip, ScrollArea, Modal } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import getConfigData from "../../../global-hook/config-data/getConfigData";
import SalesModal from "./modals/SalesModal";
import StockModal from "./modals/StockModal";
import BakeryDashboardModal from "./modals/BakeryDashboardModal";

function ShortcutPos({ invoiceMode }) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 190;
	const { configData } = getConfigData();

	// Modal state
	const [modalOpened, setModalOpened] = useState(false);
	const [modalContent, setModalContent] = useState(null);
	const [modalTitle, setModalTitle] = useState("");

	const openModal = (content, title) => {
		setModalContent(content);
		setModalTitle(title);
		setModalOpened(true);
	};

	const renderModalContent = () => {
		switch (modalContent) {
			case "dashboard":
				return <BakeryDashboardModal />;
			case "sales":
				return <SalesModal />;
			case "stock":
				return <StockModal />;
			default:
				return null;
		}
	};

	return (
		<>
			<ScrollArea
				h={
					configData?.inventory_config?.is_pos && invoiceMode === "table"
						? height
						: height + 195
				}
				bg="white"
				type="never"
				className="border-radius"
			>
				<Flex direction={`column`} align={"center"} gap={"16"}>
					<Flex direction={`column`} align={"center"} mt={2} pt={5}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
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
								onClick={() => openModal("dashboard", t("Dashboard"))}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDashboard size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("Dashboard")}
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#E53935"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => openModal("sales", t("Sales"))}
							>
								<Flex direction={`column`} align={"center"}>
									<IconReportMoney size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("Sales")}
						</Flex>
					</Flex>
					{/* <Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
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
									navigate("/pos/bakery/user-sales");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconReportAnalytics size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("UserSales")}
						</Flex>
					</Flex> */}
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextNew")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								bg={"#FFC107"}
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`black`}
								radius="xl"
								onClick={() => openModal("stock", t("Stock"))}
							>
								<Flex direction={`column`} align={"center"}>
									<IconBuildingCottage size={16} color={"white"} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"black"}>
							{t("Stock")}
						</Flex>
					</Flex>
					{/* <Flex direction={`column`} align={"center"} mb={"8"}>
                        <Tooltip
                            label={t("AltTextNew")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg={`red.5`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <Button
                                bg={"#673AB7"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {
                                    //
                                }}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconArmchair2 size={16} color={"white"} />
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex
                            direction={`column`}
                            align={"center"}
                            fz={"12"}
                            c={"black"}
                            wrap={"wrap"}
                        >
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
                                {t("AdditionalTables")}
                            </Text>
                        </Flex>
                    </Flex> */}
					{/* <Flex direction={`column`} align={"center"} mb={"8"}>
                        <Tooltip
                            label={t("AltTextNew")}
                            px={16}
                            py={2}
                            withArrow
                            position={"left"}
                            c={"white"}
                            bg={`red.5`}
                            transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
                        >
                            <Button
                                bg={"#009688"}
                                size="md"
                                pl={"12"}
                                pr={"12"}
                                variant={"light"}
                                color={`black`}
                                radius="xl"
                                onClick={(e) => {}}
                            >
                                <Flex direction={`column`} align={"center"}>
                                    <IconCellSignal4 size={16} color={"white"} />
                                </Flex>
                            </Button>
                        </Tooltip>
                        <Flex
                            direction={`column`}
                            align={"center"}
                            fz={"12"}
                            c={"black"}
                            wrap={"wrap"}
                        >
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
                                {t("Online")}
                            </Text>
                        </Flex>
                    </Flex> */}
				</Flex>
			</ScrollArea>

			{/* Single Modal */}
			<Modal
				opened={modalOpened}
				onClose={() => setModalOpened(false)}
				title={modalTitle}
				size="100%"
				styles={{
					inner: {
						paddingTop: 20,
						paddingBottom: 20,
					},
					content: {
						maxHeight: "100vh",
						height: "100%",
					},
				}}
				centered
			>
				{renderModalContent()}
			</Modal>
		</>
	);
}

export default ShortcutPos;
