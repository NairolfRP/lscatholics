import type { SelectChangeEvent } from "@mui/material/Select";
import type { ChangeEvent } from "react";

export type YesNoRadioFormValue = "yes" | "no" | undefined;

export type TextFieldChangeEventType = ChangeEvent<HTMLInputElement>;
export type SelectFieldChangeEventType = SelectChangeEvent<string>;

export type TextFieldChangeEvent = (e: TextFieldChangeEventType) => void;
export type SelectFieldChangeEvent = (e: SelectFieldChangeEventType) => void;
