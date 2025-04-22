import { useEffect } from "react";
import genericClass from "../../../../assets/css/Generic.module.css";
import { Box, Grid, Tooltip, ActionIcon, Group, Text } from "@mantine/core";
import { IconMessage, IconEyeEdit, IconUserCircle, IconTallymark1 } from "@tabler/icons-react";
import InputForm from "../../../form-builders/InputForm";
import PhoneNumber from "../../../form-builders/PhoneNumberInput";
import { useTranslation } from "react-i18next";
import SelectForm from "../../../form-builders/SelectForm";
import { notifications } from "@mantine/notifications";

export default function __PosVendorSection(props) {
	//common hooks
	const {
		form,
		isSMSActive,
		currencySymbol,
		setVendorObject,
		vendorObject,
		vendorData,
		setVendorData,
		vendorsDropdownData,
		setVendorsDropdownData,
		defaultVendorId,
		setDefaultVendorId,
	} = props;
	const { t } = useTranslation();

	//fetching customer dropdownData
	useEffect(() => {
		const fetchVendors = async () => {
			const coreVendors = await window.dbAPI.getDataFromTable("core_vendors");
			let defaultId = defaultVendorId;
			if (coreVendors && coreVendors.length > 0) {
				const transformedData = coreVendors.map((type) => {
					if (type.name === "Default") {
						defaultId = type.id;
					}
					return {
						label: type.mobile + " -- " + type.name,
						value: String(type.id),
					};
				});

				setVendorsDropdownData(transformedData);
				setDefaultVendorId(defaultId);
			}
		};

		fetchVendors();
	}, []);

	//setting vendorObject based on vendorData
	useEffect(() => {
		async function fetchCoreVendors() {
			if (vendorData) {
				const coreVendors = await window.dbAPI.getDataFromTable("core_vendors");
				const foundVendors = coreVendors.find((type) => type.id == vendorData);

				if (foundVendors) {
					setVendorObject(foundVendors);
				}
			}
		}

		fetchCoreVendors();
	}, [vendorData]);

	return (
		<>
			<Box pl={`4`} pr={4} mb={"xs"} className={genericClass.bodyBackground}>
				<Grid columns={24} gutter={{ base: 6 }}>
					<Grid.Col span={16} className={genericClass.genericHighlightedBox}>
						<Box pl={"4"} pr={"4"}>
							<Box>
								<Grid gutter={{ base: 6 }} bg={"#bc924f"} mt={4} pt={"4"}>
									<Grid.Col span={10} pl={"8"}>
										<SelectForm
											tooltip={t("VendorValidateMessage")}
											label=""
											placeholder={t("Jhon Dee")}
											required={false}
											nextField={""}
											name={"vendor_id"}
											form={form}
											dropdownValue={vendorsDropdownData}
											id={"vendor_id"}
											searchable={true}
											value={vendorData}
											changeValue={setVendorData}
										/>
									</Grid.Col>
									<Grid.Col span={2}>
										<Box
											mr={"12"}
											mt={"4"}
											style={{ textAlign: "right", float: "right" }}
										>
											<Group>
												<Tooltip
													multiline
													bg={"orange.8"}
													position="top"
													ta={"center"}
													withArrow
													transitionProps={{ duration: 200 }}
													label={
														vendorData && vendorData != defaultVendorId
															? isSMSActive
																? t("SendSms")
																: t("PleasePurchaseAsmsPackage")
															: t("ChooseVendor")
													}
												>
													<ActionIcon
														bg={"white"}
														variant="outline"
														color={"red"}
														disabled={
															!vendorData ||
															vendorData == defaultVendorId
														}
														onClick={() => {
															if (isSMSActive) {
																notifications.show({
																	withCloseButton: true,
																	autoClose: 1000,
																	title: t("smsSendSuccessfully"),
																	message:
																		t("smsSendSuccessfully"),
																	icon: <IconTallymark1 />,
																	className:
																		"my-notification-class",
																	style: {},
																	loading: true,
																});
															}
														}}
													>
														<IconMessage size={18} stroke={1.5} />
													</ActionIcon>
												</Tooltip>
												<Tooltip
													multiline
													bg={"orange.8"}
													position="top"
													withArrow
													offset={{ crossAxis: "-45", mainAxis: "5" }}
													ta={"center"}
													transitionProps={{ duration: 200 }}
													label={
														vendorData && vendorData != defaultVendorId
															? t("VendorDetails")
															: t("ChooseVendor")
													}
												>
													<ActionIcon
														variant="filled"
														color={"red"}
														disabled={
															!vendorData ||
															vendorData == defaultVendorId
														}
														// onClick={() => {
														// 	setViewDrawer(true);
														// }}
													>
														<IconEyeEdit size={18} stroke={1.5} />
													</ActionIcon>
												</Tooltip>
											</Group>
										</Box>
									</Grid.Col>
								</Grid>
							</Box>
							<Box
								pl={"4"}
								pr={"4"}
								mt={"4"}
								pt={"8"}
								className={genericClass.genericSecondaryBg}
							>
								<Grid columns={18} gutter={{ base: 2 }}>
									<Grid.Col span={3}>
										<Text
											pl={"md"}
											className={genericClass.genericPrimaryFontColor}
											fz={"xs"}
										>
											{t("Outstanding")}
										</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text fz={"sm"} order={1} fw={"800"}>
											{currencySymbol + " "}
											{vendorData &&
											vendorObject &&
											vendorData != defaultVendorId
												? Number(vendorObject?.balance).toFixed(2)
												: "0.00"}
										</Text>
									</Grid.Col>
									<Grid.Col span={3}>
										<Text ta="left" size="xs" pl={"md"}>
											{t("Purchase")}
										</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text ta="left" size="sm">
											{" "}
											{currencySymbol} {vendorObject?.purchase}
										</Text>
									</Grid.Col>
								</Grid>
								<Grid columns={18} gutter={{ base: 2 }}>
									<Grid.Col span={3}>
										<Text ta="left" size="xs" pl={"md"}>
											{t("Discount")}
										</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text ta="left" size="sm">
											{" "}
											{currencySymbol} {vendorObject?.discount}
										</Text>
									</Grid.Col>
									<Grid.Col span={3}>
										<Text ta="left" size="xs" pl={"md"}>
											{t("Receive")}
										</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text ta="left" size="sm">
											{" "}
											{currencySymbol} {vendorObject?.receive}
										</Text>
									</Grid.Col>
								</Grid>
								<Grid columns={18} gutter={{ base: 2 }}>
									<Grid.Col span={3}>
										<Text ta="left" size="xs" pl={"md"}>
											{t("CreditLimit")}
										</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text ta="left" size="sm">
											{" "}
											{currencySymbol} {vendorObject?.credit_limit}
										</Text>
									</Grid.Col>
									<Grid.Col span={3}>
										<Text ta="left" size="xs" pl={"md"}>
											{t("EarnPoint")}
										</Text>
									</Grid.Col>
									<Grid.Col span={6}>
										<Text ta="left" size="sm">
											{" "}
											{currencySymbol} {vendorObject?.earn_point}
										</Text>
									</Grid.Col>
								</Grid>
							</Box>
						</Box>
					</Grid.Col>
					<Grid.Col span={8} className={genericClass.genericHighlightedBox}>
						<Box pl={"4"} pr={"4"}>
							<Box mt={"4"}>
								<InputForm
									tooltip={t("NameValidateMessage")}
									label={t("")}
									placeholder={t("VendorName")}
									required={true}
									nextField={"mobile"}
									form={form}
									name={"name"}
									id={"name"}
									leftSection={<IconUserCircle size={16} opacity={0.5} />}
									rightIcon={""}
								/>
							</Box>
							<Box mt={"4"}>
								<PhoneNumber
									tooltip={
										form.errors.mobile
											? form.errors.mobile
											: t("MobileValidateMessage")
									}
									label={t("")}
									placeholder={t("Mobile")}
									nextField={"email"}
									form={form}
									name={"mobile"}
									id={"mobile"}
									rightIcon={""}
								/>
							</Box>
							<Box mt={"4"} mb={4}>
								<InputForm
									tooltip={t("InvalidEmail")}
									label={t("")}
									placeholder={t("Email")}
									required={false}
									nextField={""}
									name={"email"}
									form={form}
									id={"email"}
								/>
							</Box>
						</Box>
					</Grid.Col>
				</Grid>
			</Box>
		</>
	);
}
