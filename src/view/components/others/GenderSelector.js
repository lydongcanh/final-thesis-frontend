import React from "react";
import { Select } from "@ui-kitten/components";

/**
 * @param {*} pros gender, setGender
 */
export default function GenderSelector(props) {

    const genders = [
        { text: "Nam" },
        { text: "Nữ" },
        { text: "Khác" }
    ];

    return (
        <Select
            placeholder="Chọn giới tính"
            label="Giới tính"
            data={genders}
            selectedOption={{ text: props.gender }}
            onSelect={({ text }) => props.setGender(text)}
        />
    );
}