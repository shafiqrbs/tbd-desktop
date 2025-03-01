import InputForm from "../../../form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function CategoryGroupFilterForm(props) {
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
				nextField={"submit"}
				id={"Name"}
				name={"name"}
				module={props.module}
			/>
		</>
	);
}

export default CategoryGroupFilterForm;
