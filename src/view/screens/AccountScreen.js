import React from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { AccountPanel, UserAccountView } from "../components/accounts";

export default function AccountScreen() {
    
    function getAccountContent() {
        const auth = useSelector(state => state.authReducer);
        if (auth.loggedIn) {
            return <AccountPanel password={auth.password} username={auth.username}/>
        }

        return <UserAccountView />
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: "flex-start", alignContent: "center", padding: 8}}>
            {getAccountContent()}
        </SafeAreaView>
    );
}