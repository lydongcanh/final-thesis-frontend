import React from "react";
import { SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import LoginPanel from "../components/molecules/LoginPanel";
import AccountPanel from "../components/molecules/AccountPanel";

export default function HomeScreen() {    

    function getAccountContent() {
        const auth = useSelector(state => state.authReducer);
        if (auth.loggedIn) {
            return <AccountPanel password={auth.password} username={auth.username}/>
        }

        return <LoginPanel />
    }

    return (
        <SafeAreaView style={{flex: 1, justifyContent: "flex-start", alignContent: "center", padding: 8}}>
            {getAccountContent()}
        </SafeAreaView>
    );
}