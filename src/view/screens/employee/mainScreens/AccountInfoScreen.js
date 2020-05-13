import React from "react";
import { useDispatch } from "react-redux";
import { Platform, StatusBar } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import { EmployeeScreensHeader } from "../../../components/others";
import { logout } from "../../../redux/actions/authActions";

export default function AccountInfoScreen({ navigation }) {
    
    const dispatch = useDispatch();

    function handleLoggoutButton() {
        dispatch(logout());
        navigation.navigate("Welcome");
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight }}>
            <EmployeeScreensHeader navigation={navigation} />
            <Button
                    size="tiny"
                    //style={{ borderRadius: 24, position: "absolute", top: 0, left: 0 }}
                    status="danger"
                    appearance="ghost"
                    onPress={handleLoggoutButton}
                >
                    Đăng xuất
                </Button>
        </Layout>
    );
}