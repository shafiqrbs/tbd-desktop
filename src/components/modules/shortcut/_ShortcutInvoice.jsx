import {
	IconDeviceFloppy,
	IconRestore,
	IconPlus,
	IconClockPause,
	IconHandStop,
	IconUser,
	IconRotateClockwise,
} from "@tabler/icons-react";
import { Button, Flex, Tooltip, ScrollArea } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

function _ShortcutInvoice(props) {
	const { t } = useTranslation();
	const { mainAreaHeight } = useOutletContext();
	const formHeight = mainAreaHeight - 46;
	return (
		<>
			<ScrollArea h={formHeight} bg="var(--mantine-color-body)" type="never">
				<Flex direction={`column`} align={"center"} gap={"16"}>
					<Flex direction={`column`} align={"center"} mb={"8"}>
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
					</Flex>

					<Flex direction={`column`} align={"center"} mb={"8"}>
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
					</Flex>

					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextPause")}
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
									console.log("ok");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconClockPause size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+o
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextHold")}
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
									console.log("ok");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconHandStop size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+o
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextCustomer")}
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
									console.log("ok");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconUser size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+o
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
						<Tooltip
							label={t("AltTextReload")}
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
									console.log("ok");
								}}
							>
								<Flex direction={`column`} align={"center"}>
									<IconRotateClockwise size={16} />
								</Flex>
							</Button>
						</Tooltip>
						<Flex direction={`column`} align={"center"} fz={"12"} c={"gray.5"}>
							alt+o
						</Flex>
					</Flex>
					<Flex direction={`column`} align={"center"} mb={"8"}>
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
					</Flex>
				</Flex>
			</ScrollArea>
		</>
	);
}

export default _ShortcutInvoice;
