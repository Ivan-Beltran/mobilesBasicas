import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { ProductService } from "../service/product.service";
import { CategoryResponse, CategoryService } from "../../categories/services/category.service";
import { ProductItem } from "../models/product.model";

export function useCreateProduct() {
    const router = useRouter()
    const { token } = useAuth()

    const [name, setName] = useState("")
    const [categoryId, setCategoryId] = useState<null | number>(null)
    const [sku, setSku] = useState("")
    const [categories, setCategories] = useState<CategoryResponse[]>([])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isCategoriesShowModal, setIsCategoriesShowModal] = useState(false)
    const [description, setDescription] = useState("")
    const [regularPrice, setRegularPrice] = useState("")
    const [offerPrice, setOfferPrice] = useState("")
    const [initialStock, setInitialStock] = useState("")
    const [minStockAlert, setMinStockAlert] = useState("")
    const [IsLoadingProduct, setIsLoadingProduct] = useState(false)
    const [errorMessage, setErrorMessage] = useState<null | string>("")
    const [selectedCategoryName, setSelectedCategoryName] = useState("")
    const [selectedCategoryId,setSelectedCategoryId]=useState<number | null>(null)
    const [products,setProducts]=useState<ProductItem[]>([])
    const [searchQuery, setSearchQuery]=useState("")

    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const fetchProducts= useCallback(async()=>{
        if(!token) return

        setIsLoadingProduct(true)
        try{
            if(selectedCategoryId===null){
                const data=await ProductService.getProductByCategoryId(1,token)
                setProducts(data)
            }else{
                const data=await ProductService.getProductByCategoryId(Number(selectedCategoryId),String(token))
                setProducts(data)
            }
            
        }
        catch(error){
            console.log("error al traer los productos")
            setProducts([])
        }
        finally{
            setIsLoadingProduct(false)
        }
        
    },[token,selectedCategoryId])

    useEffect(()=>{
        fetchProducts()
    },[fetchProducts])

    const fetchCategories = async () => {
        if (!token) return
        setIsLoadingCategories(true)
        try {
            const data = await CategoryService.getCategories(token)
            setCategories(data)
        } catch (error: any) {
            console.log("error al cargar las categorias", error.message)
        }
        finally {
            setIsLoadingCategories(false)
        }
    }

    const submitProduct = async () => {
        if (!name.trim() || !sku.trim() || !regularPrice.trim() || !initialStock.trim()) {
            setErrorMessage("por favor completa datos obligatorios")
            return
        }
        if (!token) {
            setErrorMessage("session obligatoria")
            return
        }

        setErrorMessage(null)
        setIsLoadingProduct(true)

        try {
            const response=await ProductService.createProduct(
                {
                    name: name.trim(),
                    categoryId: Number(categoryId),
                    sku: sku.trim(),
                    description: description.trim(),
                    regularPrice: parseFloat(regularPrice),
                    offerPrice: offerPrice ? parseFloat(offerPrice) : undefined,
                    initialStock: parseInt(initialStock, 10),
                    minStockeAlert: minStockAlert ? parseInt(minStockAlert, 10) : 0
                },
                token
            )
            console.log(response)

            Alert.alert(
                "¡Producto creado!",
                "El producto fue agregado correctamente.",
                [
                    {
                        text: "Aceptar",
                        onPress: () => router.replace("/(protected)/dashboard")
                    }
                ]
            )
            
        } catch (error: any) {
            setErrorMessage(error.message)
        } finally {
            setIsLoadingProduct(false)
        }
    }

    const filteredProducts=useMemo(()=>{
        return products.filter((p)=>{
            const query=searchQuery.toLocaleLowerCase().trim()
            if(!query) return true

            return(
                p.name.toLocaleLowerCase().includes(query) ||
                p.description && p.description.toLocaleLowerCase().includes(query)
            )
        })
    }, [products,searchQuery])

    return {
        name,
        setName,
        categories,
        isLoadingCategories,
        isCategoriesShowModal,
        setIsCategoriesShowModal,
        categoryId,
        setCategoryId,
        sku,
        setSku,
        description,
        setDescription,
        regularPrice,
        setRegularPrice,
        offerPrice,
        setOfferPrice,
        initialStock,
        setInitialStock,
        minStockAlert,
        setMinStockAlert,
        IsLoadingProduct,
        errorMessage,
        submitProduct,
        selectedCategoryName,
        setSelectedCategoryName,
        products:filteredProducts,
        searchQuery,
        setSearchQuery,
        refreshProducts:fetchProducts,
        selectedCategoryId,
        setSelectedCategoryId
    }
}
