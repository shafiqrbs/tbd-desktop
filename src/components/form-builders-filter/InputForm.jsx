import { Tooltip, TextInput } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { IconInfoCircle, IconSearch, IconX } from "@tabler/icons-react";
import { getHotkeyHandler } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../store/core/crudSlice";

function InputForm(props) {
	const { label, placeholder, nextField, id, name, module, filterKey } = props;
	console.log("🚀 ~ InputForm ~ props:", props);
	const { t } = useTranslation();
	const dispatch = useDispatch();

	// Helper function to determine module group
	const getModuleGroup = (module) => {
		switch (module) {
			case "warehouse":
				return "core";
			case "category":
				return "inventory";
			case "recipe-item":
				return "production";
			default:
				return module;
		}
	};

	// Get filter data from core slice
	const filters = useSelector((state) => state.crudSlice?.data[getModuleGroup(module)]?.filters);

	const handleChange = (value) => {
		const moduleGroup = getModuleGroup(module);
		dispatch(
			setFilter({
				module: moduleGroup,
				filterKey,
				name: name,
				value,
			})
		);
	};

	return (
		<TextInput
			label={label}
			leftSection={<IconSearch size={16} opacity={0.5} />}
			size="sm"
			placeholder={placeholder}
			autoComplete="off"
			onKeyDown={getHotkeyHandler([
				nextField === "submit"
					? ["Enter", () => document.getElementById(nextField).click()]
					: ["Enter", () => document.getElementById(nextField).focus()],
			])}
			onChange={(e) => handleChange(e.currentTarget.value)}
			value={filters?.[filterKey]?.[name] || ""}
			id={id}
			rightSection={
				filters?.[filterKey]?.[name] ? (
					<Tooltip label={t("Close")} withArrow bg="red.5">
						<IconX
							color="red"
							size={16}
							opacity={0.5}
							onClick={() => handleChange("")}
						/>
					</Tooltip>
				) : (
					<Tooltip
						label={placeholder}
						withArrow
						position="bottom"
						c="indigo"
						bg="indigo.1"
					>
						<IconInfoCircle size={16} opacity={0.5} />
					</Tooltip>
				)
			}
		/>
	);
}

export default InputForm;
