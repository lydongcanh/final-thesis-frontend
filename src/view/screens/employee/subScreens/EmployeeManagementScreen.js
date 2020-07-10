import React, { useState } from "react";
import { Image, FlatList } from "react-native";
import { Layout, Text, Card, Button, Tab, TabView, Icon } from "@ui-kitten/components";
import { EmployeeService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { ManagementTypes } from "../../../types";
import { JOB_TITLES } from "../../../../core/types";
import { LockAccountModal } from "../../../components/others/LockAccountModal";

export default function EmployeeManagementScreen({ navigation }) {

    const [data, setData] = useState([]);
    const [tabViewIndex, setTabViewIndex] = useState();
    const [lockAccountModalVisible, setLockAccountModalVisible] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState();
    const [searchText, setSearchText] = useState("");

    function handleOnSearch(text) {
        setSearchText(text);
    }
    
    function handleNewButton() {
        navigation.navigate("EmployeeDetails", { 
            mode: ManagementTypes.CREATE,
            employees: data
        });
    }

    function handleOnEmployeeDetailClick(employee) {
        navigation.navigate("EmployeeDetails", { 
            mode: ManagementTypes.UPDATE,
            employees: data,
            employee: employee
        });
    }

    function handleOnEmployeeLockClick(employee) {
        setSelectedAccount(employee.account);
        setLockAccountModalVisible(true);
    }

    function getFooterUI(employee) {
        return (
            <Layout style={{ flexDirection: "row" ,justifyContent: "flex-end" }}>
                <Button 
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="edit-2-outline" />}
                    onPress={() => handleOnEmployeeDetailClick(employee)}
                >
                    Chi tiết
                </Button>
                <Button 
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="pricetags-outline" />}
                    onPress={() => navigation.navigate("EmployeeOrderState", { employee: employee })}
                >
                    Hóa đơn
                </Button>
                <Button
                    status="danger"
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="trash-2-outline" />}
                    onPress={() => handleOnEmployeeLockClick(employee)}
                >
                    {employee.account.isActive ? "Khóa" : "Mở khóa"}
                </Button>
            </Layout>
        );
    }
    
    function getEmployeeListItemUI(employee) {
        return (
            <Card 
                disabled
                style={{ margin: 16 }}
                footer={() => getFooterUI(employee)}
            >
                <Layout style={{ flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", alignItems: "center" }}>
                    <Image 
                        source={{ uri: employee.imagePath }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <Layout style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                            <Text style={{ fontWeight: "bold" }}>{employee.name}</Text>
                        </Layout>
                        <Text appearance="hint" category="label">{employee.email}</Text>
                    </Layout>
                </Layout>
            </Card>
        );
    }

    function getListUI(listData) {
        return (
            <FlatList
                data={listData}
                keyExtractor={(_, item) => item.toString()}
                renderItem={({ item }) => getEmployeeListItemUI(item)}
            />
        );
    }

    function getTabViewUI() {
        return (
            <TabView
                indicatorStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
                selectedIndex={tabViewIndex}
                onSelect={setTabViewIndex}
            >
                <Tab title={JOB_TITLES[0]}>
                    {getListUI(data.filter(e => e.jobTitle === JOB_TITLES[0] &&
                                                (e.name.includes(searchText) || 
                                                 e.phoneNumber.includes(searchText))))}
                </Tab>
                <Tab title={JOB_TITLES[1]}>
                    {getListUI(data.filter(e => e.jobTitle === JOB_TITLES[1] &&
                                                (e.name.includes(searchText) || 
                                                 e.phoneNumber.includes(searchText))))}
                </Tab>
            </TabView>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await EmployeeService.getAll()}
                handleNewButton={handleNewButton}
                showConfig={false}
                getListItemUI={getEmployeeListItemUI}
                getOverrideListUI={getTabViewUI}
                data={data}
                setData={setData}
                navigation={navigation}
                handleOnSearch={handleOnSearch}
            />
            <LockAccountModal 
                account={selectedAccount}
                visible={lockAccountModalVisible}
                setVisible={setLockAccountModalVisible}
            />
        </Layout>
    );
}