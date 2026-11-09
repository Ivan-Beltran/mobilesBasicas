import { API_URL } from "@/api/ApiClient"
import axios from "axios"
import { act } from "react"

export interface CategoryResponse{
    id:number
    name:string
    description?:string
    createdAt:string
    updatedAt:string
}

export const CategoryService={
    getCategories:async(token:string):Promise<CategoryResponse[]>=>{
        try{
            const authTokenHeader=token.startsWith("Bearer ")?token:`Bearer ${token}`
            const response= await axios.get<CategoryResponse[]>(
                `${API_URL}/categories`,
                {
                    headers:{
                        Authorization:authTokenHeader
                    }
                }
            )
            return response.data
            
        }catch(error){
            if(axios.isAxiosError(error)&& error.response){
                throw new Error(error.response.data?.message || "error to get categories")
            }
            throw new Error("server error")
        }
    },

    createCategory:async(
        name:string,
        description:string,
        token: string | null
    ): Promise<CategoryResponse>=>{
        try{
            const authTokenHeader=token?.startsWith("Bearer")?token :`Bearer ${token}`

            const response= await axios.post(
                `${API_URL}/categories/create`,
                {
                    name,
                    description
                },
                {
                    headers:{
                        Authorization:authTokenHeader,
                        "Content-Type":"application/json"
                    }
                }
            )
            console.log(response.data)
            return response.data

        }catch(error){
            if(axios.isAxiosError(error) && error.response){
                throw new Error(error.response.data?.message || "error to save category")
            }
            throw new Error("error al sevidor")
        }
    }
}