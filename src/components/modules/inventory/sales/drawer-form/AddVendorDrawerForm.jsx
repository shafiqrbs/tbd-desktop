import { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
	Button,
	rem,
	Flex,
	Grid,
	Box,
	ScrollArea,
	Text,
	Title,
	Stack,
	Group,
	ActionIcon,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import {
	IconBuilding,
	IconCheck,
	IconDeviceFloppy,
	IconRefreshDot,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";
import { useDispatch } from "react-redux";
import { hasLength, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { storeEntityData } from "../../../../../store/core/crudSlice.js";
import InputForm from "../../../../form-builders/InputForm.jsx";
import PhoneNumber from "../../../../form-builders/PhoneNumberInput.jsx";
import vendorDataStoreIntoLocalStorage from "../../../../global-hook/local-storage/vendorDataStoreIntoLocalStorage.js";

function AddVendorDrawerForm(props) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100; //TabList height 104
	const [saveCreateLoading, setSaveCreateLoading] = useState(false);
	const effectRan = useRef(false);

	const { setRefreshVendorDropdown, focusField, fieldPrefix, setVendorDrawer } = props;

	useEffect(() => {
		!effectRan.current &&
			(setTimeout(() => {
				const element = document.getElementById(fieldPrefix + "company_name");
				if (element) {
					element.focus();
				}
			}, 100),
			(effectRan.current = true));
	}, []);

	const vendorAddedForm = useForm({
		initialValues: {
			company_name: "",
			name: "",
			mobile: "",
		},
		validate: {
			company_name: hasLength({ min: 2, max: 20 }),
			name: hasLength({ min: 2, max: 20 }),
			mobile: (value) => {
				if (!value) return t("MobileValidationRequired");
				return null;
			},
		},
	});
	const closeModel = () => {
		setVendorDrawer(false);
	};

	return (
		<>
			<Box>
				<form
					onSubmit={vendorAddedForm.onSubmit((values) => {
						modals.openConfirmModal({
							title: <Text size="md"> {t("FormConfirmationTitle")}</Text>,
							children: <Text size="sm"> {t("FormConfirmationMessage")}</Text>,
							labels: { confirm: t("Submit"), cancel: t("Cancel") },
							confirmProps: { color: "red" },
							onCancel: () => console.log("Cancel"),
							onConfirm: () => {
								setSaveCreateLoading(true);
								const value = {
									url: "core/vendor",
									data: vendorAddedForm.values,
								};
								dispatch(storeEntityData(value));

								notifications.show({
									color: "teal",
									title: t("CreateSuccessfully"),
									icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
									loading: false,
									autoClose: 700,
									style: { backgroundColor: "lightgray" },
								});

								setTimeout(() => {
									vendorDataStoreIntoLocalStorage();
									vendorAddedForm.reset();
									setRefreshVendorDropdown(true);
									setVendorDrawer(false);
									document.getElementById(focusField).focus();
								}, 700);
							},
						});
					})}
				>
					<Box mb={0}>
						<Grid columns={9} gutter={{ base: 6 }}>
							<Grid.Col span={9}>
								<Box bg={"white"} p={"xs"} className={"borderRadiusAll"}>
									<Box bg={"white"}>
										<Box
											pl={`xs`}
											pr={8}
											pt={"4"}
											pb={"6"}
											mb={"4"}
											className={"boxBackground borderRadiusAll"}
										>
											<Grid columns={12}>
												<Grid.Col span={6}>
													<Title order={6} pt={"6"}>
														{t("InstantVendorCreate")}
													</Title>
												</Grid.Col>
												<Grid.Col span={6}></Grid.Col>
											</Grid>
										</Box>
										<Box pl={`xs`} pr={"xs"} className={"borderRadiusAll"}>
											<ScrollArea
												h={height + 18}
												scrollbarSize={2}
												scrollbars="y"
												type="never"
											>
												<Box mt={"8"}>
													<InputForm
														tooltip={t("CompanyNameValidateMessage")}
														label={t("CompanyName")}
														placeholder={t("CompanyName")}
														required={true}
														nextField={fieldPrefix + "VendorName"}
														form={vendorAddedForm}
														name={"company_name"}
														mt={0}
														id={fieldPrefix + "company_name"}
														leftSection={
															<IconBuilding size={16} opacity={0.5} />
														}
													/>
												</Box>
												<Box mt={"xs"}>
													<InputForm
														form={vendorAddedForm}
														tooltip={t("VendorNameValidateMessage")}
														label={t("VendorName")}
														placeholder={t("VendorName")}
														required={true}
														name={"name"}
														id={fieldPrefix + "VendorName"}
														nextField={fieldPrefix + "VendorMobile"}
														mt={8}
														leftSection={
															<IconUserCircle
																size={16}
																opacity={0.5}
															/>
														}
													/>
												</Box>
												<Box mt={"8"}>
													<PhoneNumber
														tooltip={
															vendorAddedForm.errors.mobile
																? vendorAddedForm.errors.mobile
																: t("MobileValidateMessage")
														}
														form={vendorAddedForm}
														label={t("VendorMobile")}
														placeholder={t("VendorMobile")}
														required={true}
														name={"mobile"}
														id={fieldPrefix + "VendorMobile"}
														nextField={fieldPrefix + "EntityFormSubmit"}
														mt={8}
													/>
												</Box>
											</ScrollArea>
										</Box>
										<Box
											pl={`xs`}
											pr={8}
											pt={"6"}
											pb={"6"}
											mb={"2"}
											mt={4}
											className={"boxBackground borderRadiusAll"}
										>
											<Group justify="space-between">
												<Flex
													gap="md"
													justify="center"
													align="center"
													direction="row"
													wrap="wrap"
												>
													<ActionIcon
														variant="transparent"
														size="sm"
														color="red.6"
														onClick={closeModel}
														ml={"4"}
													>
														<IconX
															style={{
																width: "100%",
																height: "100%",
															}}
															stroke={1.5}
														/>
													</ActionIcon>
												</Flex>

												<Group gap={8}>
													<Flex
														justify="flex-end"
														align="center"
														h="100%"
													>
														<Button
															variant="transparent"
															size="xs"
															color="red.4"
															type="reset"
															id=""
															comboboxProps={{ withinPortal: false }}
															onClick={() => vendorAddedForm.reset()}
															p={0}
															rightSection={
																<IconRefreshDot
																	style={{
																		width: "100%",
																		height: "60%",
																	}}
																	stroke={1.5}
																/>
															}
														></Button>
													</Flex>
													<Stack align="flex-start">
														<>
															{!saveCreateLoading && isOnline && (
																<Button
																	size="xs"
																	color={`green.8`}
																	type="submit"
																	id={
																		fieldPrefix +
																		"EntityCustomerFormSubmit"
																	}
																	leftSection={
																		<IconDeviceFloppy
																			size={16}
																		/>
																	}
																>
																	<Flex
																		direction={`column`}
																		gap={0}
																	>
																		<Text fz={14} fw={400}>
																			{t("CreateAndSave")}
																		</Text>
																	</Flex>
																</Button>
															)}
														</>
													</Stack>
												</Group>
											</Group>
										</Box>
									</Box>
								</Box>
							</Grid.Col>
						</Grid>
					</Box>
				</form>
			</Box>
		</>
	);
}

export default AddVendorDrawerForm;
