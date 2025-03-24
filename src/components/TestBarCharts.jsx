import { Button, Card, Group, Title, useMantineTheme } from "@mantine/core";
import { useSelector, useDispatch } from "react-redux";
import { BarChart } from "@mantine/charts";
import { IconGripVertical } from "@tabler/icons-react";

const DashboardBarChart = ({ slug, header }) => {
	const userProjects = [
		{
			id: "1",
			name: "Lazytask",
			ACTIVE: "1",
		},
		{
			id: "4",
			name: "Webmanza",
			ACTIVE: "1",
		},
		{
			id: "6",
			name: "Foysal",
			ACTIVE: "1",
		},
		{
			id: "7",
			name: "Foysali",
			ACTIVE: "1",
		},
	];

	return (
		<Card withBorder radius="sm">
			<Card.Section withBorder inheritPadding py="xs" className="bg-[#FDFDFD]">
				<Group>
					{<IconGripVertical size="20" />}
					<Title order={6}>Project Summary Chart</Title>
				</Group>
			</Card.Section>

			<Card.Section px="xs" pt="xs">
				{userProjects && userProjects.length > 0 ? (
					<BarChart
						h={352}
						data={userProjects}
						dataKey="name"
						type="stacked"
						withLegend
						legendProps={{ verticalAlign: "bottom", height: 50 }}
						fillOpacity={1}
						barProps={{
							radius: 5,
							spacing: -10, // Negative value to reduce gaps
							dur: 20,
						}}
						cursorFill={null}
						series={[
							// { name: 'TOTAL', color: 'violet.6' },
							{ name: "ACTIVE", color: "#ED7D31" },
							{ name: "COMPLETED", color: "#39758D" },
						]}
						maxBarWidth={30}
					/>
				) : (
					<div>No Project Data Available</div>
				)}
			</Card.Section>
		</Card>
	);
};

export default DashboardBarChart;
