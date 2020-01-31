import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/actions/authActions";
import { Button, Card, CardHeader, Layout, Text } from "@ui-kitten/components";

/**
 * 
 * @param {*} props username, password
 */
export default function AccountPanel(props) {
    const dispatch = useDispatch();

    const cardFooter = () => (
        <Layout style={{flexDirection: "row", justifyContent: "flex-end"}}>
            <Button onPress={handleLogoutButton} size="small" status="danger">Logout</Button>
        </Layout>
    );

    function handleLogoutButton() {
        dispatch(logout());
    }

    return (
        <Card
            header={() => <CardHeader title="Account" />}
            footer={cardFooter}
        >
            <Text>Username: {props.username}</Text>
            <Text>Password: {props.password}</Text>
        </Card>
    );
}