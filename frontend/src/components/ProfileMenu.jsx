import React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"
import { Link } from "react-router-dom"

export function ProfileMenu({ userAuth }) {
  if (!userAuth) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-auto px-2 rounded-full dark:bg-gray-700 dark:text-white bg-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          <div className="flex items-center  space-x-2">
            <div className="bg-gray-200 dark:bg-gray-600 p-1 rounded-full">
              <User className="h-5 w-5 text-gray-600 dark:text-gray-200" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium leading-none">{userAuth.username}</p>
              <p className="text-xs text-muted-foreground">{userAuth.email}</p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 dark:text-white dark:bg-gray-700" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm dark:text-white  font-medium leading-none">{userAuth.username}</p>
            <p className="text-xs text-muted-foreground">{userAuth.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
            <Link to="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
        <Link to="/password/change">Change Password</Link>
           
        </DropdownMenuItem>
      
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/logout">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

