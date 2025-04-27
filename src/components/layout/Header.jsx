import {
	HoverCard,
	Group,
	Button,
	UnstyledButton,
	Text,
	SimpleGrid,
	ThemeIcon,
	Divider,
	Center,
	Box,
	rem,
	Image,
	ActionIcon,
	Tooltip,
	Kbd,
	Menu,
	Modal,
	Flex,
	Grid,
	Stack,
	Drawer,
	Paper,
	Select,
	TextInput,
} from "@mantine/core";

import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";
import {
	IconCircleCheck,
	IconChevronDown,
	IconLogout,
	IconSearch,
	IconWindowMaximize,
	IconWindowMinimize,
	IconWifiOff,
	IconWifi,
	IconRefresh,
	IconPrinter,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import classes from "./../../assets/css/Header.module.css";
import LanguagePickerStyle from "./../../assets/css/LanguagePicker.module.css";
import "@mantine/spotlight/styles.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SpotLightSearchModal from "../modules/modals/SpotLightSearchModal.jsx";
import { useDispatch } from "react-redux";
import shortcutDropdownData from "../global-hook/shortcut-dropdown/shortcutDropdownData.js";
import Sandra_Logo from "../../assets/images/sandra_logo.jpeg";
import { characterSets, languages, syncData } from "../../constants";

export default function Header({ isOnline, toggleNetwork, configData }) {
	const [opened, { open, close }] = useDisclosure(false);
	const [openedPrinter, { open: openPrinter, close: closePrinter }] = useDisclosure(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { toggle, fullscreen } = useFullscreen();
	const [syncPanelOpen, setSyncPanelOpen] = useState(false);
	const [languageOpened, setLanguageOpened] = useState(false);
	const [configDataSpot, setConfigData] = useState(null);
	const [languageSelected, setLanguageSelected] = useState(
		languages.find((item) => item.value === i18n.language)
	);
	const [printerSetup, setPrinterSetup] = useState({
		printerName: "",
		characterSet: "PC437_USA",
		lineCharacter: "-",
	});

	useEffect(() => {
		const checkConfigData = async () => {
			const storedConfigData = await window.dbAPI.getDataFromTable("config-data");
			if (storedConfigData) {
				setConfigData(storedConfigData);
			} else {
				navigate("/login");
			}
		};

		const timeoutId = setTimeout(checkConfigData, 500);

		return () => clearTimeout(timeoutId);
	}, [navigate]);

	useEffect(() => {
		const checkPrinterData = async () => {
			const storedPrinterData = await window.dbAPI.getDataFromTable("printer");
			if (storedPrinterData) {
				setPrinterSetup({
					printerName: storedPrinterData.printer_name || "",
					characterSet: storedPrinterData.character_set || "PC437_USA",
					lineCharacter: storedPrinterData.line_character || "-",
				});
			}
		};

		if (openedPrinter) {
			checkPrinterData();
		}
	}, [openedPrinter]);

	const getActions = () => {
		const actions = shortcutDropdownData(t, configDataSpot);
		let index = 0;

		// Assign an index to each action
		return actions.map((group) => ({
			...group,
			actions: group.actions.map((action) => ({
				...action,
				index: index++,
				group: group.group,
			})),
		}));
	};
	async function logout() {
		dispatch({
			type: "crud/resetState",
			payload: {
				modules: ["inventory", "production", "core", "sales"], // add all modules you want to reset
			},
		});
		await window.dbAPI.destroyTableData();
		navigate("/login");
	}
	const list = getActions().reduce((acc, group) => [...acc, ...group.actions], []);

	function toggleSyncPanel() {
		setSyncPanelOpen(!syncPanelOpen);
	}

	useHotkeys(
		[
			[
				"alt+k",
				() => {
					open();
				},
			],
		],
		[]
	);
	useHotkeys(
		[
			[
				"alt+x",
				() => {
					close();
				},
			],
		],
		[]
	);

	const handlePrinterSetup = async (e) => {
		e.preventDefault();
		try {
			await window.dbAPI.upsertIntoTable("printer", {
				id: 1,
				printer_name: printerSetup.printerName,
				line_character: printerSetup.lineCharacter,
				character_set: printerSetup.characterSet,
			});
			closePrinter();
		} catch (error) {
			console.error("Error in handlePrinterSetup:", error);
		}
	};

	const shortcuts = (
		<Stack spacing="xs">
			{list
				.reduce((groups, item) => {
					const lastGroup = groups[groups.length - 1];
					if (!lastGroup || item.group !== lastGroup.group) {
						groups.push({ group: item.group, items: [item] });
					} else {
						lastGroup.items.push(item);
					}
					return groups;
				}, [])
				.map((groupData, groupIndex) => (
					<Box key={groupIndex}>
						<Text size="sm" fw="bold" c="#828282" pb={"xs"}>
							{groupData.group}
						</Text>

						<SimpleGrid cols={2}>
							{groupData.items.map((action, itemIndex) => (
								<Link
									key={itemIndex}
									to={
										action.id === "inhouse"
											? "#"
											: action.group === "Production" ||
											  action.group === "প্রোডাকশন"
											? `production/${action.id}`
											: action.group === "Core" || action.group === "কেন্দ্র"
											? `core/${action.id}`
											: action.group === "Inventory" ||
											  action.group === "ইনভেন্টরি"
											? `inventory/${action.id}`
											: action.group === "Domain" || action.group === "ডোমেইন"
											? `domain/${action.id}`
											: action.group === "Accounting" ||
											  action.group === "একাউন্টিং"
											? `accounting/${action.id}`
											: action.group === "Procurement"
											? `procurement/${action.id}`
											: action.group === "Sales & Purchase"
											? `inventory/${action.id}`
											: `/sitemap`
									}
									onClick={() => {
										navigate(
											action.group === "Production" ||
												action.group === "প্রোডাকশন"
												? `production/${action.id}`
												: action.group === "Core" ||
												  action.group === "কেন্দ্র"
												? `core/${action.id}`
												: action.group === "Inventory" ||
												  action.group === "ইনভেন্টরি"
												? `inventory/${action.id}`
												: action.group === "Domain" ||
												  action.group === "ডোমেইন"
												? `domain/${action.id}`
												: action.group === "Accounting" ||
												  action.group === "একাউন্টিং"
												? `accounting/${action.id}`
												: action.group === "Sales & Purchase"
												? `inventory/${action.id}`
												: `/sitemap`
										);
									}}
									style={{ textDecoration: "none", color: "inherit" }}
								>
									<UnstyledButton className={classes.subLink}>
										<Group
											wrap="nowrap"
											align="center"
											justify="center"
											gap={4}
										>
											<ThemeIcon size={18} variant="transparent" radius="md">
												<IconCircleCheck
													style={{ width: rem(14), height: rem(14) }}
													color={"green"}
												/>
											</ThemeIcon>
											<div>
												<Center>
													<Text size="sm" fw={500}>
														{action.label}
													</Text>
												</Center>
											</div>
										</Group>
									</UnstyledButton>
								</Link>
							))}
						</SimpleGrid>
					</Box>
				))}
		</Stack>
	);

	return (
		<>
			<Modal.Root opened={opened} onClose={close} size="64%">
				<Modal.Overlay />
				<Modal.Content p={"xs"}>
					<Modal.Header ml={"xs"}>
						<Modal.Title>
							{configData && configData?.domain
								? configData.domain?.company_name
								: ""}
						</Modal.Title>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<SpotLightSearchModal onClose={close} configData={configData} />
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
			<Box bg="#905a23" mb={"2"} pos={`relative`}>
				<Grid columns={24} gutter={{ base: 2 }} justify="space-between">
					<Grid.Col span={3}>
						{configData?.domain?.company_name === "Sandra" ? (
							<div
								style={{
									display: "flex",
									height: "100%",
									alignItems: "center",
									paddingLeft: 16,
								}}
								className="brand-logo"
							>
								<Box
									onClick={() => {
										navigate("/");
									}}
								>
									<Image mah={40} radius="md" src={Sandra_Logo} pl={6}></Image>
								</Box>
							</div>
						) : (
							<Box
								c={"white"}
								fw={"800"}
								component="button"
								className="brand-logo"
								onClick={() => navigate("/")}
							>
								{configData && configData?.domain
									? configData.domain?.company_name
									: ""}
							</Box>
						)}
					</Grid.Col>
					<Grid.Col span={3} justify="flex-end" align={"center"} mt={"xs"}>
						<HoverCard
							width={400}
							position="bottom"
							radius="md"
							shadow="md"
							withinPortal
							withArrow
							arrowPosition="center"
						>
							<HoverCard.Target>
								<a href="#" className={classes.link}>
									<Center inline>
										<Box component="span" mr={"xs"} c={"white"} fw={"800"}>
											{t("Shortcut")}
										</Box>
										<IconChevronDown
											style={{ width: rem(16), height: rem(16) }}
											color={"white"}
										/>
									</Center>
								</a>
							</HoverCard.Target>

							<HoverCard.Dropdown style={{ overflow: "hidden" }}>
								<Group justify="space-between">
									<Text fw={500} fz={16} c={"red.6"}>
										{t("Shortcuts")}
									</Text>
								</Group>

								<Divider my="sm" />

								<SimpleGrid cols={1} spacing={0}>
									{shortcuts}
								</SimpleGrid>

								<div className={classes.dropdownFooter}>
									<Group justify="space-between" mt={"xs"}>
										<div>
											<Text fw={500} fz="sm">
												Sitemap
											</Text>
											<Text size="xs" c="dimmed">
												Sitemap Details
											</Text>
										</div>
										<Button
											bg={"green.6"}
											size="xs"
											onClick={() => navigate("/")}
										>
											Sitemap
										</Button>
									</Group>
								</div>
							</HoverCard.Dropdown>
						</HoverCard>
					</Grid.Col>
					<Grid.Col
						span={12}
						justify="flex-end"
						align="center"
						direction="row"
						wrap="wrap"
					>
						<Group bg="#905a23">
							<Flex
								justify="center"
								align="center"
								direction="row"
								wrap="wrap"
								mih={42}
								w={"100%"}
								border={"#684119"}
							>
								<Button
									bg="white"
									leftSection={
										<>
											<IconSearch size={16} c={"red.5"} />
											<Text fz={`xs`} pl={"xs"} c={"gray.8"}>
												{t("SearchMenu")}
											</Text>
										</>
									}
									fullWidth
									variant="transparent"
									rightSection={
										<>
											<Kbd h={"24"} c={"gray.8"} fz={"12"}>
												Alt{" "}
											</Kbd>{" "}
											+{" "}
											<Kbd c={"gray.8"} h={"24"} fz={"12"}>
												{" "}
												K
											</Kbd>
										</>
									}
									w={`100%`}
									justify="space-between"
									style={{ border: `2px solid #684119` }}
									color={`gray`}
									onClick={open}
									className="no-focus-outline"
								/>
							</Flex>
						</Group>
					</Grid.Col>
					<Grid.Col span={6}>
						<Flex
							gap="sm"
							justify="flex-end"
							direction="row"
							wrap="wrap"
							mih={42}
							align={"right"}
							px={`xs`}
							pr={"24"}
						>
							<Menu
								onOpen={() => setLanguageOpened(true)}
								onClose={() => setLanguageOpened(false)}
								radius="md"
								width="target"
								withinPortal
								withArrow
								arrowPosition="center"
							>
								<Tooltip label="Sync Data" bg={`red.5`} withArrow>
									<ActionIcon
										disabled={!isOnline}
										mt={"7"}
										onClick={toggleSyncPanel}
										variant="filled"
										color={`white`}
										bg={isOnline ? "green.8" : "gray.1"}
									>
										<IconRefresh size={20} />
									</ActionIcon>
								</Tooltip>
								<Tooltip label="Pos printer setup" bg={`red.5`} withArrow>
									<ActionIcon
										mt={"7"}
										onClick={openPrinter}
										variant="transparent"
										color={`white`}
									>
										<IconPrinter size={20} />
									</ActionIcon>
								</Tooltip>
								<Menu.Target>
									<UnstyledButton
										p={2}
										className={LanguagePickerStyle.control}
										data-expanded={languageOpened || undefined}
									>
										<Group gap="xs">
											<Image
												src={languageSelected?.flag}
												width={18}
												height={18}
											/>
											<span className={LanguagePickerStyle.label}>
												{languageSelected?.label}
											</span>
										</Group>
										<IconChevronDown
											size="1rem"
											className={LanguagePickerStyle.icon}
											stroke={1}
										/>
									</UnstyledButton>
								</Menu.Target>
								<Menu.Dropdown p={4} className={LanguagePickerStyle.dropdown}>
									{languages.map((item) => (
										<Menu.Item
											p={4}
											leftSection={
												<Image src={item.flag} width={18} height={18} />
											}
											onClick={() => {
												setLanguageSelected(item);
												i18n.changeLanguage(item.value);
											}}
											key={item.label}
										>
											{item.label}
										</Menu.Item>
									))}
								</Menu.Dropdown>
							</Menu>
							<Tooltip
								label={fullscreen ? t("NormalScreen") : t("Fullscreen")}
								bg={`red.5`}
								withArrow
							>
								<ActionIcon
									mt={"6"}
									onClick={toggle}
									variant="subtle"
									color={`white`}
								>
									{fullscreen ? (
										<IconWindowMinimize size={24} />
									) : (
										<IconWindowMaximize size={24} />
									)}
								</ActionIcon>
							</Tooltip>
							<Tooltip label={t("Logout")} bg={`red.5`} withArrow position={"left"}>
								<ActionIcon
									onClick={() => logout()}
									variant="subtle"
									mt={"6"}
									color={`white`}
								>
									<IconLogout size={24} />
								</ActionIcon>
							</Tooltip>
							<Tooltip
								label={isOnline ? t("Online") : t("Offline")}
								bg={isOnline ? "green.5" : "red.5"}
								withArrow
							>
								<ActionIcon
									mt={"6"}
									variant="filled"
									radius="xl"
									color={isOnline ? "green.5" : "red.5"}
									onClick={toggleNetwork}
								>
									{isOnline ? (
										<IconWifi color={"white"} size={24} />
									) : (
										<IconWifiOff color={"white"} size={24} />
									)}
								</ActionIcon>
							</Tooltip>
						</Flex>
					</Grid.Col>
				</Grid>
			</Box>
			{/* ---------- printer modal ------- */}
			<Modal opened={openedPrinter} onClose={closePrinter} title="Setup Printer">
				<form onSubmit={handlePrinterSetup}>
					<TextInput
						mb={10}
						required
						label={t("Printer Name")}
						value={printerSetup.printerName}
						onChange={(e) =>
							setPrinterSetup({
								...printerSetup,
								printerName: e.target.value,
							})
						}
						placeholder="RT378"
					/>
					<Select
						mb={10}
						required
						label={t("Character Set")}
						value={printerSetup.characterSet}
						onChange={(e) =>
							setPrinterSetup({
								...printerSetup,
								characterSet: e,
							})
						}
						data={characterSets}
						placeholder="PC437_USA"
					/>
					<TextInput
						mb={10}
						required
						label={t("Line Characters")}
						value={printerSetup.lineCharacter}
						onChange={(e) => {
							if (e.target.value.length <= 1) {
								setPrinterSetup({
									...printerSetup,
									lineCharacter: e.target.value,
								});
							}
						}}
						placeholder="="
					/>
					<Button type="submit" fullWidth>
						{t("Save Settings")}
					</Button>
				</form>
			</Modal>
			{/* ----------- sync information ----------- */}
			<Drawer
				position="right"
				opened={syncPanelOpen}
				onClose={() => setSyncPanelOpen(false)}
				padding="lg"
				size="md"
				overlayProps={{
					backgroundOpacity: 0.55,
				}}
				title="Syncing Information"
				styles={{
					title: { fontWeight: 600, fontSize: rem(20), color: "#626262" },
				}}
			>
				<Divider mb="md" />

				<Stack gap="md">
					{syncData.map((item, index) => (
						<Paper key={index} p="md" radius="md" withBorder shadow="sm">
							<Group justify="space-between" wrap="nowrap">
								<Text fw={500}>{item}</Text>
								<ActionIcon
									variant="filled"
									radius="xl"
									color="teal"
									size="28px"
									className="sync-button"
								>
									<IconRefresh className="sync-icon" size={20} />
								</ActionIcon>
							</Group>
						</Paper>
					))}
				</Stack>

				<Text size="xs" c="dimmed" mt="xl" ta="center">
					Last synchronized: Today at 14:35
				</Text>
			</Drawer>
		</>
	);
}
