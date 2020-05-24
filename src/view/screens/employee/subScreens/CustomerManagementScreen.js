import React, { useState } from "react";
import { Image } from "react-native";
import { Layout, Card, Text, Button, Icon } from "@ui-kitten/components";
import { CustomerService } from "../../../../core/services";
import ManagementTemplateScreen from "./ManagementTemplateScreen";
import { LockAccountModal } from "../../../components/others/LockAccountModal";

export default function CustomerManagementScreen({ navigation }) {

    const [data, setData] = useState([]);
    const [lockAccountModalVisible, setLockAccountModalVisible] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState();
    const [searchText, setSearchText] = useState("");

    function handleOnSearch(text) {
        setSearchText(text);
    }

    function handleOnCustomerDetailClick(customer) {
        setSelectedCustomer(customer);
    }

    function handleOnCustomerLockClick(customer) {
        setSelectedCustomer(customer);
        setLockAccountModalVisible(true);
    }

    function getFooterUI(customer) {
        return (
            <Layout style={{ flexDirection: "row" ,justifyContent: "flex-end" }}>
                <Button 
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="edit-2-outline" />}
                    onPress={() => handleOnCustomerDetailClick(customer)}
                >
                    Chi tiết
                </Button>
                <Button
                    status="danger"
                    appearance="ghost"
                    size="tiny"
                    icon={style => <Icon {...style} name="trash-2-outline" />}
                    onPress={() => handleOnCustomerLockClick(customer)}
                >
                    {customer.account.isActive ? "Khóa" : "Mở khóa"}
                </Button>
            </Layout>
        );
    }

    function getCustomerListItemUI(customer) {
        return (
            <Card 
                style={{ margin: 16 }}
                onPress={() => alert(JSON.stringify(customer, null, 2))}
                footer={() => getFooterUI(customer)}
            >
                <Layout style={{ flexDirection: "row", backgroundColor: "rgba(0, 0, 0, 0)", alignItems: "center" }}>
                    <Image 
                        source={{ uri: customer.imagePath }}
                        style={{ borderRadius: 50, width: 50, height: 50 }}
                    />
                    <Layout style={{ margin: 8, alignContent: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                        <Layout style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0)" }}>
                            <Text style={{ fontWeight: "bold" }}>{customer.name}</Text>
                        </Layout>
                        <Text appearance="hint" category="label">{customer.phoneNumber}</Text>
                    </Layout>
                </Layout>
            </Card>
        );
    }

    function getData() {
        return data.filter(c => (c.name.includes(searchText) || (c.phoneNumber && c.phoneNumber.includes(searchText))));
    }
    
    return (
        <Layout style={{ flex: 1 }}>
            <ManagementTemplateScreen 
                loadDataAsync={async () => await CustomerService.getAll()}
                showConfig={false}
                getListItemUI={getCustomerListItemUI}
                data={getData()}
                setData={setData}
                navigation={navigation}
                handleOnSearch={handleOnSearch}
            />
            <LockAccountModal 
                account={selectedCustomer ? selectedCustomer.account : null}
                visible={lockAccountModalVisible}
                setVisible={setLockAccountModalVisible}
            />
        </Layout>
    );
}