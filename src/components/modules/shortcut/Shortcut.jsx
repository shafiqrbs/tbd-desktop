import { IconDeviceFloppy, IconRestore, IconPlus } from "@tabler/icons-react";
import { Button, Flex, Tooltip, Stack, Center, Container } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

function Shortcut(props) {
	const { t, i18n } = useTranslation();
	const { isOnline, mainAreaHeight } = useOutletContext();
	const formHeight = mainAreaHeight - 46; //TabList height 104
	const { inputType, Name } = props;
	return (
		<>
			<Stack h={formHeight} bg="var(--mantine-color-body)" align="center">
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
									inputType === "select"
										? document.getElementById(Name).click()
										: document.getElementById(Name).focus();
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
								onClick={(e) => {
									props.handleFormReset
										? props.handleFormReset()
										: props.form.reset();
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
								color={`green.8`}
								radius="xl"
								onClick={(e) => {
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

export default Shortcut;
