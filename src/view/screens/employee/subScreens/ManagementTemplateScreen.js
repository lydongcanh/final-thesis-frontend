import React, { useState, useEffect} from "react";
import { Layout, Icon, Button, Input } from "@ui-kitten/components";
import { ActivityIndicator, Divider } from "react-native-paper";
import { FlatList } from "react-native";
import { LoadErrorPanel } from "../../../components/others";

/**
 * @param props loadDataAsync, handleNewButton, handleConfigButton, getListItemUI, navigation
 */
export default function ManagementTemplateScreen (
    { loadDataAsync, handleNewButton, handleConfigButton, getListItemUI, navigation }
) {

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        callLoadDataAsync();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            callLoadDataAsync();
        });
      
        return unsubscribe;
    }, [navigation]);

    async function callLoadDataAsync() {
        try {
            setIsLoading(true);
            const result = await loadDataAsync();
            if (result.error) {
                console.log(error);
                setIsLoaded(false);
            } else {
                setData(result.data);
                setIsLoaded(true);
            }
        } catch (e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function handleOnSearch() {
        alert("Đang cập nhật");
    }

    function getListUI() {
        return (
            <FlatList
                data={data}
                keyExtractor={(_, item) => item.toString()}
                renderItem={({ item }) => getListItemUI(item)}
            />
        );
    }
    
    function getNewButtonUI() {
        if (handleNewButton) {
            return (
                <Button
                    appearance="ghost"
                    icon={(style) => <Icon {...style} name="plus-outline" />} 
                    style={{ marginLeft: 8, borderRadius: 50, flex: 1 }}
                    onPress={handleNewButton}
                />
            )
        }
    }

    function getConfigPanelUI() {
        return (
            <Layout>
                <Layout style={{ flexDirection: "row", marginTop: 8, marginLeft: 8, marginRight: 8, padding: 8 }}>
                    <Input 
                        icon={(style) => <Icon {...style} name="search-outline" />}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        onIconPress={handleOnSearch}
                        style={{ borderRadius: 50, flex: 50, backgroundColor: "white" }}
                    />
                    {getNewButtonUI()}
                    <Button 
                        appearance="ghost"
                        icon={(style) => <Icon {...style} name="options-2-outline" />}
                        style={{ borderRadius: 50, flex: 1 }}
                        onPress={handleConfigButton}
                    />
                </Layout>
                <Divider />
            </Layout>
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, margin: 8, alignContent: "center" }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={callLoadDataAsync} />

        return (
            <Layout style={{ flex: 1 }}>
                {getConfigPanelUI()}
                {getListUI()}
            </Layout>
        );
    }

    return (
        <Layout style={{ flex: 1 }}>
            {getContentUI()}
        </Layout>
    );
}