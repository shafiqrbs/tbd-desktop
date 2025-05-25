import {
	Group,
	Button,
	UnstyledButton,
	Text,
	ThemeIcon,
	Divider,
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
	Select,
	TextInput,
	CloseButton,
	ScrollArea,
} from "@mantine/core";

import { useDisclosure, useFullscreen, useHotkeys } from "@mantine/hooks";
import {
	IconChevronDown,
	IconLogout,
	IconSearch,
	IconWindowMaximize,
	IconWindowMinimize,
	IconWifiOff,
	IconWifi,
	IconRefresh,
	IconPrinter,
	IconArrowRight,
	IconBackspace,
} from "@tabler/icons-react";
import { Link, useNavigate } from "react-router";
import LanguagePickerStyle from "./../../assets/css/LanguagePicker.module.css";
import "@mantine/spotlight/styles.css";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import SpotLightSearchModal from "../modules/modals/SpotLightSearchModal.jsx";
import { useDispatch } from "react-redux";
import shortcutDropdownData from "../global-hook/shortcut-dropdown/shortcutDropdownData.js";
import Sandra_Logo from "../../assets/images/sandra_logo.jpeg";
import { CHARACTER_SET, LANGUAGES, LINE_CHARACTER } from "../../constants";
import SyncDrawer from "../global-drawer/SyncDrawer.jsx";

export default function Header({ isOnline, toggleNetwork, configData }) {
	const [opened, { open, close }] = useDisclosure(false);
	const [openedPrinter, { open: openPrinter, close: closePrinter }] = useDisclosure(false);
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { toggle, fullscreen } = useFullscreen();
	const [syncPanelOpen, setSyncPanelOpen] = useState(false);
	const [languageOpened, setLanguageOpened] = useState(false);
	const [languageSelected, setLanguageSelected] = useState(
		LANGUAGES.find((item) => item.value === i18n.language)
	);
	const [printerSetup, setPrinterSetup] = useState({
		printerName: "",
		characterSet: "PC437_USA",
		lineCharacter: "-",
	});
	const [shortcutModalOpen, setShortcutModalOpen] = useState(false);
	const [value, setValue] = useState("");
	const [filteredItems, setFilteredItems] = useState([]);
	const [selectedIndex, setSelectedIndex] = useState(-1);

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
		const actions = shortcutDropdownData(t, configData);
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

	const filterList = (searchValue) => {
		const updatedList = getActions().reduce((acc, group) => {
			const filteredActions = group.actions.filter((action) =>
				action.label.toLowerCase().includes(searchValue.toLowerCase())
			);
			return [...acc, ...filteredActions];
		}, []);

		setFilteredItems(updatedList);
		setSelectedIndex(-1);
	};

	const clearSearch = () => {
		setValue("");
		const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
		setFilteredItems(allActions);
		setSelectedIndex(0);
	};

	useHotkeys([["alt+c", clearSearch]], []);

	const handleKeyDown = (event) => {
		if (filteredItems.length === 0) return;

		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((prevIndex) =>
				prevIndex <= 0 ? filteredItems.length - 1 : prevIndex - 1
			);
		} else if (event.key === "Enter" && selectedIndex >= 0) {
			const selectedAction = filteredItems[selectedIndex];
			if (selectedAction) {
				const path =
					selectedAction.id === "inhouse"
						? "#"
						: selectedAction.group === "Production" ||
						  selectedAction.group === "প্রোডাকশন"
						? `production/${selectedAction.id}`
						: selectedAction.group === "Core" || selectedAction.group === "কেন্দ্র"
						? `core/${selectedAction.id}`
						: selectedAction.group === "Inventory" ||
						  selectedAction.group === "ইনভেন্টরি"
						? `inventory/${selectedAction.id}`
						: selectedAction.group === "Domain" || selectedAction.group === "ডোমেইন"
						? `domain/${selectedAction.id}`
						: selectedAction.group === "Accounting" ||
						  selectedAction.group === "একাউন্টিং"
						? `accounting/${selectedAction.id}`
						: selectedAction.group === "Procurement"
						? `procurement/${selectedAction.id}`
						: selectedAction.group === "Sales & Purchase"
						? `inventory/${selectedAction.id}`
						: `/sitemap`;

				navigate(path);
				setValue("");
				setShortcutModalOpen(false);
			}
		}
	};

	useEffect(() => {
		if (shortcutModalOpen) {
			const allActions = getActions().reduce((acc, group) => [...acc, ...group.actions], []);
			setFilteredItems(allActions);
			setSelectedIndex(0);
		}
	}, [shortcutModalOpen]);

	useEffect(() => {
		if (selectedIndex >= 0 && filteredItems.length > 0) {
			const selectedElement = document.getElementById(
				`item-${filteredItems[selectedIndex].index}`
			);
			if (selectedElement) {
				selectedElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	}, [selectedIndex, filteredItems]);

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
			<Box bg="#C6AF9D" mb={"2"} pos={`relative`}>
				<Grid columns={24} gutter={{ base: 2 }} justify="space-between">
					<Grid.Col span={6}>
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
					<Grid.Col
						span={12}
						justify="flex-end"
						align="center"
						direction="row"
						wrap="wrap"
					>
						<Group bg="#C6AF9D">
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
									onClick={() => setShortcutModalOpen(true)}
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
									{LANGUAGES.map((item) => (
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

			{/* Shortcut Modal */}
			<Modal
				opened={shortcutModalOpen}
				onClose={() => setShortcutModalOpen(false)}
				centered
				size="450"
				padding="md"
				radius="md"
				styles={{
					title: {
						width: "100%",
						margin: 0,
						padding: 0,
					},
				}}
				overlayProps={{
					backgroundOpacity: 0.7,
					blur: 3,
				}}
				title={
					<Box>
						<TextInput
							w={"100%"}
							align={"center"}
							pr={"lg"}
							justify="space-between"
							data-autofocus
							leftSection={<IconSearch size={16} c={"red"} />}
							placeholder={t("SearchMenu")}
							value={value}
							rightSectionPointerEvents="all"
							rightSection={
								<div
									style={{
										display: "flex",
										alignItems: "center",
									}}
								>
									{value ? (
										<>
											<CloseButton
												ml={"-50"}
												mr={"xl"}
												icon={
													<IconBackspace
														style={{ width: rem(24) }}
														stroke={1.5}
													/>
												}
												aria-label="Clear input"
												onClick={clearSearch}
											/>
											<Kbd ml={"-xl"} h={"24"} c={"gray.8"} fz={"12"}>
												Alt
											</Kbd>{" "}
											+{" "}
											<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
												C
											</Kbd>
										</>
									) : (
										<>
											<Kbd ml={"-lg"} h={"24"} c={"gray.8"} fz={"12"}>
												Alt{" "}
											</Kbd>{" "}
											+{" "}
											<Kbd c={"gray.8"} h={"24"} fz={"12"} mr={"lg"}>
												X
											</Kbd>
										</>
									)}
								</div>
							}
							onChange={(event) => {
								setValue(event.target.value);
								filterList(event.target.value);
							}}
							onKeyDown={handleKeyDown}
							className="no-focus-outline"
						/>
					</Box>
				}
				transitionProps={{ transition: "fade", duration: 200 }}
			>
				<Divider my="sm" mt={0} />
				<ScrollArea type={"never"} scrollbars="y" h={400}>
					{filteredItems.length > 0 ? (
						<Stack spacing="xs">
							{filteredItems
								.reduce((groups, item) => {
									const existingGroup = groups.find(
										(g) => g.group === item.group
									);
									if (existingGroup) {
										existingGroup.items.push(item);
									} else {
										groups.push({
											group: item.group,
											items: [item],
										});
									}
									return groups;
								}, [])
								.map((groupData, groupIndex) => (
									<Box key={groupIndex}>
										<Text size="sm" fw="bold" c="#828282" pb={"xs"}>
											{groupData.group}
										</Text>
										<Stack
											bg="var(--mantine-color-body)"
											justify="flex-start"
											align="stretch"
											gap="2"
										>
											{groupData.items.map((action, itemIndex) => {
												return (
													<Link
														id={`item-${action.index}`}
														className={"link"}
														key={itemIndex}
														to={
															action.id === "inhouse"
																? "#"
																: action.group === "Production" ||
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
																: action.group === "Procurement"
																? `procurement/${action.id}`
																: action.group ===
																  "Sales & Purchase"
																? `inventory/${action.id}`
																: `/sitemap`
														}
														onClick={() => {
															setShortcutModalOpen(false);
															setValue("");
															navigate(
																action.id === "inhouse"
																	? "#"
																	: action.group ===
																			"Production" ||
																	  action.group === "প্রোডাকশন"
																	? `production/${action.id}`
																	: action.group === "Core" ||
																	  action.group === "কেন্দ্র"
																	? `core/${action.id}`
																	: action.group ===
																			"Inventory" ||
																	  action.group === "ইনভেন্টরি"
																	? `inventory/${action.id}`
																	: action.group === "Domain" ||
																	  action.group === "ডোমেইন"
																	? `domain/${action.id}`
																	: action.group ===
																			"Accounting" ||
																	  action.group === "একাউন্টিং"
																	? `accounting/${action.id}`
																	: action.group === "Procurement"
																	? `procurement/${action.id}`
																	: action.group ===
																	  "Sales & Purchase"
																	? `inventory/${action.id}`
																	: `/sitemap`
															);
														}}
													>
														<Group
															wrap="nowrap"
															align="center"
															justify="left"
															pt={"4"}
															pb={"4"}
															className={`
																	${filteredItems.indexOf(action) === selectedIndex ? "highlightedItem" : ""}
																`}
														>
															<ThemeIcon
																size={18}
																color={"#242424"}
																variant="transparent"
															>
																<IconArrowRight />
															</ThemeIcon>
															<Text
																size="sm"
																className={`${
																	filteredItems.indexOf(
																		action
																	) === selectedIndex
																		? "highlightedItem"
																		: ""
																}${"link"}`}
															>
																{action.label}
															</Text>
														</Group>
													</Link>
												);
											})}
										</Stack>
									</Box>
								))}
						</Stack>
					) : (
						<Text align="center" mt="md" c="dimmed">
							{t("NoResultsFound")}
						</Text>
					)}
				</ScrollArea>
				<div className={"titleBackground"}>
					<Group justify="space-between" mt={"xs"}>
						<div>
							<Text fw={500} fz="sm">
								{t("Sitemap")}
							</Text>
							<Text size="xs" c="dimmed">
								{t("SitemapDetails")}
							</Text>
						</div>
						<Button className={"btnPrimaryBg"} size="xs" onClick={() => navigate("/")}>
							{t("Sitemap")}
						</Button>
					</Group>
				</div>
			</Modal>

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
						description="Same as printer name and printer sharing name"
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
						data={CHARACTER_SET}
						placeholder="PC437_USA"
					/>
					<Select
						mb={10}
						required
						label={t("Line Character")}
						value={printerSetup.lineCharacter}
						onChange={(e) =>
							setPrinterSetup({
								...printerSetup,
								lineCharacter: e,
							})
						}
						description="How the lines separator will build"
						data={LINE_CHARACTER}
						placeholder="="
					/>
					<Button type="submit" fullWidth bg={"red.5"}>
						{t("Save Settings")}
					</Button>
				</form>
			</Modal>
			{/* ----------- sync information ----------- */}
			<SyncDrawer syncPanelOpen={syncPanelOpen} setSyncPanelOpen={setSyncPanelOpen} />
		</>
	);
}
