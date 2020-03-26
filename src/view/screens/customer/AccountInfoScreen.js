import React, { useEffect } from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import { useSelector, useDispatch } from "react-redux";
import { Space } from "../../components/others";
import { logout } from "../../redux/actions/authActions";

export default function AccountInfoScreen({ navigation }) {

    const dispatch = useDispatch();

    function getAccountContent() {
        // TODO: check persisted account.
        const auth = useSelector(state => state.authReducer);

        if (auth.loggedIn) {
            const account = auth.account;
            return (
                <Layout style={{ margin: 16 }}>
                    <Text>Id: {account.id}</Text>
                    <Text>Username: {account.username}</Text>
                    <Text>Password: {account.password}</Text>
                    <Text>Type: {account.accountType}</Text>
                    <Text>CustomerId: {account.customerId}</Text>
                    <Text>Active: {account.isActive.toString()}</Text>
                    <Space />
                    <Button
                        status="danger"
                        onPress={() => dispatch(logout())}
                    >
                        Đăng xuất
                    </Button>
                </Layout>
            );
        }

        return (
            <Layout style={{ margin: 16, justifyContent: "space-between" }}>
                <Button
                    status="danger"
                    onPress={() => navigation.navigate("Login")}
                >
                    ĐĂNG NHẬP
                </Button>
                <Space />
                <Button
                    onPress={() => navigation.navigate("CustomerSignup")}
                >
                    ĐĂNG KÝ
                    </Button>
            </Layout>
        )
    }

    return (
        <Layout style={{ flex: 1 }}>
            {getAccountContent()}
        </Layout>
    );
}