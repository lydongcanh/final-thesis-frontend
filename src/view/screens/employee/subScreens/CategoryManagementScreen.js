import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import { Layout, Text, Icon, Button, ButtonGroup, Input } from "@ui-kitten/components";
import { ActivityIndicator, Divider } from "react-native-paper";
import TreeView from "react-native-final-tree-view";
import { CategoryService } from "../../../../core/services";
import { LoadErrorPanel } from "../../../components/others";
import { ManagementTypes } from "../../../types";

export default function CategoryManagementScreen({ navigation }) {

    const [categories, setCategories] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadCategories();
        });
      
        return unsubscribe;
    }, [navigation]);

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

    async function handleEditButton(node) {
        alert(JSON.stringify(node, null, 2));
    }

    async function handleProductsButton(node) {
        navigation.navigate("EmployeeProductManagement", {
            category: node
        });
    }

    async function handleAddChildButton(node, level) {
        navigation.navigate("CategoryDetails", {
            mode: ManagementTypes.CREATE, 
            parentNode: node,
            level: level
        });
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
                    <Button
                        icon={style => <Icon name="cube-outline" {...style} />}
                        onPress={async () => await handleProductsButton(node)}
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
                        onPress={async () => await handleAddChildButton(node, level + 1)}
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
                style={{ margin: 8, borderRadius: 50, alignSelf: "flex-end" }}
                onPress={() => handleAddChildButton(null, 0)}
            />
        );
    }

    function getConfigPanelUI() {
        return (
            <Layout style={{ marginBottom: 8, justifyContent: "flex-end" }}>
                {getNewButtonUI()}
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