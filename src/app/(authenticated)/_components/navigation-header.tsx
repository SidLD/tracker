'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { DropdownMenuContent, DropdownMenuLabel } from '@radix-ui/react-dropdown-menu'
import { CircleUser, Home, Settings, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const links = [
    { to: "/dashboard", label: "Dashboard" , icon: <Home />},
    { to: "/user", label: "User" , icon: <User />},
    { to: "/setting", label: "Setting" , icon: <Settings />},
  ]

const NavigationHeader = () => {
  const pathname = usePathname()
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
            {links.map((link, index) => {
              return <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.to}
                    className={`${pathname == link.to ? 'bg-gray-200' : ''} flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8`}
                  > 
                    {link.icon}
                    <span className="sr-only uppercase">{link.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.label}</TooltipContent>
              </Tooltip>
            })}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <DropdownMenu >
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
      </aside>
  )
}

export default NavigationHeader