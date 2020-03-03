import React, { useState, useEffect } from "react";
import { List, ActivityIndicator } from "react-native-paper";
import { Avatar, Button, Layout, Text } from "@ui-kitten/components";
import { EmployeeService } from "../../../core/services";

/**
 * @param {*} props searchText
 */
export default function EmployeeList(props) {

    const { searchText } = props;

    const [isLoaded, setIsLoaded] = useState(false);
    const [employees, setEmployees] = useState();
    
    useEffect(() => {
        loadEmployees(searchText);
    }, [searchText]);

    // TODO: catch errors...
    async function loadEmployees(searchText) {
        setIsLoaded(false);

        const result = (!searchText || searchText === "")
                       ? await EmployeeService.getAll()
                       : await EmployeeService.query({ containsName: searchText });
        setEmployees(result.data);

        setIsLoaded(true);
    }

    function getEmployeeNameUI(fullname) {
        return <Text category="label">{fullname}</Text>
    }

    function getJobTitleUI(jobTitle) {
        return (
            <Text
                appearance="hint"
                category="c1"
            >
                {jobTitle}
            </Text>
        );
    }

    function getListContent() {
        if (!isLoaded)
            return <ActivityIndicator style={{ margin: 8 }} />;

        if (!employees)
            return <Text>Load nhân viên không thành công.</Text>

        return (
            <List.Section>
                {employees.map((employee, index) => (
                    <Layout key={index}>
                        <List.Item
                            description={() => getJobTitleUI(employee.jobTitle)}
                            left={() => <Avatar style={{ margin: 8 }} source={{ uri: employee.imagePath }} />}
                            right={() => <Button appearance="ghost" onPress={() => alert(JSON.stringify(employee, null, 2))}>Chi tiết</Button>}
                            title={getEmployeeNameUI(employee.name)}
                        />
                    </Layout>
                ))}
            </List.Section>
        );
    }

    return getListContent();
}