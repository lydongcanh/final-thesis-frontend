import React, { useEffect } from "react";
import { Platform, StatusBar, Image } from "react-native";
import { Layout, Text, Button, List, ListItem, Icon } from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import { Space, CustomerScreensHeader } from "../../../components/others";
import { logout } from "../../../redux/actions/authActions";
import { Divider } from "react-native-paper";

export default function AccountInfoScreen({ navigation }) {

    const accountFunctionDatas = [
        {
            title: "Địa chỉ",
            icon: "pin"
        },
        {
            title: "Thông tin cá nhân",
            icon: "edit"
        },
        {
            title: "Đổi mật khẩu",
            icon: "lock"
        },
        {
            title: "Hóa đơn",
            icon: "pricetags"
        }
    ];

    const dispatch = useDispatch();

    function getAccountFunctionUI({ item }) {
        return (
            <Layout>
                <ListItem
                    title={item.title}
                    icon={style => <Icon {...style} name={item.icon} />}
                    accessory={style => <Icon {...style} name="chevron-right-outline" />}
                />
                <Divider />
                <Space value={16}/>
            </Layout>
        );
    }

    function getLoggedInUI(account) {
        const customer = account.customer;

        return (
            <Layout style={{ flex: 1, margin: 16, justifyContent: "space-between" }}>
                <Layout style={{ alignItems: "center" }}>
                    <Layout style={{ elevation: 8, borderRadius: 50 }}>
                        <Image
                            style={{ width: 100, height: 100, borderRadius: 50 }}
                            source={{ uri: customer.imagePath }}
                        />
                    </Layout>
                    <Text category="h5" style={{ fontWeight: "bold" }} >{customer.name}</Text>
                    <Text appearance="hint" >{customer.vipLevel}</Text>
                </Layout>

                <Layout style={{ padding: 4 }}>
                    <List
                        data={accountFunctionDatas}
                        renderItem={getAccountFunctionUI}
                    />
                </Layout>

                <Button
                    style={{ borderRadius: 24 }}
                    status="danger"
                    onPress={() => dispatch(logout())}
                >
                    Đăng xuất
                </Button>
            </Layout>
        );
    }

    function getUnloggedInUI() {
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

                <Button
                    style={{ borderRadius: 24 }}
                    status="basic"
                    onPress={() => navigation.navigate("CustomerSignup")}
                >
                    ĐĂNG KÝ
                    </Button>
            </Layout>
        )
    }

    function getAccountContent() {
        // TODO: check persisted account.
        const auth = useSelector(state => state.authReducer);

        if (auth.loggedIn) {
            const account = auth.account;
            return getLoggedInUI(account);
        }

        return getUnloggedInUI();
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <CustomerScreensHeader navigation={navigation} />
            {getAccountContent()}
        </Layout>
    );
}