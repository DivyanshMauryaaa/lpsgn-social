import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import { Bookmark, Heart, Home, PersonStanding, User, UsersRound } from "lucide-react";
import Link from "next/link";

function AppSidebar() {
    return (
        <Sidebar>
            <SidebarHeader>

                <p className="p-8 text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">LPS Social</p>

            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <Link href={"/"}
                        className="p-3 font-[500] w-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:text-white rounded-lg transition-ease-in-out duration-100 flex items-center justify-center gap-3">
                        <Home />Home
                    </Link>


                    <Link href={"/saved"}
                        className="p-3 font-[500] w-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:text-white rounded-lg transition-ease-in-out duration-100 flex items-center justify-center gap-3">
                        <Bookmark />Saved
                    </Link>


                    <Link href={"/groups"}
                        className="p-3 font-[500] w-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:text-white rounded-lg transition-ease-in-out duration-100 flex items-center justify-center gap-3">
                        <UsersRound />Groups
                    </Link>



                    <Link href={"/people"}
                        className="p-3 font-[500] w-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:text-white rounded-lg transition-ease-in-out duration-100 flex items-center justify-center gap-3">
                        <PersonStanding />People
                    </Link>

                    <Link href={"/notifications"}
                        className="p-3 font-[500] w-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:text-white rounded-lg transition-ease-in-out duration-100 flex items-center justify-center gap-3">
                        <Heart />Alerts
                    </Link>

                    <Link href={"/profile"}
                        className="p-3 font-[500] w-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-800 hover:text-white rounded-lg transition-ease-in-out duration-100 flex items-center justify-center gap-3">
                        <User />Profle
                    </Link>


                </SidebarGroup>
                <SidebarGroup>

                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}

export default AppSidebar;