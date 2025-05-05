import React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Moon, Sun } from "lucide-react"
import { ProfileMenu } from "./ProfileMenu"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const HeaderSite = ({ darkMode, setDarkMode }) => {
  const { userAuth } = useAuth()

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4">
        <Link to={'/'} className="" >
                Home
        </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <ProfileMenu userAuth={userAuth} />
        </div>
      </div>
    </header>
  )
}

export default HeaderSite

