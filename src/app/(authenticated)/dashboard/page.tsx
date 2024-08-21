import React from 'react'
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const Page = () => {
  return (
  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">

      <Tabs defaultValue="week">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="year">Year</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 gap-1 text-sm"
                >
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Fulfilled
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Declined
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Refunded
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1 text-sm"
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
          </div>
        </div>
        <TabsContent value="week">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Overview
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden sm:table-cell">
                      Title
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Name
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Role
                    </TableHead>
                    <TableHead className=" md:table-cell">Last Update</TableHead>
                    <TableHead className="">Select</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className="bg-accent">
                    <TableCell>
                      <div className="font-medium">Liam Johnson</div>
                      <div className="hidden text-sm text-muted-foreground md:inline">
                        liam@example.com
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      Sale
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="text-xs" variant="secondary">
                        Fulfilled
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      2023-06-23
                    </TableCell>
                    <TableCell className="">
                      <Button>Select</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    <div>
      <Card
        className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
      >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Details
              <Button
                size="icon"
                variant="outline"
                className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <Copy className="h-3 w-3" />
                <span className="sr-only">Copy Order ID</span>
              </Button>
            </CardTitle>
            <CardDescription>Date: November 23, 2023</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
          <div className="grid gap-3">
            <div className="font-semibold">Date: 08/21/2024</div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Status
                </dt>
                <dd>****</dd>
                
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Location
                </dt>
                <dd>****</dd>
              </div>
            </dl>
          </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
          <Pagination className="ml-auto mr-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span className="sr-only">Previous Order</span>
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button size="icon" variant="outline" className="h-6 w-6">
                  <ChevronRight className="h-3.5 w-3.5" />
                  <span className="sr-only">Next Order</span>
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      </Card>
    </div>
  </main>
  )
}

export default Page;
