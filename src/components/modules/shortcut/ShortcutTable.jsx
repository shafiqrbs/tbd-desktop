import { IconDeviceFloppy, IconRestore, IconPlus } from "@tabler/icons-react";
import { Button, Flex, Tooltip, Center, Stack, Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

function ShortcutTable(props) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const ShortcutHeight = mainAreaHeight - 96; //TabList height 104
	return (
		<>
			<Stack h={ShortcutHeight} bg="var(--mantine-color-body)" align="center">
				<Center>
					<Container fluid mb={"8"}>
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
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`red.5`}
								radius="xl"
								onClick={() => {
									document.getElementById(props.Name).focus();
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconPlus size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+n
						</Flex>
					</Container>
				</Center>
				<Center>
					<Container fluid mb={"8"}>
						<Tooltip
							label={t("AltTextReset")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"light"}
								color={`red`}
								radius="xl"
								onClick={() => {
									props.form.reset();
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconRestore size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+r
						</Flex>
					</Container>
				</Center>
				<Center>
					<Container fluid mb={"8"}>
						<Tooltip
							label={t("AltTextSave")}
							px={16}
							py={2}
							withArrow
							position={"left"}
							c={"white"}
							bg={`red.5`}
							transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
						>
							<Button
								size="md"
								pl={"12"}
								pr={"12"}
								variant={"filled"}
								color={`green.8 `}
								radius="xl"
								onClick={() => {
									document.getElementById(props.FormSubmit).click();
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconDeviceFloppy size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+s
						</Flex>
					</Container>
				</Center>
			</Stack>
		</>
	);
}

export default ShortcutTable;
