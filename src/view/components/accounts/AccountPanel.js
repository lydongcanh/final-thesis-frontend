import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { Button, Card, CardHeader, Layout, Text } from "@ui-kitten/components";

/**
 * 
 * @param {*} props account
 */
export default function AccountPanel(props) {
    
    const dispatch = useDispatch();
    const { account } = props;

    const cardFooter = () => (
        <Layout style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Button onPress={handleLogoutButton} size="small" status="danger">
                Logout
            </Button>
        </Layout>
    );

    function handleLogoutButton() {
        dispatch(logout());
    }

    return (
        <Card
            appearance="filled"
            header={() => <CardHeader title="Account" />}
            footer={cardFooter}
        >
            <Text>Id: {account.id}</Text>
            <Text>Username: {account.username}</Text>
            <Text>Password: {account.password}</Text>
            <Text>Type: {account.accountType}</Text>
            <Text>Active: {account.isActive.toString()}</Text>
        </Card>
    );
}