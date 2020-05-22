import React, { useState, useEffect } from "react";
import { Platform, StatusBar, Image, View } from "react-native";
import { Layout, Text, Button, List, ListItem, Icon } from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import { Space, CustomerScreensHeader } from "../../../components/others";
import { logout } from "../../../redux/actions/authActions";
import { Divider, ActivityIndicator } from "react-native-paper";
import { CustomerOrderService } from "../../../../core/services";

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
            title: "Tất cả hóa đơn",
            icon: "pricetags-outline",
            callback: handleCompletedOrdersButton
        },
    ];

    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [orders, setOrders] = useState([]);

    const dispatch = useDispatch();
    const auth = useSelector(state => state.authReducer);
    const account = auth.account;

    useEffect(() => {
        loadOrders();
    }, [account]);

    async function loadOrders() {
        try {
            if (!account || !account.customer) {
                setIsLoaded(true);
                return;
            }

            const result = await CustomerOrderService.getByCustomerId(account.customer.id);
            if (result.error) {
                setIsLoaded(false);
                return;
            }

            setOrders(result.data.sort((a, b) => {
                return new Date(Date.parse(a.creationDate)) < new Date(Date.parse(b.creationDate));
            }));
            setIsLoaded(true);
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function handleAccountDetailsButton() {
        navigation.navigate("CustomerAccountDetails", { customer: account.customer })
    }

    function handleChangePasswordButton() {
        alert("Đang cập nhật...");
    }

    function handleCompletedOrdersButton() {
        navigation.navigate("CustomerOrders", { 
            customer: account.customer,
            orders: orders
        })
    }

    function handleLogoutButton() {
        setIsLoading(true);
        dispatch(logout());
        setIsLoading(false);
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
        const customer = account.customer;
        if (!customer)
            return;
            
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

                <Layout style={{ flex: 1, padding: 4, marginTop: 16  }}>
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
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, alignSelf: "center" }} />

        if (!isLoaded) {
            return (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi load dữ liệu, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={loadOrders}
                    >
                        Thử lại
                    </Button>
                </View>
            );
        }

        // TODO: check persisted account.

        if (auth.loggedIn)
            return getLoggedInUI();

        return getUnloggedInUI();
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <CustomerScreensHeader navigation={navigation} />
            {getAccountContent()}
        </Layout>
    );
}