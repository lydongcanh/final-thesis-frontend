import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Layout, Text, Icon, Button, ButtonGroup, Input } from "@ui-kitten/components";
import { ActivityIndicator, Divider } from "react-native-paper";
import TreeView from "react-native-final-tree-view";
import { CategoryService } from "../../../../core/services";
import { LoadErrorPanel } from "../../../components/others";

export default function CategoryManagementScreen({ navigation }) {

    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        try {
            setIsLoading(true);
            const result = await CategoryService.getAllRoot();
            if (result.error) {
                console.log(result.error);
                setIsLoaded(false);
            } else {
                for (const category of result.data) {
                    setChildren(category);
                }
                setCategories(result.data);
                setIsLoaded(true);
            }
        } catch(e) {
            console.log(e);
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }

        function setChildren(category) {
            if (category && category.childrenCategories) {
                category.children = category.childrenCategories;
                for(const child of category.children) {
                    setChildren(child);
                }
            }
        }
    }
    
    async function handleDeleteButton(node) {
        alert(JSON.stringify(node, null, 2));
    }

    async function handleEditButton(node) {
        alert(JSON.stringify(node, null, 2));
    }

    async function handleAddChildButton(node) {
        alert(JSON.stringify(node, null, 2));
    }

    async function handleNewRootButton() {

    }

    async function handleOnSearch() {

    }

    async function handleNodeOnPress() {
        
    }

    function getIndicator(isExpanded, hasChildrenNodes) {
        if (!hasChildrenNodes)
            return;

        if (isExpanded)
            return <Icon name="chevron-down-outline" width={20} height={20} />;

        return <Icon name="chevron-right-outline"  width={20} height={20} />;
    }

    function getButtonGroup(node, level) {
        //const canDelete = (node && node.children) ? true : false;
        const canAdd = level < 2;
        
        if (!canAdd) {
            return (
                <ButtonGroup
                    status="control"
                    size="tiny"
                    style={{ position: "absolute", right: 8 }}
                >
                    <Button
                        icon={style => <Icon name="edit-2-outline" {...style} />}
                        onPress={async () => await handleEditButton(node)}
                    />
                </ButtonGroup>
            );
        } else {
            return (
                <ButtonGroup
                    status="control"
                    size="tiny"
                    style={{ position: "absolute", right: 8 }}
                >
                    <Button
                        icon={style => <Icon name="edit-2-outline" {...style} />}
                        onPress={async () => await handleEditButton(node)}
                    />
                    <Button
                        icon={style => <Icon name="plus-outline" {...style} />}
                        onPress={async () => await handleAddChildButton(node)}
                    />
                </ButtonGroup>
            );
        }
    }

    function getNewButtonUI() {
        return (
            <Button
                appearance="ghost"
                icon={(style) => <Icon {...style} name="plus-outline" />} 
                style={{ marginLeft: 8, borderRadius: 50, flex: 1 }}
                onPress={handleNewRootButton}
            />
        );
    }

    function getConfigPanelUI() {
        return (
            <Layout style={{ marginBottom: 8 }}>
                <Layout style={{ flexDirection: "row", marginTop: 8, marginLeft: 8, marginRight: 8, padding: 8 }}>
                    <Input 
                        icon={(style) => <Icon {...style} name="search-outline" />}
                        value={searchValue}
                        onChangeText={setSearchValue}
                        onIconPress={handleOnSearch}
                        style={{ borderRadius: 50, flex: 50, backgroundColor: "white" }}
                    />
                    {getNewButtonUI()}
                </Layout>
                <Divider />
            </Layout>
        );
    }

    function getContentUI() {
        if (isLoading)
            return <ActivityIndicator style={{ flex: 1, margin: 8, alignContent: "center" }} />

        if (!isLoaded)
            return <LoadErrorPanel onReload={loadCategories} />

        return (
            <ScrollView>
                <TreeView
                    data={categories.sort((a, b) => a.sortOrder > b.sortOrder)}
                    getCollapsedNodeHeight={() => 32}
                    onNodePress={handleNodeOnPress}
                    renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                        return (
                            <Layout style={{ 
                                marginLeft: 16 * level + (hasChildrenNodes ? 0 : 16), 
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                height: 32,
                            }}>
                                {getIndicator(isExpanded, hasChildrenNodes)}
                                <Text>{node.name}</Text>
                                {getButtonGroup(node, level)}
                            </Layout>
                        );
                    }}
                />
            </ScrollView>
        );
    }

    return (
        <Layout style={{ flex: 1, padding: 8 }}>
            {getConfigPanelUI()}
            {getContentUI()}
        </Layout>
    )
}