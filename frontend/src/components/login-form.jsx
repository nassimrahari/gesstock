
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "./ui/password-input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { login } from "@/services/authService" // Assurez-vous que le chemin est correct
import { Link } from "react-router-dom"

import { useAuth } from "@/contexts/AuthContext"

import { useNavigate } from "react-router-dom"

export function LoginForm({
  className,
  ...props
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const {userAuth} =useAuth();
  const navigate= useNavigate();


  useEffect(() => {
    
    if(userAuth)
    navigate('/')
  }, [userAuth]);

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await login(email, password)
      // Redirection ou autre action après la connexion
      window.location.href = '/' // Par exemple, redirige l'utilisateur vers la page d'accueil
    } catch (err) {
      console.log(err)
      setError("Login Failed") // Gérer l'erreur
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid gap-6">
              {error && <p className="text-red-500">{error}</p>} {/* Affichage des erreurs */}
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email or Username</Label>
                  <Input
                    id="email"zaaa
                    type="text"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>

                    <Link
                   to="/password/reset"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>

                  </div>
                  <PasswordInput 
                    id="password" 
               
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} 
                  />
              
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* Uncomment if needed */}
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  )
}