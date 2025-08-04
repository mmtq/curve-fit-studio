'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-muted-foreground/10">
      <div className="container mx-auto px-4 md:px-6">
        <div
          className="flex flex-col items-center"
        >
          <div
            className="mb-8 rounded-full bg-primary/10 p-4"
          >
            <img src="/logo.png" alt="Logo" className="h-32 md:h-40" />
          </div>

          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
            {["Home", "About", "Services", "Products", "Contact"].map((label, i) => (
              <a
                key={i}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          <div
            className="mb-8 flex space-x-4"
          >
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <div key={i}>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{Icon.name}</span>
                </Button>
              </div>
            ))}
          </div>

          <div
            className="mb-8 w-full max-w-md"
          >
            <form className="flex space-x-2">
              <div className="flex-grow">
                <Label htmlFor="email" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  type="email"
                  className="rounded-full"
                />
              </div>
              <Button type="submit" className="rounded-full">
                Subscribe
              </Button>
            </form>
          </div>

          <div
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              © 2025 CurveFit Studio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
