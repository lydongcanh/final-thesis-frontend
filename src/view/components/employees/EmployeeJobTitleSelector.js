import React from "react";
import { Select } from "@ui-kitten/components";

/**
 * @param {*} props jobTitle, setJobTitle, width
 */
export default function EmployeeJobTitleSelector(props) {

    const positions = [
        { text: "Nhân viên bán hàng" },
        { text: "Nhân viên kho hàng" },
        { text: "Quản lý" }
    ];

    return (
        <Select
            label="Vị trí"
            placeholder="Chọn vị trí"
            data={positions}
            selectedOption={{ text: props.jobTitle }}
            onSelect={({ text }) => props.setJobTitle(text)}
        />
    );
}