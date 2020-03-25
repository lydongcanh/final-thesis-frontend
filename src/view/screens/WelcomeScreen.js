import React from "react";
import { Layout, Button } from "@ui-kitten/components";
import { StyleSheet, ImageBackground, View } from "react-native";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPES } from "../../core/types";

export default function WelcomeScreen({ navigation }) {

    const auth = useSelector(state => state.authReducer);

    if (auth.loggedIn && auth.account) {
        const screen = auth.account.accountType === ACCOUNT_TYPES.Employee ? "EmployeeHome" : "CustomerHome";
        navigation.navigate(screen); 
    }

    const styles = StyleSheet.create({
        backgroundImage: {
            width: "100%",
            height: "100%",
        },
        buttons: {
            top: "70%",
            flex: .225,
            justifyContent: "space-between",
            margin: 24
        },
        skipButtonText: {
            textDecorationLine: "underline",
        }
    });

    return (
        <Layout>
            <ImageBackground
                blurRadius={.5}
                style={styles.backgroundImage}
                source={{ uri: "https://i.pinimg.com/originals/d8/1a/7d/d81a7dfae5224d4672bfb8d67f5c8b97.jpg" }}
            >
                <View style={styles.buttons}>
                    <Button
                        status="danger"
                        onPress={() => navigation.navigate("Login")}
                    >
                        ĐĂNG NHẬP
                    </Button>
                    <Button
                        onPress={() => navigation.navigate("CustomerSignup")}
                    >
                        ĐĂNG KÝ
                    </Button>
                    <Button
                        textStyle={styles.skipButtonText}
                        appearance="ghost"
                        status="basic"
                        onPress={() => navigation.navigate("CustomerHome")}
                    >
                        Bỏ qua
                    </Button>
                </View>
            </ImageBackground>
        </Layout>
    )
}