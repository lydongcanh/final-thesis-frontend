import React, { useState } from "react";
import { Image } from "react-native";
import { Layout, Text, Card, Button } from "@ui-kitten/components";
import { EmployeeService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";

export default function EmployeeManagementScreen({ navigation }) {

    const [data, setData] = useState([]);

    function handleNewButton() {
        navigation.navigate("EmployeeDetails", { 
            mode: ManagementTypes.CREATE,
            employees: data
        });
    }

    function handleConfigButton() {
        alert("Đang cập nhật");
    }

    function getEmployeeListItemUI(employee) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(employee, null, 2))}
            >
                <Layout style={{ flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", alignItems: "center" }}>
                    <Image 
                        source={{ uri: employee.imagePath }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <Layout style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                            <Text style={{ fontWeight: "bold" }}>{employee.name}</Text>
                            <Button 
                                disabled
                                size="tiny"
                                style={{ borderRadius: 20, marginLeft: 8 }}
                            >
                                {employee.jobTitle}
                            </Button>
                        </Layout>
                        <Text appearance="hint">{employee.phoneNumber}</Text>
                    </Layout>
                </Layout>
            </Card>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await EmployeeService.getAll()}
                handleNewButton={handleNewButton}
                handleConfigButton={handleConfigButton}
                getListItemUI={getEmployeeListItemUI}
                data={data}
                setData={setData}
                navigation={navigation}
            />
        </Layout>
    );
}