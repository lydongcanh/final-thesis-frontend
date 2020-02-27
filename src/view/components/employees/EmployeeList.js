import React from "react";
import { Divider, List } from "react-native-paper";
import { Avatar, Layout, Text } from "@ui-kitten/components";
import { Space } from "../others"
/**
 * 
 * @param {*} props employees
 */
export default function EmployeeList(props) {

    const { employees } = props;

    const employeeTitle = (fullname) => (
        <Text category="label">{fullname}</Text>
    );

    const employeePosition = (position) => (
        <Text
            appearance="hint"
            category="c1"
        >
            {position}
        </Text>
    );

    return (
        <List.Section>
            {employees.map((employee, index) => (
                <Layout key={index}>
                    <List.Item
                        description={() => employeePosition(employee.position)}
                        left={() => <Avatar style={{ margin: 8 }} source={{ uri: employee.image }} />}
                        title={employeeTitle(employee.fullname)}
                    />
                    <Space value={2}/>
                </Layout>
            ))}
        </List.Section>
    );
}