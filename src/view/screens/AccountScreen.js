import React from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { AccountPanel, UserAccountView } from "../components/accounts";

export default function AccountScreen() {
    
    function getAccountContent() {
        // TODO: check persisted account.
        const auth = useSelector(state => state.authReducer);
        
        if (auth.loggedIn) {
            return <AccountPanel account={auth.account}/>
        }

        return <UserAccountView />
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: "flex-start", alignContent: "center", padding: 8}}>
            {getAccountContent()}
        </SafeAreaView>
    );
}