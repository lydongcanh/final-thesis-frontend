import React from "react";
import { useSelector } from "react-redux";
import { AccountPanel, UserAccountView } from "../components/accounts";
import { Layout } from "@ui-kitten/components";
import { Platform, StatusBar } from "react-native";

export default function AccountScreen() {

    function getAccountContent() {
        // TODO: check persisted account.
        const auth = useSelector(state => state.authReducer);

        if (auth.loggedIn) {
            return <AccountPanel account={auth.account} />
        }

        return <UserAccountView />
    }

    return (
        <Layout style={{ 
            flex: 1, 
            justifyContent: "flex-start", 
            alignContent: "center", 
            padding: 8,
            marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight
        }}>
            {getAccountContent()}
        </Layout>
    );
}