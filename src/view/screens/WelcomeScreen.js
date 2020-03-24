import React from "react";
import { Layout, Button } from "@ui-kitten/components";
import { StyleSheet, ImageBackground, View } from "react-native";

export default function WelcomeScreen() {

    const styles = StyleSheet.create({
        backgroundImage: {
            width: "100%",
            height: "100%",
        },
        buttons: {
            top: "70%",
            flex: .225,
            justifyContent: "space-between",
            margin: 16
        },
        skipButtonText: {
            textDecorationLine: "underline",
        }
    });

    return (
        <Layout>
            <ImageBackground
                blurRadius={.1}
                style={styles.backgroundImage}
                source={{ uri: "https://i.pinimg.com/originals/d8/1a/7d/d81a7dfae5224d4672bfb8d67f5c8b97.jpg" }}
            >
                <View style={styles.buttons}>
                    <Button appearance="outline" status="basic">SIGN UP</Button>
                    <Button status="danger" >LOGIN</Button>
                    <Button textStyle={styles.skipButtonText} appearance="ghost" status="info">SKIP</Button>
                </View>
            </ImageBackground>
        </Layout>
    )
}