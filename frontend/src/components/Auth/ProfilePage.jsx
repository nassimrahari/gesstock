import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

// Importing the new service services
import { fetchProfileDetails, updateProfileDetails } from "@/services/authService"
import { useAuth } from "@/contexts/AuthContext"

export function ProfilePage() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({ username: "", email: "" })
  const { toast } = useToast()

  const {setUserAuth} = useAuth()

  // Fetch user profile details on component mount
  useEffect(() => {
    const getProfileDetails = async () => {
      try {
        const profile = await fetchProfileDetails()
        setUser(profile)
        setFormData(profile) // Initialize form data with fetched profile
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch profile details.",
          variant: "destructive",
        })
      }
    }

    getProfileDetails()
  }, [toast])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }


  useEffect(() => {
    
        setUserAuth(user)
    
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await updateProfileDetails(formData)
      setUser(formData) // Update local user state
      setIsOpen(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return <div>Loading...</div> // Loading state while fetching profile
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto rounded-sm shadow-none dark:bg-gray-800">
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Username</Label>
              <p className="text-lg">{user.username}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-lg">{user.email}</p>
            </div>
          
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>Edit Profile</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <Button type="submit">Save Changes</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}