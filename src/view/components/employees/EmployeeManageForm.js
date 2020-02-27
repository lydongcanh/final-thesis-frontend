import React from "react";
import { Avatar, Button, TextInput } from "react-native-paper";
import { Card } from "@ui-kitten/components"
/**
 * @param {*} props onOk, onCancel
 */
export default function EmployeeManageForm(props) {
    return (
        <Card>
            <TextInput 
                label="Name"
            />
        </Card>
    )
}