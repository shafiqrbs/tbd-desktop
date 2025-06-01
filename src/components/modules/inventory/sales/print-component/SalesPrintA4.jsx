import React, { useRef, useEffect } from "react";
import { Grid, Box, Center, Group, Stack, Text, Flex } from "@mantine/core";
import barCode from "../../../../../assets/images/frame.png";
import { useReactToPrint } from "react-to-print";
import classes from "./SalesPrintA4.module.css";
import { useTranslation } from "react-i18next";
import getConfigData from "../../../../global-hook/config-data/getConfigData";

export function SalesPrintA4({ salesViewData, setPrintA4, salesItems }) {
	const ref = useRef(null);
	const { configData } = getConfigData();
	const { t } = useTranslation();

	const handlePrint = useReactToPrint({
		documentTitle: "Invoice",
		contentRef: ref,
		onAfterPrint: () => setPrintA4(false),
	});

	useEffect(() => {
		if (salesViewData && salesItems) {
			console.info("Printing process started...");
			handlePrint();
		}
	}, [salesViewData, salesItems, handlePrint]);

	const imageSrc = `${import.meta.env.VITE_IMAGE_GATEWAY_URL}uploads/inventory/logo/${
		configData.path
	}`;

	return (
		<div className={classes["invoice-body"]} ref={ref}>
			<Box bg={"#E9ECEF"} p={10}>
				<Box>
					<Grid columns={24} gutter={0}>
						<Grid.Col span={8}>
							<Box mt={"2"} ml={"2"}>
								<img
									src={imageSrc}
									alt=""
									className={classes["invoice-header-img"]}
								/>
							</Box>
						</Grid.Col>
						<Grid.Col span={16}>
							<Group justify="space-between" gap="0">
								<Flex
									h={80}
									justify="center"
									ml={"48"}
									align="flex-start"
									direction="row"
									pt={6}
								>
									<Text fw={"800"} fz={"19"} mr={"sm"} mb={"xs"}>
										{t("Invoice")}
									</Text>
								</Flex>
								<Stack justify="center" gap={0}>
									<Flex justify={"flex-end"} mt={"0"}>
										<Text fw={"600"} fz={"16"} mr={"sm"}>
											{configData?.name || configData?.company_name}
										</Text>
									</Flex>
									<Stack justify="flex-end" gap={0} mt={"4"}>
										<Group justify="flex-start" gap={0}>
											<p className={classes["invoice-text-title"]}>
												{t("Email")}
											</p>
											<p className={classes["invoice-text"]}>:</p>
											<p className={classes["invoice-text"]}>
												{configData?.email || ""}
											</p>
										</Group>
										<Group justify="flex-start" gap={0}>
											<p className={classes["invoice-text-title"]}>
												{t("Mobile")}
											</p>
											<p className={classes["invoice-text"]}>:</p>
											<p className={classes["invoice-text"]}>
												{configData?.mobile || ""}
											</p>
										</Group>
									</Stack>
								</Stack>
							</Group>
						</Grid.Col>
					</Grid>
				</Box>
			</Box>
			<main className={classes["invoice-body-main"]}>
				<Box className={classes["invoice-body-details"]}>
					<Group justify="space-between" gap="0">
						<Box pt={"12"}>
							<Flex h={120} justify={"flex-start"} direction={"column"}>
								<Stack justify="center" gap={0}>
									<Stack justify="flex-end" gap={0}>
										<Group justify="flex-start" gap={0}>
											<p className={classes["invoice-text-title-two"]}>
												{t("Customer")}
											</p>
											<p className={classes["invoice-text"]}>:</p>
											<p className={classes["padding-left"]}>
												{salesViewData?.customerName || ""}
											</p>
										</Group>
										<Group justify="flex-start" gap={0}>
											<p className={classes["invoice-text-title-two"]}>
												{t("Mobile")}
											</p>
											<p className={classes["invoice-text"]}>:</p>
											<p className={classes["padding-left"]}>
												{salesViewData?.customerMobile || ""}
											</p>
										</Group>
										<Group justify="flex-start" gap={0}>
											<p className={classes["invoice-text-title-two"]}>
												{t("Address")}
											</p>
											<p className={classes["invoice-text"]}>:</p>
											<p className={classes["padding-left"]}>
												{salesViewData?.customer_address || ""}
											</p>
										</Group>
									</Stack>
								</Stack>
							</Flex>
						</Box>
						<Box>
							<Group justify="center" gap="xs">
								<Stack align="flex-start" justify="center" gap="0">
									<Text h={18} fw={"300"} fz={"12"}>
										{t("Invoice")}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{t("Created")}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{t("CreatedBy")}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{t("SalesBy")}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{t("Mode")}
									</Text>
									<Text fw={"300"} fz={"12"}>
										{t("Process")}
									</Text>
								</Stack>
								<Stack align="center" justify="center" gap="0">
									<Text h={18} fw={"300"} fz={"12"}>
										:
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										:
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										:
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										:
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										:
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										:
									</Text>
								</Stack>
								<Stack align="flex-start" justify="center" gap="0">
									<Text h={18} fw={"300"} fz={"12"}>
										{salesViewData?.invoice || ""}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{salesViewData?.created || ""}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{salesViewData?.createdByName || ""}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{salesViewData?.salesByUser || ""}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{salesViewData?.mode_name || ""}
									</Text>
									<Text h={18} fw={"300"} fz={"12"}>
										{salesViewData?.process || ""}
									</Text>
								</Stack>
							</Group>
						</Box>
					</Group>
				</Box>

				<div className={classes["invoice-body-table-section"]}>
					<table className={classes["invoice-body-table"]}>
						<thead>
							<tr className={classes["invoice-body-table-tr"]}>
								<th
									className={`${classes["invoice-body-table-th"]} ${classes["text-Center"]}`}
								>
									{t("S/N")}
								</th>
								<th
									className={`${classes["invoice-body-table-th"]} ${classes["text-left"]}`}
								>
									{t("Name")}
								</th>
								<th className={classes["invoice-body-table-th"]}>{t("QTY")}</th>
								<th
									className={`${classes["invoice-body-table-th"]} ${classes["text-right"]}`}
								>
									{t("Unit")}
								</th>
								<th className={classes["invoice-body-table-th"]}>{t("Price")}</th>
								<th
									className={`${classes["invoice-body-table-th"]} ${classes["text-right"]}`}
								>
									{t("Total")}
								</th>
							</tr>
						</thead>
						<tbody>
							{Array.isArray(salesItems) &&
								salesItems?.map((element, index) => (
									<React.Fragment key={index}>
										<tr className={classes["invoice-body-table-tr"]}>
											<td
												className={`${classes["invoice-body-table-td"]} ${classes["text-center"]}`}
											>
												{index + 1}
											</td>
											<td className={classes["invoice-body-table-td"]}>
												{element?.name}
												{element?.sku && (
													<>
														<br />
														{t("Sku")} {element?.sku}
													</>
												)}
											</td>
											<td
												className={`${classes["invoice-body-table-td"]} ${classes["text-center"]}`}
											>
												{element?.quantity}
											</td>
											<td
												className={`${classes["invoice-body-table-td"]} ${classes["text-right"]}`}
											>
												{element?.uom}
											</td>
											<td
												className={`${classes["invoice-body-table-td"]} ${classes["text-center"]}`}
											>
												{element?.sales_price}
											</td>
											<td
												className={`${classes["invoice-body-table-td"]} ${classes["text-right"]}`}
											>
												{element?.sub_total}
											</td>
										</tr>
									</React.Fragment>
								))}
						</tbody>
					</table>
				</div>
			</main>
			<footer className={classes["invoice-footer"]}>
				<div className={classes["invoice-footer-contents"]}>
					<div className={classes["invoice-footer-one"]}>
						<Center>
							<img src={barCode} alt="" className={classes["invoice-footer-img"]} />
						</Center>
					</div>
					<div className={classes["footer-right-section"]}>
						<div className={classes["footer-name-section"]}>
							<div className={classes["invoice-footer-two-left"]}>
								<p className={classes["invoice-footer-text-two"]}>
									{t("SubTotal")}
								</p>
								<p className={classes["invoice-footer-text-two"]}>
									{t("Discount")}
								</p>
								<p className={classes["invoice-footer-text-two"]}>{t("Total")}</p>
								<p
									className={`${classes["invoice-footer-text-two"]} ${classes["footer-border-bottom"]}`}
								>
									{t("Receive")}
								</p>
								<p
									className={`${classes["invoice-footer-text-two"]} ${classes["footer-border-bottom"]}`}
								>
									{t("Due")}
								</p>
							</div>
						</div>
						<div className={classes["footer-data-section"]}>
							<div className={classes["invoice-footer-two-right"]}>
								<p className={classes["invoice-footer-text-two"]}>
									{salesViewData &&
										salesViewData.sub_total &&
										Number(salesViewData.sub_total).toFixed(2)}
								</p>
								<p className={classes["invoice-footer-text-two"]}>
									{salesViewData &&
										salesViewData.discount &&
										Number(salesViewData.discount).toFixed(2)}
								</p>
								<p className={classes["invoice-footer-text-two"]}>
									{salesViewData &&
										salesViewData.total &&
										Number(salesViewData.total).toFixed(2)}
								</p>
								<p
									className={`${classes["invoice-footer-text-two"]} ${classes["footer-border-bottom"]}`}
								>
									{salesViewData &&
										salesViewData.payment &&
										Number(salesViewData.payment).toFixed(2)}
								</p>
								<p className={classes["invoice-footer-text-two"]}>
									{salesViewData &&
										salesViewData.total &&
										(
											Number(salesViewData.total) -
											Number(salesViewData.payment)
										).toFixed(2)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
