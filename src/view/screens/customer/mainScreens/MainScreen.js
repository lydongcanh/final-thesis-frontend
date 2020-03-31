import React, { useState, useEffect } from "react";
import { Layout, Text, Button, Icon } from "@ui-kitten/components";
import { CollectionService } from "../../../../core/services";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";
import { Dimensions, View, ImageBackground, Platform, StatusBar } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Space, CustomerScreensHeader } from "../../../components/others";
import { MinimalProduct } from "../../../components/products";

export default function MainScreen({ navigation }) {

    const screenWidth = Dimensions.get("window").width;
    const headCarouselData = [
        "https://images.pexels.com/photos/291762/pexels-photo-291762.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        "https://images.pexels.com/photos/247204/pexels-photo-247204.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
        "https://images.pexels.com/photos/135620/pexels-photo-135620.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselRef, setCarouslRef] = useState();

    const [collections, setCollection] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadCollections();
    }, []);

    async function loadCollections() {
        setIsLoading(true);
        try {
            const collectionResult = await CollectionService.getMainPageCollection();
            // TODO: catch error, reload...
            setCollection(collectionResult.data);
            setIsLoaded(true);
        } catch (e) {
            setIsLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }

    function getCollectionUI(collection) {
        return (
            <Layout style={{ margin: 16 }}>
                <Text style={{ fontWeight: "bold" }} category="h6">{collection.name}</Text>
                <FlatList
                    horizontal
                    data={collection.details}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => <MinimalProduct product={item.product} navigation={navigation} />}
                />
            </Layout>
        );
    }

    function getCollectionsUI() {
        if (isLoading)
            return <ActivityIndicator style={{ margin: 8, flex: 1, alignContent: "center" }} />

        if (!isLoaded) {
            return (
                <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text appearance="hint">Có lỗi xảy ra khi load dữ liệu, xin thử lại!</Text>
                    <Space />
                    <Button
                        size="tiny"
                        icon={(style) => <Icon {...style} name="sync" />}
                        onPress={loadCollections}
                    >
                        Thử lại
                    </Button>
                </Layout>
            );
        }

        return (
            <FlatList
                data={collections}
                numColumns={1}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => getCollectionUI(item)}
            />
        );
    }

    function getHeadCarousel() {
        return (
            <Layout>
                <Carousel
                    data={headCarouselData}
                    itemWidth={screenWidth}
                    onSnapToItem={setActiveIndex}
                    ref={c => setCarouslRef(c)}
                    renderItem={({ item }) => (
                        <ImageBackground
                            source={{ uri: item }}
                            style={{ width: screenWidth, height: 250 }}
                        />
                    )}
                    sliderWidth={screenWidth}
                />
                <View style={{ position: "absolute", bottom: 0 }}>
                    <Pagination
                        activeDotIndex={activeIndex}
                        carouselRef={carouselRef}
                        dotsLength={headCarouselData.length}
                        inactiveDotOpacity={0.4}
                        inactiveDotScale={0.5}
                        tappableDots={true}
                    />
                </View>
            </Layout>
        )
    }

    return (
        <Layout style={{ flex: 1, marginTop: Platform.OS === "ios" ? 0 : StatusBar.currentHeight, }}>
            <CustomerScreensHeader navigation={navigation} />
            <ScrollView>
                {getHeadCarousel()}
                {getCollectionsUI()}
            </ScrollView>
        </Layout>
    );
}