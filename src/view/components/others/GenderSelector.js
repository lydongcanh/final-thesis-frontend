import React from "react";
import { Select } from "@ui-kitten/components";
import { GENDERS } from "../../../core/types";

/**
 * @param {*} pros gender, setGender
 */
export default function GenderSelector(props) {

    return (
        <Select
            placeholder="Chọn giới tính"
            label="Giới tính"
            data={GENDERS}
            selectedOption={{ text: props.gender }}
            onSelect={({ text }) => props.setGender(text)}
        />
    );
}