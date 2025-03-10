import {
	Paper,
	TextInput,
	PasswordInput,
	Checkbox,
	Button,
	Title,
	Anchor,
	Alert,
	Tooltip,
	Group,
	Center,
	rem,
	Box,
	Loader,
} from "@mantine/core";
import LoginPage from "./../assets/css/LoginPage.module.css";
import classes from "./../assets/css/AuthenticationImage.module.css";
import { getHotkeyHandler, useHotkeys } from "@mantine/hooks";
import { IconInfoCircle, IconLogin, IconArrowLeft } from "@tabler/icons-react";
import { isNotEmpty, useForm } from "@mantine/form";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import commonDataStoreIntoLocalStorage from "./global-hook/local-storage/commonDataStoreIntoLocalStorage.js";
import orderProcessDropdownLocalDataStore from "./global-hook/local-storage/orderProcessDropdownLocalDataStore.js";

export default function Login() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const { t } = useTranslation();
	const navigate = useNavigate();
	const icon = <IconInfoCircle />;

	const [spinner, setSpinner] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const checkAuth = async () => {
			try {
				const res = await window.dbAPI.getDataFromTable("users");
				setUser(res);
				if (res?.id) {
					navigate("/", { replace: true });
				}
			} catch (error) {
				console.error("Auth check error:", error);
			} finally {
				setLoading(false);
			}
		};
		checkAuth();
	}, [navigate]);

	useHotkeys([["alt+n", () => document.getElementById("Username")?.focus()]], []);

	const form = useForm({
		initialValues: { username: "", password: "" },
		validate: {
			username: isNotEmpty(),
			password: isNotEmpty(),
		},
	});

	if (loading) {
		return (
			<Center h="100vh">
				<Loader size="lg" />
			</Center>
		);
	}

	// if already authenticated, don't render the login form
	if (user?.id) {
		return null;
	}

	async function login(data) {
		setSpinner(true);
		setErrorMessage("");

		try {
			const response = await axios({
				method: "POST",
				url: `${import.meta.env.VITE_API_GATEWAY_URL}user-login`,
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "*",
					"X-Api-Key": import.meta.env.VITE_API_KEY,
				},
				data: data,
			});

			if (response.data.status === 200) {
				window.dbAPI.upsertIntoTable("users", response.data.data);
				orderProcessDropdownLocalDataStore(response.data?.data?.id);

				await commonDataStoreIntoLocalStorage(response.data?.data?.id);
				navigate("/", { replace: true });
			} else {
				setErrorMessage(response.data.message);
			}
		} catch (error) {
			setErrorMessage(error?.message || "Login failed");
			console.error(error);
		} finally {
			setSpinner(false);
		}
	}

	return (
		<div className={classes.wrapper}>
			<Box component="form" onSubmit={form.onSubmit(login)}>
				<Paper className={classes.form} radius={0} p={30}>
					<Title order={2} className={classes.title} ta="center" mt="md" mb={80}>
						{t("WelcomeBackToPOSH")}
					</Title>
					{errorMessage && (
						<Alert
							variant="light"
							color="red"
							radius="md"
							title={errorMessage}
							icon={icon}
							mb="md"
						/>
					)}
					<Tooltip
						label={t("UserNameRequired")}
						px={20}
						py={3}
						opened={!!form.errors.username}
						position="top-end"
						color="red"
						withArrow
						offset={2}
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<TextInput
							withAsterisk
							label={t("UserName")}
							placeholder={t("UserName")}
							size="md"
							id="Username"
							{...form.getInputProps("username")}
							onKeyDown={getHotkeyHandler([
								["Enter", () => document.getElementById("Password")?.focus()],
							])}
						/>
					</Tooltip>

					<Tooltip
						label={t("RequiredPassword")}
						px={20}
						py={3}
						opened={!!form.errors.password}
						position="top-end"
						color="red"
						withArrow
						offset={2}
						transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
					>
						<PasswordInput
							withAsterisk
							label={t("Password")}
							placeholder={t("Password")}
							mt="md"
							size="md"
							{...form.getInputProps("password")}
							id="Password"
							onKeyDown={getHotkeyHandler([
								["Enter", () => document.getElementById("LoginSubmit")?.click()],
							])}
						/>
					</Tooltip>
					<Checkbox label="Keep me logged in" mt="xl" size="md" />
					<Group justify="space-between" mt="lg" className={LoginPage.controls}>
						<Anchor c="dimmed" size="sm" className={LoginPage.control}>
							<Center inline>
								<IconArrowLeft
									style={{ width: rem(12), height: rem(12) }}
									stroke={1.5}
								/>
								<Box ml={5}>Back to the sign-up page</Box>
							</Center>
						</Anchor>
						<Button
							fullWidth
							mt="xl"
							bg="red.5"
							size="md"
							type="submit"
							id="LoginSubmit"
							className={LoginPage.control}
							rightSection={<IconLogin />}
							disabled={spinner}
						>
							{spinner ? <Loader color="white" type="dots" size={30} /> : "Login"}
						</Button>
					</Group>
				</Paper>
			</Box>
			<Box className={classes.wrapperImage} />
		</div>
	);
}
