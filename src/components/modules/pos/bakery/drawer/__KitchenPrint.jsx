import { Box, Title, Grid, ScrollArea, Button, Group, Textarea, Table } from "@mantine/core";
import { IconPrinter } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import KitchenPrint from "../../print/pos/KitchenPrint";

export default function __KitchenPrint({
	loadCartProducts,
	setLoadCartProducts,
	tableId,
	enableTable,
	salesByUserName,
	invoiceData,
}) {
	const { mainAreaHeight } = useOutletContext();
	const height = mainAreaHeight - 100;
	const { t } = useTranslation();
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [notes, setNotes] = useState({});
	const [print, setPrint] = useState(false);

	// Get kitchen products directly from invoice items
	const kitchenProducts = invoiceData?.invoice_items || [];

	const categorizedProducts = {
		kitchen: kitchenProducts,
	};

	const handleSelect = (type) => {
		const selected = categorizedProducts[type] || [];

		setSelectedProducts({
			items: selected,
			note: notes[type] || "",
			type: type,
		});

		setPrint(true);
	};

	const handleNoteChange = (type, value) => {
		setNotes((prevNotes) => ({
			...prevNotes,
			[type]: value,
		}));
	};

	return (
		<>
			<Box mb={0} bg={"white"}>
				<Box
					pl={`xs`}
					pr={8}
					pt={"2"}
					pb={"8"}
					mb={"4"}
					className={"boxBackground borderRadiusAll"}
				>
					<Grid columns={12} align="center" justify="right">
						<Grid.Col span={6}>
							<Title order={6} pt={"8"}>
								{t("Kitchen")}
							</Title>
						</Grid.Col>
						<Grid.Col span={6}></Grid.Col>
					</Grid>
				</Box>
				<Box className={"borderRadiusAll"}>
					<ScrollArea
						h={height + 66}
						scrollbarSize={2}
						scrollbars="y"
						type="never"
						pt={"xs"}
					>
						{Object.entries(categorizedProducts).map(([type, items]) => (
							<Box key={type} mb="md" p={0} mt={"xs"}>
								<Title order={4} pl={`xs`} pr={"xs"}>
									{type.toUpperCase()}
								</Title>
								<Box m={"xs"}>
									<Table withTableBorder>
										<Table.Thead>
											<Table.Tr>
												<Table.Th>{t("Name")}</Table.Th>
												<Table.Th>{t("Quantity")}</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>
											{items.map((product) => (
												<Table.Tr key={product.id}>
													<Table.Td>{product.display_name}</Table.Td>
													<Table.Td>{product.quantity}</Table.Td>
												</Table.Tr>
											))}
										</Table.Tbody>
									</Table>
								</Box>
								<Box className="borderRadiusAll" m={"xs"} p={"xs"}>
									<Group position="center" wrap="nowrap">
										<Textarea
											w={"80%"}
											placeholder="Note"
											value={notes[type] || ""}
											onChange={(event) =>
												handleNoteChange(type, event.currentTarget.value)
											}
										></Textarea>
										<Button
											leftSection={
												<IconPrinter height={14} width={14} stroke={2} />
											}
											color="red.6"
											size="sm"
											radius={"sm"}
											onClick={() => handleSelect(type)}
										>
											{t("Print")}
										</Button>
									</Group>
								</Box>
							</Box>
						))}
					</ScrollArea>
				</Box>
			</Box>
			{print && (
				<div style={{ display: "none" }}>
					<KitchenPrint
						salesByUserName={salesByUserName}
						setPrint={setPrint}
						selectedProducts={selectedProducts}
					/>
				</div>
			)}
		</>
	);
}
