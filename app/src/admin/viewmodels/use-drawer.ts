import { useRouter } from "expo-router";
import { useState } from "react";
import { AdminProfile } from "../models/drawer.model";
import { DrawerItemOption } from "../models/drawer.model";

export function useDrawer(){
    const router= useRouter()

    const [profile]=useState<AdminProfile>({
       name: "admin user",
       role:"system managment",
       avatarUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vNaL97MalsRvvG1VDo7YRci5ugFHblh7HmI4LZgurVKB58FeMrsTIXk&s=10",
       version:"v4.4.4"
    })

    const navigationOptions:DrawerItemOption[]=[
        {name:"dashboard", label:"Dashboard", icon:"grid"},
        {name:"orders", label:"Orders", icon:"package"},
        {
            name:"inventory",
            label:"Inventory",
            icon:"archive",
            subItems:[
                {
                    name:"inventory",
                    label:"Category",
                    icon:"folder"
                },
                {
                    name:"create-product",
                    label:"Products",
                    icon:"file-text"
                },
                {
                    name:"create-service",
                    label:"Servicios",
                    icon:"tool"
                }
            ]
        }

    ]

    return {
        profile,
        navigationOptions
    }
}