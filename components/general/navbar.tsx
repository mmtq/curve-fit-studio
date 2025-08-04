'use client'

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/#features", label: "Features" },
  { href: "/theory", label: "Theory" },
  { href: "/team", label: "Team" },
]

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6 shadow-sm">
      <div className="flex h-16 items-center justify-between">
        {/* Logo + Desktop Nav */}
        <div className="flex items-center gap-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary"
            >
              <img src="/logo.png" className="h-30" alt="" />
            </Link>
          </motion.div>

          <nav className="hidden md:flex gap-4">
            {navigationLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* CTA + Mobile Menu */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/get-started">Get Started</Link>
          </Button>

          {/* Mobile Menu Button */}
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </PopoverTrigger>

            <AnimatePresence>
              {menuOpen && (
                <PopoverContent
                  align="end"
                  className="w-40 p-2 md:hidden bg-popover border rounded-md shadow-md"
                  asChild
                >
                  <div>
                    <NavigationMenu className="w-full">
                      <NavigationMenuList className="flex-col gap-1">
                        {navigationLinks.map((link, i) => (
                          <NavigationMenuItem key={i}>
                            <NavigationMenuLink
                              asChild
                              className="block w-full text-sm px-2 py-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                            >
                              <Link href={link.href}>{link.label}</Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenu>
                  </div>
                </PopoverContent>
              )}
            </AnimatePresence>
          </Popover>
        </div>
      </div>
    </header>
  )
}
