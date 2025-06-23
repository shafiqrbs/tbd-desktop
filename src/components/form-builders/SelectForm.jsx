import { forwardRef } from "react";
import { Tooltip, Select } from "@mantine/core";
import { showNotificationComponent } from "../core-component/showNotificationComponent.jsx";
import { useDispatch } from "react-redux";
import { storeEntityData } from "../../store/core/crudSlice.js";
import inputCss from "../../assets/css/InputField.module.css";
import { useOutletContext } from "react-router";

const SelectForm = forwardRef((props, ref) => {
	const {
		position,
		color,
		label,
		placeholder,
		required,
		nextField,
		name,
		form,
		tooltip,
		mt,
		id,
		dropdownValue = [],
		searchable,
		value,
		changeValue,
		style = {},
		clearable = true,
		allowDeselect = true,
		inlineUpdate = false,
		updateDetails = null,
		pt,
	} = props;
	const dispatch = useDispatch();
	const { isOnline } = useOutletContext();

	const handleChange = async (e) => {
		changeValue(e);
		form.setFieldValue(name, e);
		if (nextField) {
			setTimeout(() => {
				const nextElement = document.getElementById(nextField);
				if (nextElement) {
					nextElement.focus();
				}
			}, 0);
		}
		if (inlineUpdate) {
			updateDetails.data.value = e;
			try {
				if (isOnline) {
					const resultAction = await dispatch(storeEntityData(updateDetails));

					if (resultAction.payload?.status !== 200) {
						showNotificationComponent(
							resultAction.payload?.message || "Error updating invoice",
							"red",
							"",
							"",
							true
						);
					}
				} else {
					await window.dbAPI.updateDataInTable("invoice_table", {
						id: updateDetails.data.invoice_id,
						data: {
							sales_by_id: e,
						},
					});
				}
			} catch (error) {
				showNotificationComponent("Request failed. Please try again.", "red", "", "", true);
				console.error("Error updating invoice:", error);
			}
		}
	};

	return (
		<>
			{form && (
				<Tooltip
					label={tooltip}
					opened={name in form.errors && !!form.errors[name]}
					px={16}
					py={2}
					position={position && position ? position : "top-end"}
					bg={color && color ? color : "red.4"}
					c="white"
					withArrow
					offset={2}
					zIndex={999}
					transitionProps={{ transition: "pop-bottom-left", duration: 500 }}
				>
					<Select
						pt={pt}
						classNames={inputCss}
						ref={ref}
						id={id}
						label={label}
						placeholder={placeholder}
						mt={mt}
						size="sm"
						data={dropdownValue}
						autoComplete="off"
						clearable={clearable}
						searchable={searchable}
						{...form.getInputProps(name)}
						value={value}
						onChange={handleChange}
						withAsterisk={required}
						comboboxProps={props.comboboxProps}
						allowDeselect={allowDeselect}
						style={style}
					/>
				</Tooltip>
			)}
		</>
	);
});

SelectForm.displayName = "SelectForm";

export default SelectForm;
