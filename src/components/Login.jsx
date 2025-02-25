import { Box, Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";

export default function Login() {
	const [users, setUsers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const form = useForm({
		mode: "uncontrolled",
		initialValues: {
			email: "",
		},

		validate: {
			email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
		},
	});

	useEffect(() => {
		async function fetchUsers() {
			// offline: get users from local SQLite via IPC
			console.log("Checking if dbAPI exists:", !!window.dbAPI);
			if (!window.dbAPI) {
				console.error("dbAPI is not available!");
				setIsLoading(false);
				return;
			}

			window.dbAPI
				.getTestUsers()
				.then((localUsers) => {
					console.log("Got local users:", localUsers);
					setUsers(localUsers);
				})
				.catch((err) => {
					console.error("Error fetching local users:", err);
				})
				.finally(() => setIsLoading(false));
		}

		fetchUsers();
	}, []);

	const handleSubmit = (value) => {
		try {
			if (!window.dbAPI) {
				console.error("dbAPI is not available!");
				setIsLoading(false);
				return;
			}
			window.dbAPI.setTestUser(value.email).then(() => {
				console.log("User added successfully");
				setUsers([...users, value]);
				form.reset();
			});
		} catch (error) {
			console.error("Error adding user:", error);
		}
	};

	if (isLoading) {
		return <div>Loading...</div>;
	}

	return (
		<Stack p={20}>
			<form onSubmit={form.onSubmit(handleSubmit)}>
				<TextInput
					withAsterisk
					w={340}
					label="Email"
					placeholder="your@email.com"
					key={form.key("email")}
					{...form.getInputProps("email")}
				/>

				<Group justify="flex-start" mt="md">
					<Button type="submit">Submit</Button>
				</Group>
			</form>
			<Box>
				{users?.map((user) => (
					<div key={user.email}>{user.email}</div>
				))}
			</Box>
		</Stack>
	);
}
