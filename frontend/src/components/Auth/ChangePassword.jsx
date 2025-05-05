import React from "react"
import { Button } from "@/components/ui/button"
import { Input as TextInput } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from "lucide-react"
import { PasswordInput } from "@/components/ui/password-input"

import { changePassword } from "@/services/authService"

 
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { useToast } from "@/hooks/use-toast"

export function ChangePassword() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [passwordStrength, setPasswordStrength] = React.useState(0)
  const [passwordFeedback, setPasswordFeedback] = React.useState("")
  const [error, setError] = React.useState("")
  const [message, setMessage] = React.useState("")

  const { toast } = useToast()

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    return minLength && hasNumber && hasLetter
  }

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[a-zA-Z]/.test(password)) strength += 1
    if (/[!@#$%^&*]/.test(password)) strength += 1
    setPasswordStrength(strength * 25)

    if (strength <2) setPasswordFeedback("Weak")
    else if (strength < 3) setPasswordFeedback("Medium")
    else setPasswordFeedback("Strong")
  }

  const handleSubmit = async (e) => {

    e.preventDefault()
    setError("")
    setMessage("")


 

    if (!validatePassword(newPassword)) {
      setError("Password must be at least 8 characters long and contain at least 1 number and 1 letter.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.")
      return
    }

    try {
      // Replace with your actual api call
      const response = await changePassword(currentPassword, newPassword, confirmPassword)
      console.log(response)
      setMessage(response.message || "Password changed successfully!")
      toast({
        title: "Password",
        description: "Password changed successfully!",
      })
    } catch (error) {
      if (error.error) setError(error.error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="currentPassword">Current Password</Label>
              <PasswordInput
                id="currentPassword"
            
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="newPassword">New Password</Label>
              <PasswordInput
                id="newPassword"
                className="dark:bg-gray-900"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value)
                  checkPasswordStrength(e.target.value)
                }}
              />
              <Progress value={passwordStrength} className="w-full h-2" />
              <div className="flex items-center mt-1">
                {passwordFeedback === "Strong" ? (
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                )}
                <span className="text-sm">{passwordFeedback}</span>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <PasswordInput
                id="confirmPassword"
           
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <CardFooter className="flex justify-end">
          <Button type="submit">Change Password</Button>
      </CardFooter>
         
          {error &&<Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>}
          {message && <p className="mt-4 text-green-500">{message}</p>}
        </form>
      </CardContent>
      
    </Card>
  )
}


