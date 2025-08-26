"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  onToggleRegister?: () => void
}

export function LoginForm({ onToggleRegister }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login attempt:", { email, password })
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-light text-white uppercase tracking-wider">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white placeholder:text-white/50 focus:border-white focus:ring-0 focus-visible:ring-0"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-light text-white uppercase tracking-wider">
            Contraseña
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 pr-10 text-white placeholder:text-white/50 focus:border-white focus:ring-0 focus-visible:ring-0"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-3 text-white/50 hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-light tracking-wide uppercase text-sm py-3"
          >
            Iniciar Sesión
          </Button>
        </div>
      </form>

      <div className="text-center space-y-4">
        <a href="#" className="text-sm text-white/60 hover:text-white transition-colors font-light">
          ¿Olvidaste tu contraseña?
        </a>
        <div className="w-8 h-px bg-white/30 mx-auto"></div>
        <p className="text-sm text-white/60 font-light">
          ¿No tienes cuenta?{" "}
          <button onClick={onToggleRegister} className="text-white hover:underline transition-colors">
            Regístrate
          </button>
        </p>
      </div>
    </div>
  )
}
