import { Drawer, Flex, ActionIcon, Box } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import __AdditionalItems from "./__AdditionalItems";
import __SplitPayment from "./__SplitPayment";
import __KitchenPrint from "./__KitchenPrint";

export default function _CommonDrawer({
	setLoadCartProducts,
	enableTable,
	tableId,
	commonDrawer,
	setCommonDrawer,
	eventName,
	salesDueAmount,
	getAdditionalItem,
	getSplitPayment,
	currentSplitPayments,
	tableSplitPaymentMap,
	loadCartProducts,
	salesByUserName,
	invoiceData,
}) {
	const closeDrawer = () => {
		setCommonDrawer(false);
	};
	return (
		<>
			<Drawer.Root
				opened={commonDrawer}
				position="right"
				onClose={closeDrawer}
				size={"30%"}
				bg={"gray.1"}
			>
				<Drawer.Overlay />
				<Drawer.Content style={{ overflow: "hidden" }}>
					<Box>
						<Flex
							mih={40}
							gap="md"
							justify="flex-end"
							align="center"
							direction="row"
							wrap="wrap"
						>
							<ActionIcon
								mr={"sm"}
								radius="xl"
								color="red.6"
								size="md"
								onClick={closeDrawer}
							>
								<IconX style={{ width: "100%", height: "100%" }} stroke={1.5} />
							</ActionIcon>
						</Flex>
					</Box>
					<Drawer.Body>
						<Box>
							{eventName === "splitPayment" && (
								<__SplitPayment
									closeDrawer={closeDrawer}
									salesDueAmount={salesDueAmount}
									getSplitPayment={getSplitPayment}
									currentSplitPayments={currentSplitPayments}
									tableSplitPaymentMap={tableSplitPaymentMap}
								/>
							)}

							{eventName === "additionalProductAdd" && (
								<__AdditionalItems
									closeDrawer={closeDrawer}
									getAdditionalItem={getAdditionalItem}
								/>
							)}
							{eventName === "kitchen" && (
								<__KitchenPrint
									salesByUserName={salesByUserName}
									closeDrawer={closeDrawer}
									tableId={tableId}
									loadCartProducts={loadCartProducts}
									setLoadCartProducts={setLoadCartProducts}
									enableTable={enableTable}
									invoiceData={invoiceData}
								/>
							)}
						</Box>
					</Drawer.Body>
				</Drawer.Content>
			</Drawer.Root>
		</>
	);
}
