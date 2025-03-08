import { useTranslation } from "react-i18next";
import InputForm from "../../../form-builders-filter/InputForm.jsx";
import { useHotkeys } from "@mantine/hooks";

function VendorFilterForm(props) {
	const { t } = useTranslation();

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
				label={t("Name")}
				placeholder={t("Name")}
				nextField={"Mobile"}
				id={"Name"}
				name={"name"}
				module={props.module}
				filterKey={"vendor"}
			/>

			<InputForm
				label={t("Mobile")}
				placeholder={t("Mobile")}
				nextField={"CompanyNameFilter"}
				id={"Mobile"}
				name={"mobile"}
				module={props.module}
				filterKey={"vendor"}
			/>

			<InputForm
				label={t("CompanyName")}
				placeholder={t("CompanyName")}
				nextField={"submit"}
				id={"CompanyNameFilter"}
				name={"company_name"}
				module={props.module}
				filterKey={"vendor"}
			/>
		</>
	);
}

export default VendorFilterForm;
