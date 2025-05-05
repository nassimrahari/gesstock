import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/services/authService"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")


  const navigate= useNavigate()
  const [errors, setErrors] = useState({})
  const { toast } = useToast()

  const checkPasswordStrength = (password) => {
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/\d/.test(password)) strength += 1
    if (/[a-zA-Z]/.test(password)) strength += 1
    if (/[!@#$%^&*]/.test(password)) strength += 1
    setPasswordStrength(strength * 25)

    if (strength < 2) setPasswordFeedback("Weak")
    else if (strength < 3) setPasswordFeedback("Medium")
    else setPasswordFeedback("Strong")
  }

  const validateForm = () => {
    const newErrors = {}
    if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters long"
    } else if (!/^(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
      newErrors.newPassword = "Password must contain at least 1 letter and 1 number"
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const urlParams = new URLSearchParams(window.location.search)
      const token = urlParams.get("token")
      if (!token) {
        throw new Error("Reset token is missing")
      }
      const response = await resetPassword(token, newPassword)
      toast({
        title: "Success",
        description: response.message || "Password reset successful. You can now log in with your new password.",
        variant: "default",
      })
      setNewPassword("")
      setConfirmPassword("")
      navigate('/login')
    } catch (error) {
  
      toast({
        title: "Error",
        description: error.error || "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>Enter your new password to reset your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <PasswordInput
              id="newPassword"
              required
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value)
                checkPasswordStrength(e.target.value)
              }}
            />
            <Progress value={passwordStrength} className="w-full h-2 mt-2" />
            <div className="flex items-center mt-1">
              {passwordFeedback === "Strong" ? (
                <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
              )}
              <span className="text-sm">{passwordFeedback}</span>
            </div>
            {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
          <Button type="submit" className="w-full">
            Reset Password
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

