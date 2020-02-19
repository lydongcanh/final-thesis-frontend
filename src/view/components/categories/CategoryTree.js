import React, { useEffect, useState } from "react";
import TreeView from "react-native-final-tree-view";
import { Layout, Icon, Text } from "@ui-kitten/components";
import { ActivityIndicator, Chip, Divider } from "react-native-paper";
import { CategoryService } from "../../../core/services";

/**
 * @param {*} props onLeafNodePressed(node)
 */
export default function CategoryTree(props) {

    const [categories, setCategories] = useState(null);

    useEffect(() => {
        loadCategories();
    }, []);

    async function loadCategories() {
        const result = await CategoryService.getAllRoot();
        if (result.data) {
            for (const category of result.data) {
                setChildren(category);
            }
            setCategories(result.data);
        } else {
            // TODO: display error, load again button
            alert("Failed to load categories!!");
        }
    }

    function setChildren(category) {
        if (category && category.childrenCategories) {
            category.children = category.childrenCategories;
            for(const child of category.children) {
                setChildren(child);
            }
        }
    }

    function getIndicator(isExpanded, hasChildrenNodes) {
        const indicatorStyle = { width: 16 };

        if (!hasChildrenNodes)
            return "";

        if (isExpanded)
            return <Icon name="chevron-down-outline" style={indicatorStyle} />;

        return <Icon name="chevron-right-outline" style={indicatorStyle} />;
    }

    async function handleNodeOnPress({ node }) {
        if (!node || node.children) // Not leaf
            return;

        if (props.onLeafNodePressed)
            props.onLeafNodePressed(node);
    }

    function getTreeView() {
        if (!categories)
            return <ActivityIndicator style={{ padding: 8, margin: 8 }}/>

        return (
            <TreeView
                data={categories}
                getCollapsedNodeHeight={() => 32}
                onNodePress={handleNodeOnPress}
                renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
                    return (
                        <Chip
                            avatar={getIndicator(isExpanded, hasChildrenNodes)}
                            mode="flat"
                            style={{ marginLeft: 16 * level, borderRadius: 0, backgroundColor: "white" }}
                        >
                            <Text>{node.name}</Text>
                        </Chip>
                    );
                }}
            />
        );
    }

    return (
        <Layout>
            <Text category="label" style={{ padding: 8 }}>Categories</Text>
            <Divider />
            {getTreeView()}
        </Layout>
    );
}