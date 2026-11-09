import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import Drawer from "expo-router/drawer";
import { Profiler, useEffect, useMemo, useState, } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDrawer } from "../src/admin/viewmodels/use-drawer";
import { TextInput } from "react-native-gesture-handler";
import { steps } from "react-native-reanimated"
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";
import { CategoryService } from "../src/categories/services/category.service";
import { useCreateProduct } from "../src/products/viewmodels/use-create-product";

const { width } = Dimensions.get('window')

const CARD_WIDTH = (width - 44) / 2

interface Product {
    id: string,
    title: string,
    description: string,
    price: number,
    image: string,
    isNew?: boolean,
    category: string
}



export default function DashboardScreen() {
    const navigation = useNavigation()
    const router = useRouter()
    const { profile } = useDrawer()
    const {
        categories,
        selectedCategoryId,
        setSelectedCategoryId,
        products,
        searchQuery,
        setSearchQuery,
        isLoadingCategories,
        IsLoadingProduct
    }=useCreateProduct()
    

    const openMenu = () => {
        navigation.dispatch(DrawerActions.openDrawer)
    }


    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <TouchableOpacity style={{ padding: 15 }} onPress={openMenu}>
                    <Ionicons name="menu-outline" size={30} color={"#005c3a"}></Ionicons>
                </TouchableOpacity>

                <Text style={styles.logoText}>ShopEase</Text>

                <TouchableOpacity
                    style={styles.profileContainer}
                    onPress={() => router.push("/(protected)/profile")}
                >
                    <Image
                        source={{ uri: profile.avatarUrl }}
                        style={styles.avatarImage}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} style={styles.searchIcon} />
                <TextInput
                    placeholder="search products"
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <View style={styles.categoriesWrapper}>
                {isLoadingCategories ? (
                    <ActivityIndicator color="#005c3a" size="small"></ActivityIndicator>
                ) : (
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={categories}
                        keyExtractor={(item) => (item.id===null ? "all": item.id.toString())}
                        contentContainerStyle={styles.categoriesList}
                        renderItem={({ item }) => {
                            const isSelected = selectedCategoryId=== item.id
                            return (
                                <TouchableOpacity 
                                onPressIn={()=>setSelectedCategoryId(item.id as number | null)}
                                style={[
                                    styles.categorieItem,
                                    isSelected && styles.categorieItemSelected
                                ]}
                                   
                                >
                                    <Text style={isSelected ? styles.categorieItemSelectedText : { color: "black" }}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                )}

            </View>

            {/**product card */}

            <FlatList
                data={products}
                keyExtractor={(item)=>item.id.toString()}
                numColumns={2}
                columnWrapperStyle={styles.gridRowSpace}
                contentContainerStyle={styles.producList}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.cardContainer}>
                        <View style={styles.imageWrapper}>

                            <Image
                                source={{ uri: item.imageUrl }}
                                style={styles.productImage}
                            />
                        </View>

                        <View style={styles.productInfo}>
                            <Text style={styles.productTitle}>{item.name}</Text>
                            <Text style={styles.productDescription}>{item.description}</Text>

                            <View style={styles.priceRow}>
                                <Text>${item.regularPrice.toFixed(2)}</Text>
                                <TouchableOpacity style={styles.carBtn}>
                                    <Ionicons name="cart-outline" size={16} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb"
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 14
    },
    logoText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#005c3a"
    },
    profileContainer: {
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,

    },
    avatarImage: {
        width: 40,
        height: 40
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginTop: 20,
        paddingHorizontal: 14,
        paddingVertical: 14,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 14
    },
    searchIcon: {
        marginRight: 10
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#1f2937",
        padding: 0
    },
    categoriesWrapper: {
        maxHeight: 50,
        marginBottom: 16
    },
    categoriesList: {
        paddingHorizontal: 16,
        alignItems: "center",

    },
    categorieItem: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        backgroundColor: "#e5e7eb",
        borderRadius: 24,
        marginRight: 10
    },
    categorieItemSelected: {
        backgroundColor: "#005c3a",
    },
    categorieItemSelectedText: {
        color: "#fff",
        fontWeight: "bold"
    },
    producList: {
        paddingHorizontal: 16,
        paddingBottom: 24
    },
    gridRowSpace: {
        justifyContent: "space-between"
    },
    cardContainer: {
        width: CARD_WIDTH,
        backgroundColor: "#fff",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2
    },
    imageWrapper: {
        width: "100%",
        height: 140,
        backgroundColor: "#f3f4f6",
        position: "relative"
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover"
    },
    productInfo: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#1f2937",
        marginBottom: 2
    },
    productDescription: {
        fontSize: 11,
        color: "#6b7280",
        marginBottom: 8
    },
    newBadget: {
        position: "absolute",
        top: 10,
        left: 10,
        backgroundColor: "#005c3a",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6
    },
    newBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "bold"
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    carBtn: {
        backgroundColor: "#00b074",
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 15
    }

})