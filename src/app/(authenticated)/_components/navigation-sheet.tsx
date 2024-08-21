'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import { CircleUser, Home, PanelLeft, Settings, User } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const links = [
    { to: "/dashboard", label: "Dashboard" , icon: <Home />},
    { to: "/user", label: "User" , icon: <User />},
    { to: "/setting", label: "Setting" , icon: <Settings />},
  ]

const NavigationSheet = () => {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {links.map((link, index) => {
            return <Link key={index}
              href={link.to}
              className={`${pathname == link.to ? 'bg-gray-200 rounded-lg' : ''} flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}>
              {link.icon}
              {link.label}
            </Link>
          })}
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button
            variant="outline"
            size="icon"
            className="overflow-hidden rounded-full"
            >
            <CircleUser 
            width={36}
            height={36}
            className="overflow-hidden "
            />
            </Button>
        </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className='w-20 p-2 bg-gray-300 rounded-lg'>
                <Link href="/logout" passHref>
                    <DropdownMenuItem>
                        Logout
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuContent>
        </DropdownMenu>
        </nav>
      </SheetContent>
    </Sheet>
  </header>
  )
}

export default NavigationSheet