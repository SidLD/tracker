'use client'
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

const formSchema = z.object({
  title: z.string().optional(),
  firstName: z.string(),
  middleName: z.string(),
  lastName: z.string(),
  role: z.any(),
})

const Page = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      firstName:"",
    },
  })

  const onSubmit = (e: any) => {

  }

  return (
  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <File className="h-3.5 w-3.5 mr-2" />
                <span>New Data</span></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New User</DialogTitle>
              </DialogHeader>
                <Form {...form}>
                    <form onSubmit={onSubmit}>
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
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Select Title" {...field} />
                            </FormControl>
                            <FormMessage className=" absolute -bottom-5"/>
                            </FormItem>
                        )}
                      />
                    </form>
                </Form>
              <DialogFooter>
                <Button type="submit">Confirm</Button>
              </DialogFooter>
            </DialogContent>
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
                    <Form {...form}>
                        <form onSubmit={onSubmit}>
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
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Select Title" {...field} />
                                </FormControl>
                                <FormMessage className=" absolute -bottom-5"/>
                                </FormItem>
                            )}
                          />
                        </form>
                    </Form>
                  <DialogFooter>
                    <Button type="submit">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>Date: November 23, 2023</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 text-sm">
                <div className='grid grid-cols-2'>
                    <Label>Title</Label>
                    asd
                </div>
                <div className='grid grid-cols-2'>
                    <Label>First Name</Label>
                    asd
                </div>
                <div className='grid grid-cols-2'>
                    <Label>Middle Name</Label>
                    asd
                </div>
                <div className='grid grid-cols-2'>
                    <Label>Last Name</Label>
                    asd
                </div>
                <div className='grid grid-cols-2'>
                    <Label>Role</Label>
                    asd
                </div>
        </CardContent>
        <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
          <div className="text-xs text-muted-foreground">
            Updated <time dateTime="2023-11-23">November 23, 2023</time>
          </div>
        </CardFooter>
      </Card>
    </div>
  </main>
  )
}

export default Page;
