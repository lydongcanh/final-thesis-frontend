import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Platform, StatusBar, Image } from "react-native";
import { Layout, Text, Button, List, ListItem, Icon } from "@ui-kitten/components";
import { Divider } from "react-native-paper";
import { logout } from "../../../redux/actions/authActions";
import { Space, EmployeeScreensHeader } from "../../../components/others";

export default function AccountInfoScreen({ navigation }) {
    
    const accountFunctionDatas = [
        {
            title: "Thông tin cá nhân",
            icon: "edit-outline",
            callback: handleAccountDetailsButton
        },
        {
            title: "Đổi mật khẩu",
            icon: "lock-outline",
            callback: handleChangePasswordButton
        },
        {
            title: "Hóa đơn đã xủ lý",
            icon: "pricetags-outline",
            //callback: handleCompletedOrdersButton
            callback: () => alert("Đang cập nhật...")
        },
    ];

    const dispatch = useDispatch();
    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    function handleAccountDetailsButton() {
        navigation.navigate("EmployeeAccountDetails", { employee: account.employee })
    }

    function handleChangePasswordButton() {
        navigation.navigate("ChangePassword", {
            account: account
        });
    }

    function handleLogoutButton() {
        dispatch(logout());
    }

    function getAccountFunctionUI({ item }) {
        return (
            <Layout>
                <ListItem
                    title={item.title}
                    icon={style => <Icon {...style} name={item.icon} />}
                    accessory={style => <Icon {...style} name="chevron-right-outline" />}
                    onPress={item.callback}
                />
                <Divider />
            </Layout>
        );
    }

    function getLoggedInUI() {
        const employee = account.employee;
        if (!employee)
            return;
            
        return (
            <Layout style={{ flex: 1, margin: 16, justifyContent: "space-between" }}>
                <Layout style={{ alignItems: "center" }}>
                    <Layout style={{ elevation: 8, borderRadius: 50 }}>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                            source={{ uri: employee.imagePath }}
                        />
                    </Layout>
                    <Text category="h5" style={{ fontWeight: "bold" }} >{employee.name}</Text>
                    <Text appearance="hint" >{employee.jobTitle}</Text>
                </Layout>

                <Layout style={{ flex: 1, padding: 4, marginTop: 16 }}>
                    <List
                        style={{ backgroundColor: "white" }}
                        data={accountFunctionDatas}
                        renderItem={getAccountFunctionUI}
                    />
                </Layout>

                <Button
                    size="tiny"
                    style={{ borderRadius: 24, position: "absolute", top: 0, left: 0 }}
                    status="danger"
                    appearance="ghost"
                    onPress={handleLogoutButton}
                >
                    Đăng xuất
                </Button>
            </Layout>
        );
    }

    function getUnloggedInUI() {
        navigation.navigate("Welcome");

        return (
            <Layout style={{
                flex: 1,
                margin: 16,
                justifyContent: "center",
                marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
            }}>
                <Button
                    style={{ borderRadius: 24 }}
                    status="info"
                    onPress={() => navigation.navigate("Login")}
                >
                    ĐĂNG NHẬP
                </Button>
                <Space />
            </Layout>
        )
    }

    function getAccountContent() {
        // TODO: check persisted account.

        if (auth.loggedIn)
            return getLoggedInUI();

        return getUnloggedInUI();
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            {getAccountContent()}
        </Layout>
    );
}