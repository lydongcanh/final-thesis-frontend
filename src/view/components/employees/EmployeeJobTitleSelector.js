import React from "react";
import { Select } from "@ui-kitten/components";
import { JOB_TITLES } from "../../../core/types";

/**
 * @param {*} props jobTitle, setJobTitle, width
 */
export default function EmployeeJobTitleSelector(props) {

    return (
        <Select
            label="Vị trí"
            placeholder="Chọn vị trí"
            data={JOB_TITLES}
            selectedOption={{ text: props.jobTitle }}
            onSelect={({ text }) => props.setJobTitle(text)}
        />
    );
}