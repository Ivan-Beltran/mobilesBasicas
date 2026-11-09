import { ViewToken } from "react-native";
import { CreateProductRequest, CreateProductResponse, ProductItem } from "../models/product.model";
import axios from "axios";
import { API_URL } from "@/api/ApiClient";

export const ProductService={
    createProduct: async(
        productRequest:CreateProductRequest,
        token: string
    ):Promise<CreateProductResponse>=>{
        try{
            const authTokenHeader=token?.startsWith("Bearer")?token :`Bearer ${token}`
            const response= await axios.post<CreateProductResponse>(
                `${API_URL}/products/create`,
                productRequest,
                {
                    headers:{
                        Authorization:authTokenHeader+"x",
                        "Content-Type":"application/json"
                    }
                }
            )
            return response.data
        }catch(error){
            if(axios.isAxiosError(error) && error.response){
                console.log("error response:", error.response.data)
                throw new Error(error.response.data?.message || "error to create product")
            }
            throw new Error("error al sevidor")
        }
    },

    getProductByCategoryId:async(
        CategoryId:number,
        token:string
    ):Promise<ProductItem[]>=>{
        try{
            const authTokenHeader=token.startsWith("Bearer ")? token:`Bearer ${token}`
            const response=await axios.get<ProductItem[]>(
            `${API_URL}/products/category/${CategoryId}`,
            {
                headers:{
                    Authorization:authTokenHeader+"x"
                }
            }
            )
            return response.data
        }catch(error){
             if(axios.isAxiosError(error) && error.response){
                console.log("error response:", error.response.data)
                throw new Error(error.response.data?.message || "error to get Category for products")
            }
            throw new Error("error al sevidor")
        }
    }
}