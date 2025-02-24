import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";

export default function Login() {
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
		console.log(form.values);
	}, [form.values]);

	return (
		<Stack>
			<form onSubmit={form.onSubmit((values) => console.log(values))}>
				<TextInput
					withAsterisk
					label="Email"
					placeholder="your@email.com"
					key={form.key("email")}
					{...form.getInputProps("email")}
				/>

				<Group justify="flex-start" mt="md">
					<Button type="submit">Submit</Button>
				</Group>
			</form>
		</Stack>
	);
}
