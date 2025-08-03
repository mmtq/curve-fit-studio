'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { Menu } from "lucide-react"

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "/theory", label: "Theory" },
  { href: "/team", label: "Team" },
]

export default function NavBar() {
  return (
    <header className="border-b px-4 md:px-6 bg-background">
      <div className="flex h-16 items-center justify-between">
        {/* Left: Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary">
            CurveFit Studio
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-4">
            {navigationLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: CTA + Mobile Menu */}
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <a href="#">Get Started</a>
          </Button>

          {/* Mobile Menu */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-40 p-2 md:hidden">
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
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
