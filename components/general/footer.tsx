'use client'

import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react"
import { motion } from "framer-motion"

function Footer() {
  return (
    <footer className="bg-background py-12 border-t border-muted-foreground/10">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="mb-8 rounded-full bg-primary/10 p-4"
          >
            <img src="/logo.png" alt="Logo" className="h-32 md:h-40" />
          </motion.div>

          <nav className="mb-8 flex flex-wrap justify-center gap-6 text-sm font-medium">
            {["Home", "About", "Services", "Products", "Contact"].map((label, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.05, color: "#6366f1" }}
                transition={{ duration: 0.2 }}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {label}
              </motion.a>
            ))}
          </nav>

          <motion.div
            className="mb-8 flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <motion.div key={i} whileHover={{ scale: 1.1 }}>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Icon className="h-4 w-4" />
                  <span className="sr-only">{Icon.name}</span>
                </Button>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mb-8 w-full max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              © 2025 CurveFit Studio. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}

export { Footer }
