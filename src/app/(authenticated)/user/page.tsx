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
import { api } from '@/trpc/react'
import { useToast } from '@/components/ui/use-toast'
import { History } from './_components/history'

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  firstName: z.string().min(3, 'Min 3'),
  middleName: z.string().optional(),
  lastName: z.string().min(3, 'Min 3'),
  role: z.string().min(1, 'Role is Required'),
})

const educationalTitles: string[] = [
  'Elementary School Teacher',
  'High School Teacher',
  'Special Education Teacher',
  'English Teacher',
  'Math Teacher',
  'Science Teacher',
  'History Teacher',
  'Art Teacher',
  'Music Teacher',
  'Physical Education Teacher',
  'Guidance Counselor',
  'Academic Advisor',
  'Principal',
  'Vice Principal',
  'Department Head',
  'Curriculum Coordinator',
  'Instructional Coach',
  'Teacher Assistant',
  'Educational Consultant',
  'School Social Worker',
  'School Psychologist',
  'Superintendent'
];


const Page = () => {
  const { toast } = useToast()
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
  const [selectUser, setSelectUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([])
 
  const onCreateUser = async (data: z.infer<typeof formSchema>) => {
    try {
      if(selectUser){
        const response = await fetch('/api/user', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          toast({
            variant:"destructive",
            title : "Error",
            description : "Invalid Credentials or User Does Not Exist"
          })
        }else{
          toast({
            variant:"default",
            title : "Success",
            description : `Successfully Created User ${data.firstName } ${data.lastName}`
          })
          await getUsers()
        }
      }else{
        const response = await fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
        if (!response.ok) {
          toast({
            variant:"destructive",
            title : "Error",
            description : "Invalid Credentials or User Already Exist"
          })
        }else{
          toast({
            variant:"default",
            title : "Success",
            description : `Successfully Created User ${data.firstName } ${data.lastName}`
          })
          await getUsers()
        }
      }
      
    } catch (error) {
      console.log(error)
    }
  }

  const getUsers = async () => {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    setUsers(await response.json() as User[])
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

  const handleSelect = async (user: User) => {
    setSelectUser(user)
  }

  const handleUpdate = async () => {
    if(selectUser){
      console.log(selectUser)
      form.setValue('id', selectUser.id)
      form.setValue('title', selectUser.title)
      form.setValue('firstName', selectUser.firstName)
      form.setValue('middleName', selectUser.middleName)
      form.setValue('lastName', selectUser.lastName)
      form.setValue('role', selectUser.role.id.toString())
    }
  }

  const makeForm = () => {
    return  <Form {...form}>
    <form onSubmit={form.handleSubmit(onCreateUser)}>
          <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                  <FormItem className="hidden">
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                      <Input placeholder="Input Title" {...field} type='hidden'/>
                  </FormControl>
                  </FormItem>
              )}
            />
           <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className=" relative my-5">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select Title" {...field} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {educationalTitles.map(title => <SelectItem key={title} value={title}>{title}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5"/>
                  </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                  <FormItem className=" relative my-5">
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
                  <FormItem className=" relative my-5">
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
                  <FormItem className=" relative my-5">
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
                  <FormItem className=" relative my-5">
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                  <Select   onValueChange={(value) => field.onChange(value)}
                  >
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
       <Button type='submit' onClick={() => onCreateUser}>Confirm</Button>
    </form>
  </Form>
  }

  useEffect(() => {
    getRoles(),
    getUsers()
  }, [])

  return (
  <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
      <Tabs defaultValue="week">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => {
                  setSelectUser(null)
                  form.resetField('id')
                  form.resetField('firstName')
                  form.resetField('middleName')
                  form.resetField('lastName')
                  form.resetField('role')
                  form.resetField('title')
                }}>
                <File className="h-3.5 w-3.5 mr-2" />
                <span>New Data</span></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New User</DialogTitle>
              </DialogHeader>
              {makeForm()}
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
                {users.map((user, index) => (
                      <TableRow key={index} className="bg-accent">
                        <TableCell>
                          <div className="font-medium">{user.title}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge className="text-xs" variant="secondary">
                            {user.role.name}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                        {new Date().toString()}
                        </TableCell>
                        <TableCell>
                          <Button onClick={() => handleSelect(user)}>Select</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    <div>
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4" >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 text-lg">
              Details
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className='w-5 mx-1 p-0' onClick={handleUpdate} disabled={!selectUser}>
                    <Pencil className='' />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                  </DialogHeader>
                  {makeForm()}
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
                      {selectUser && selectUser.title}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>First Name</Label>
                      {selectUser && selectUser.firstName}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Middle Name</Label>
                      {selectUser && selectUser.middleName}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Last Name</Label>
                      {selectUser && selectUser.lastName}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Role</Label>
                      {selectUser && selectUser.role.name}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Current Status</Label>
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
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
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
            <History />
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
