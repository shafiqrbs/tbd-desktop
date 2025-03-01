import InputForm from "../../../form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function CustomerFilterForm(props) {
	useHotkeys(
		[
			[
				"alt+n",
				() => {
					document.getElementById("Name").focus();
				},
			],
		],
		[]
	);

	return (
		<>
			<InputForm
				label={"Name"}
				placeholder={"Name"}
				nextField={"mobile"}
				id={"Name"}
				name={"name"}
				module={props.module}
			/>

			<InputForm
				label={"Mobile"}
				placeholder={"Mobile"}
				nextField={"submit"}
				id={"mobile"}
				name={"mobile"}
				module={props.module}
			/>
		</>
	);
}

export default CustomerFilterForm;
