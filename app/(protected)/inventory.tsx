import { SafeAreaView } from "react-native-safe-area-context"
import { KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, View, Text, Alert, ActivityIndicator } from "react-native"
import Drawer from "expo-router/drawer"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ScrollView, TextInput } from "react-native-gesture-handler"
import { useAuth } from "../src/context/AuthContext"
import { useState } from "react"
import { CategoryService } from "../src/categories/services/category.service"
export default function InventoryScreen() {
    const router = useRouter()
    const { token } = useAuth()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    const handleSaveCategory = async () => {
        if (!name.trim()) {
            Alert.alert("campo requerido, por favor ingrese el nombre de la categoria")
            return
        }
        if (!description.trim()) {
            Alert.alert("campo requerido, ingrese la descripcion")
        }
        if (!token) {
            Alert.alert("error de session, no se encontro el token")
        }
        setIsLoading(true)
        try {
            const newCategory = await CategoryService.createCategory(name, description, token)
            Alert.alert(
                "Categoría creada",
                `La categoría ${newCategory.name} se guardó con éxito.`,
                [
                    {
                        text: "Aceptar",
                        onPress: () => {
                            setName("");
                            setDescription("");
                            router.replace("/(protected)/dashboard");
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert("Error" + error.message || "no se puedo guardar la categoria")
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <Drawer.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            router.replace("/(protected)/dashboard")
                        }}
                    >
                        <Ionicons name="arrow-back-outline" size={26} />
                    </TouchableOpacity>
                    <View style={styles.titleWrapper}>
                        <Text style={styles.headerTitle}>ADMIN PORTAL</Text>
                        <Text style={styles.headerSubTitle}>Nueva Categoria</Text>
                    </View>
                    <View style={styles.boxIconContainer}>
                        <Ionicons name="archive-outline" size={22} />
                    </View>
                </View>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.logoText}>
                        Ingresa los datos esenciales para catalogar los productos en el inventario
                    </Text>

                    <View style={styles.formCard}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre de la categoria</Text>
                            <TextInput
                                placeholder="Ej. Dulceria"
                                style={styles.textInput}
                                value={name}
                                onChangeText={setName}
                                editable={!isLoading}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripcion de la categoria</Text>
                            <TextInput
                                placeholder="describe los productos que engloban eseta categoria"
                                multiline
                                numberOfLines={5}
                                textAlignVertical="top"
                                style={styles.textAreaInput}
                                value={description}
                                onChangeText={setDescription}
                                editable={!isLoading}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.btnSave}
                            onPress={handleSaveCategory}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <>

                                    <Text style={styles.btnSaveText}>Guardar Categoria</Text>
                                </>

                            )}

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.btnCancel}>

                            <Text style={styles.btnCancelText}>cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#faf9fb"
    },
    titleWrapper: {
        flex: 1,
        marginLeft: 16
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#112827",
        letterSpacing: 0.8
    },
    headerSubTitle: {
        fontSize: 10,
        fontWeight: "bold",
        color: "#006c47",
        marginTop: 2

    },
    boxIconContainer: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "#e5e7eb",
        alignItems: "center",
        justifyContent: "center"
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16
    },
    logoText: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
        marginBottom: 24
    },
    formCard: {
        backgroundColor: "#fff",
        padding: 24,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 15,
        elevation: 2
    },
    inputGroup: {
        marginBottom: 10
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: "bold",
        color: "#374151",
        marginBottom: 8
    },
    textInput: {
        height: 48,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        paddingHorizontal: 16,
        fontSize: 14,
        borderRadius: 10
    },
    textAreaInput: {
        height: 120,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 14
    },
    btnSave: {
        backgroundColor: "#006c47",
        height: 48,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 16
    },
    checkIcon: {
        marginRight: 8
    },
    btnSaveText: {
        color: "#fff",
        fontSize: 15
    },
    btnCancel: {
        height: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    btnCancelText: {
        fontSize: 14,
        color: "#6b7280",
        fontWeight: "500"
    }
})