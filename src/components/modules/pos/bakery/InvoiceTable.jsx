import { DataTable } from "mantine-datatable";
import tableCss from "./css/Table.module.css";
import { useTranslation } from "react-i18next";
import { Text, Tooltip, Group, ActionIcon } from "@mantine/core";
import { IconMinus, IconPlus, IconTrash } from "@tabler/icons-react";

export default function InvoiceTable({
	invoiceData,
	indexData,
	handleClick,
	handleDecrement,
	handleIncrement,
	handleDelete,
	enableTable,
	checked,
	calculatedHeight,
}) {
	const { t } = useTranslation();
	return (
		<DataTable
			classNames={{
				root: tableCss.root,
				table: tableCss.table,
				header: tableCss.header,
				footer: tableCss.footer,
				pagination: tableCss.pagination,
			}}
			records={invoiceData ? invoiceData.invoice_items : []}
			columns={[
				{
					accessor: "id",
					title: "S/N",
					width: 48,
					render: (data, index) => index + 1,
				},
				{
					accessor: "display_name",
					title: t("Product"),
					render: (data) => (
						<Tooltip
							multiline
							w={220}
							label={
								indexData
									? Array.isArray(indexData)
										? indexData
												.map((item) => `${item.display_name} (${item.qty})`)
												.join(", ")
										: `${indexData.display_name} (${indexData.qty})`
									: data.display_name
							}
							px={12}
							py={2}
							bg={"red.6"}
							c={"white"}
							withArrow
							position="top"
							offset={{ mainAxis: 5, crossAxis: 10 }}
							zIndex={999}
							transitionProps={{
								transition: "pop-bottom-left",
								duration: 500,
							}}
						>
							<Text
								variant="subtle"
								style={{ cursor: "pointer" }}
								component="a"
								onClick={handleClick}
								name="additionalProductAdd"
								c={"red"}
								fz={"xs"}
							>
								{data.display_name}
							</Text>
						</Tooltip>
					),
				},
				{
					accessor: "quantity",
					title: t("Qty"),
					textAlign: "center",
					render: (data) => (
						<>
							<Group gap={8} justify="center">
								<ActionIcon
									size={"sm"}
									bg={"gray.7"}
									disabled={data.quantity === 1}
									onClick={() => handleDecrement(data.stock_item_id)}
								>
									<IconMinus height={"12"} width={"12"} />
								</ActionIcon>
								<Text size="sm" ta={"center"} fw={600} maw={30} miw={30}>
									{data.quantity}
								</Text>
								<ActionIcon
									size={"sm"}
									bg={"gray.7"}
									onClick={() => {
										handleIncrement(data.stock_item_id);
									}}
								>
									<IconPlus height={"12"} width={"12"} />
								</ActionIcon>
							</Group>
						</>
					),
				},
				{
					accessor: "price",
					title: t("Price"),
					textAlign: "right",
					render: (data) => <>{data.sales_price}</>,
				},
				{
					accessor: "subtotal",
					title: "Subtotal",
					textAlign: "right",
					render: (data) => <>{data.sub_total.toFixed(2)}</>,
				},
				{
					accessor: "action",
					title: t(""),
					textAlign: "right",
					render: (data) => (
						<Group justify="right" wrap="nowrap">
							<ActionIcon
								size="sm"
								variant="white"
								color="red.8"
								aria-label="Settings"
								onClick={() => handleDelete(data.stock_item_id)}
							>
								<IconTrash height={20} width={20} stroke={1.5} />
							</ActionIcon>
						</Group>
					),
				},
			]}
			loaderSize="xs"
			loaderColor="grape"
			height={
				enableTable && checked
					? calculatedHeight - 149
					: enableTable
					? calculatedHeight - 99
					: calculatedHeight + 3
			}
			scrollAreaProps={{ type: "never" }}
		/>
	);
}
