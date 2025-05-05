import { Tag, Users, Box, DollarSign, LogOut, Home, ShoppingCart, User, List } from 'lucide-react'
import { Link } from 'react-router-dom'; // Importer Link


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
  
{ url: '/', title: ' DashBoard',icon:Home },{ url: '/suppliers', title: ' Supplier',icon:Users },
{ url: '/categorys', title: ' Category',icon:Tag },
{ url: '/products', title: ' Product',icon:Box },
{ url: '/purchases', title: ' Purchase',icon:ShoppingCart },
{ url: '/purchaselines', title: ' Purchase Line',icon:List },
{ url: '/clients', title: ' Client',icon:User },
{ url: '/sales', title: ' Sale',icon:DollarSign },
{ url: '/salelines', title: ' Sale Line',icon:ShoppingCart },
{ url: '/logout', title: ' Logout',icon:LogOut },
]



export function AppSidebar() {
  return (
    <Sidebar className="dark:bg-gray-800">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
          <p className="text-lg dark:text-white"> Application</p>

           
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
            <p className="m-t-5"></p>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                  <Link
                    to={item.url} // Utiliser Link pour naviguer
                    className="text-gray-800 dark:text-white  hover:text-blue-800 dark:hover:text-blue-200"
                  >
                         <item.icon />
                            <span>{item.title}</span>
                  </Link>
                   
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
