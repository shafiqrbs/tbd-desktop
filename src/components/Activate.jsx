import {
	Box,
	Button,
	Container,
	PasswordInput,
	PinInput,
	Text,
	TextInput,
	Title,
	Paper,
	Stack,
	Group,
	Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { getHotkeyHandler } from "@mantine/hooks";
import { IconKey, IconShieldLock, IconCheck } from "@tabler/icons-react";

export default function Activate() {
	const form = useForm({
		initialValues: {
			licenseKey: "",
			activeKey: "",
			password: "",
			confirmPassword: "",
		},
		validate: {
			licenseKey: (value) => (value.length < 11 ? "License key must be 11 characters" : null),
			activeKey: (value) =>
				value.length < 10 ? "Activation key must be 10 characters" : null,
			password: (value) =>
				value.length < 6 ? "Password must be at least 6 characters" : null,
			confirmPassword: (value, values) =>
				value !== values.password ? "Passwords do not match" : null,
		},
	});

	const handleSubmit = form.onSubmit((values) => {
		console.log("Form submitted:", values);
		// Handle activation logic here
	});

	return (
		<Box
			component="section"
			mih="100vh"
			style={{ display: "flex", alignItems: "center", backgroundColor: "#f8f9fa" }}
		>
			<Container size="sm" py="xl">
				<Paper radius="md" p="xl" withBorder shadow="lg">
					<Box ta="center" mb="md">
						<img src="/tbd-logo.png" height="90px" alt="TerminalBD" />
					</Box>

					<Stack spacing="lg">
						<Box ta="center" mb="md">
							<Title order={2} fw={700} c="red.7">
								Activate Your Account
							</Title>
							<Text c="gray.7" size="sm" mt="xs">
								Enter your license details to activate your account
							</Text>
						</Box>

						<Box component="form" onSubmit={handleSubmit}>
							<Stack spacing="md">
								<Tooltip
									label={form.errors.licenseKey}
									px={20}
									py={3}
									opened={!!form.errors.licenseKey}
									position="top-end"
									color="red"
									withArrow
									offset={2}
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<TextInput
										label="License Key"
										placeholder="XXX-XXXXX-XXX"
										icon={<IconKey size={16} />}
										withAsterisk
										{...form.getInputProps("licenseKey")}
										error={!!form.errors.licenseKey}
										size="md"
										radius="md"
									/>
								</Tooltip>

								<Box>
									<Text fw={500} mb={5} c="dark">
										Activation Key{" "}
										<Box component="span" c="red">
											*
										</Box>
									</Text>
									<Tooltip
										label={form.errors.activeKey}
										px={20}
										py={3}
										opened={!!form.errors.activeKey}
										position="top-end"
										color="red"
										withArrow
										offset={2}
										transitionProps={{
											transition: "pop-bottom-left",
											duration: 500,
										}}
									>
										<Group position="center" mb={5}>
											<PinInput
												withAsterisk
												name="activeKey"
												id="pin"
												size="md"
												length={10}
												type="number"
												{...form.getInputProps("activeKey")}
												styles={(theme) => ({
													input: {
														borderColor: form.errors.activeKey
															? theme.colors.red[5]
															: undefined,
													},
												})}
											/>
										</Group>
									</Tooltip>
								</Box>

								<Tooltip
									label={form.errors.password}
									px={20}
									py={3}
									opened={!!form.errors.password}
									position="top-end"
									color="red"
									withArrow
									offset={2}
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<PasswordInput
										label="New Password"
										placeholder="Set a new password"
										icon={<IconShieldLock size={16} />}
										withAsterisk
										{...form.getInputProps("password")}
										error={!!form.errors.password}
										size="md"
										radius="md"
									/>
								</Tooltip>

								<Tooltip
									label={form.errors.confirmPassword}
									px={20}
									py={3}
									opened={!!form.errors.confirmPassword}
									position="top-end"
									color="red"
									withArrow
									offset={2}
									transitionProps={{
										transition: "pop-bottom-left",
										duration: 500,
									}}
								>
									<PasswordInput
										label="Confirm Password"
										placeholder="Confirm your password"
										icon={<IconShieldLock size={16} />}
										withAsterisk
										{...form.getInputProps("confirmPassword")}
										error={!!form.errors.confirmPassword}
										size="md"
										radius="md"
										onKeyDown={getHotkeyHandler([
											[
												"Enter",
												() =>
													document
														.getElementById("activateSubmit")
														?.click(),
											],
										])}
									/>
								</Tooltip>

								<Button
									id="activateSubmit"
									type="submit"
									fullWidth
									size="md"
									radius="md"
									mt="md"
									leftIcon={<IconCheck size={18} />}
									gradient={{ from: "black", to: "red", deg: 45 }}
									variant="gradient"
								>
									Activate Account
								</Button>
							</Stack>
						</Box>
					</Stack>
				</Paper>
			</Container>
		</Box>
	);
}
