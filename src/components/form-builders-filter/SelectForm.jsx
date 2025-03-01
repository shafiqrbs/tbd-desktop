import React from "react";
import { Select } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

function SelectForm(props) {
	const {
		label,
		placeholder,
		required,
		nextField,
		name,
		mt,
		dropdownValue,
		searchable,
		value,
		changeValue,
		clearable,
		allowDeselect,
		module,
	} = props;

	const dispatch = useDispatch();
	const filters = useSelector((state) => state.crud.data[getModuleGroup(module)].filters);

	const getModuleGroup = (module) => {
		switch (module) {
			case "production-setting":
				return "production";
			// Add other cases as needed
			default:
				return module;
		}
	};

	const handleChange = (value) => {
		const moduleGroup = getModuleGroup(module);
		changeValue(value);

		dispatch({
			type: "crud/setFilter",
			payload: {
				moduleGroup,
				filterKey: module.replace("-", ""),
				name,
				value,
			},
		});

		document.getElementById(nextField).focus();
	};

	return (
		<>
			<Select
				label={label}
				placeholder={placeholder}
				mt={mt}
				size="sm"
				data={dropdownValue}
				autoComplete="off"
				clearable={clearable !== false}
				searchable={searchable}
				value={value}
				onChange={handleChange}
				withAsterisk={required}
				comboboxProps={props.comboboxProps}
				allowDeselect={allowDeselect !== false}
			/>
		</>
	);
}

export default SelectForm;
