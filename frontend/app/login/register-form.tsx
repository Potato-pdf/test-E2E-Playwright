"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

interface RegisterFormProps {
  onToggleLogin?: () => void
}

export function RegisterForm({ onToggleLogin }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register attempt:", { name, email, password, confirmPassword })
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-light text-white uppercase tracking-wider">
            Nombre
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 text-white placeholder:text-white/50 focus:border-white focus:ring-0 focus-visible:ring-0"
            required
          />
        </div>

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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-light text-white uppercase tracking-wider">
            Confirmar Contraseña
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-transparent border-0 border-b border-white/30 rounded-none px-0 py-3 pr-10 text-white placeholder:text-white/50 focus:border-white focus:ring-0 focus-visible:ring-0"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-3 text-white/50 hover:text-white transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="pt-6">
          <Button
            type="submit"
            className="w-full bg-transparent border border-white text-white hover:bg-white hover:text-black transition-all duration-300 font-light tracking-wide uppercase text-sm py-3"
          >
            Crear Cuenta
          </Button>
        </div>
      </form>

      <div className="text-center space-y-4">
        <div className="w-8 h-px bg-white/30 mx-auto"></div>
        <p className="text-sm text-white/60 font-light">
          ¿Ya tienes cuenta?{" "}
          <button onClick={onToggleLogin} className="text-white hover:underline transition-colors">
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  )
}
