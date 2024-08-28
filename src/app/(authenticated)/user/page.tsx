'use client'
import React, { useEffect, useState } from 'react'
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
  Pencil,
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
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Role } from '@/lib/types/role'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { User } from '@/lib/types/user'
import { Separator } from '@/components/ui/separator'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'

const formSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(3, 'Min 3'),
  middleName: z.string().optional(),
  lastName: z.string().min(3, 'Min 3'),
  role: z.string(),
})


const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      firstName:"",
      middleName:"",
      lastName:"",
      role:"",
    },
  })

  console.log(form.formState.errors)
  const [selectUser, setSelectUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<Role[]>([]);

  const onCreateUser = async (data: z.infer<typeof formSchema>) => {
    console.log(data)
  }

  const getRoles = async () => {
    try {
      const response = await fetch('/api/role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setRoles(await response.json());
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getRoles()
  }, [])

  return (
  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <Form {...form}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <File className="h-3.5 w-3.5 mr-2" />
                    <span>New Data</span></Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>New User</DialogTitle>
                  </DialogHeader>
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                              <FormItem className=" relative">
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                  <Input placeholder="Input Title" {...field} />
                              </FormControl>
                              <FormMessage className=" absolute -bottom-5"/>
                              </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                              <FormItem className=" relative">
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Input Title" {...field} />
                              </FormControl>
                              <FormMessage className=" absolute -bottom-5"/>
                              </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="middleName"
                          render={({ field }) => (
                              <FormItem className=" relative">
                              <FormLabel>Middle Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Input Title" {...field} />
                              </FormControl>
                              <FormMessage className=" absolute -bottom-5"/>
                              </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                              <FormItem className=" relative">
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                  <Input placeholder="Input Title" {...field} />
                              </FormControl>
                              <FormMessage className=" absolute -bottom-5"/>
                              </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                              <FormItem className=" relative">
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                              <Select>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select Role" {...field} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {roles.map(role => <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>)}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage className=" absolute -bottom-5"/>
                              </FormItem>
                          )}
                        />
                        <DialogFooter>
                          <Button type='submit' onClick={() => onCreateUser}>Confirm</Button>
                        </DialogFooter>
                </DialogContent>
            </Form>
          </Dialog>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className='w-5 mx-1 p-0'>
                    <Pencil className='' />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                  </DialogHeader>
                    {/* <Form {...form}>
                        <form onSubmit={form.handleSubmit(onUpdateUser)}>
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem className=" relative">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Select Title" {...field} />
                                </FormControl>
                                <FormMessage className=" absolute -bottom-5"/>
                                </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem className=" relative">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Select Title" {...field} />
                                </FormControl>
                                <FormMessage className=" absolute -bottom-5"/>
                                </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                                <FormItem className=" relative">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Select Title" {...field} />
                                </FormControl>
                                <FormMessage className=" absolute -bottom-5"/>
                                </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem className=" relative">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Select Title" {...field} />
                                </FormControl>
                                <FormMessage className=" absolute -bottom-5"/>
                                </FormItem>
                            )}
                          />
                          <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                              <FormItem className=" relative">
                              <FormLabel>Role</FormLabel>
                              <FormControl>
                              <Select>
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select Role" {...field} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    {roles.map(role => <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>)}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                              </FormControl>
                              <FormMessage className=" absolute -bottom-5"/>
                              </FormItem>
                          )}
                        />
                        </form>
                    </Form> */}
                  <DialogFooter>
                    <Button type="submit">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>Date: November 23, 2023</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-1 gap-2 text-sm">
                <div>
                  <div className='grid grid-cols-2'>
                      <Label>Title</Label>
                      PhD
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>First Name</Label>
                      Liam
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Middle Name</Label>
                      
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Last Name</Label>
                      Johanson
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Role</Label>
                      Staff
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Current Status</Label>
                      Working in Division 2
                  </div>
                </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
        </CardFooter>
      </Card>
      <Separator className='my-2'/>
      <Card
        className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
      >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              History
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
            <div className="font-semibold flex justify-start items-center">
              <span>Date: 08/25/2024</span>
              <Button variant="ghost" className='w-4 mx-1 p-0'>
                <Pencil  />
              </Button>
            </div>
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
          <Separator className='my-5'/>
          <div className="grid gap-3">
            <div className="font-semibold flex justify-start items-center">
              <span>Date: 08/25/2024</span>
              <Button variant="ghost" className='w-4 mx-1 p-0'>
                <Pencil  />
              </Button>
            </div>
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
