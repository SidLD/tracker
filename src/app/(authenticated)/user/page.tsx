'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Cloud,
  File,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Pencil,
  Plus,
  PlusCircle,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EducationalTitles, type User } from '@/lib/types/user'
import { Separator } from '@/components/ui/separator'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { type StatusType, type Status } from '@/lib/types/status'
import { type Location } from '@/lib/types/location'
import { addDays, format, subDays } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { type History as historyType } from '@/lib/types/history'
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import _axios from '@/lib/axios'
import { useToast } from '@/hooks/use-toast'
import { HistoryContext } from '@/lib/context'
import { History } from './_components/history'

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  firstName: z.string().min(3, 'Min 3'),
  middleName: z.string().optional(),
  lastName: z.string().min(3, 'Min 3'),
  status: z.string(),
})


const itemsPerPage = 10; 

const Page = () => {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      firstName:"",
      middleName:"",
      lastName:"",
      status: ""
    },
  })
  const [selectUser, setSelectUser] = useState<User | null>(null)
  const [status, setStatus] = useState<Status[]>([]);
  const [location, setLocation] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([])
   
  const [filters, setFilters] = useState({
    title: '',
    statustype: '',
    destination: '',
    search: ''
  });

  const onCreateUser = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log(data)
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
            description : `Successfully Updated User ${data.firstName } ${data.lastName}`
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

  const getLocation = async () => {
    try {
      const response = await fetch('/api/location', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setLocation(await response.json() as Location[])
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const getStatus = async () => {
    try {
      const response = await fetch('/api/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json() as Status[];
      setStatus(data)
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const today = new Date();
  const defaultStartDate = subDays(today, 30);
  const [date, setDate] = React.useState<DateRange | undefined | any>({
    from: defaultStartDate,
    to: today,
  });

  const handleSelect = async (user: User) => {
    setSelectUser(user)
  }

  const handleUpdate = async () => {
    if(selectUser){
      form.setValue('id', selectUser.id)
      form.setValue('title', selectUser.title)
      form.setValue('firstName', selectUser.firstName)
      form.setValue('middleName', selectUser.middleName)
      form.setValue('lastName', selectUser.lastName)
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
                  <FormLabel>Position/Designation</FormLabel>
                  <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select..." {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {EducationalTitles.filter(et => et != 'All').map((title:string) => <SelectItem key={title} value={title}>{title}</SelectItem>)}
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
                      <Input placeholder="Input First Name" {...field} />
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
                      <Input placeholder="Input Middle Name" {...field} />
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
                      <Input placeholder="Input Last Name" {...field} />
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5"/>
                  </FormItem>
              )}
            />

          <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                  <FormItem className=" relative my-5">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                  <Select
                      {...field}
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status... "/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {status.map((status, index) => {
                          return  <SelectItem key={index} value={`${status.id.toString()}`}>{status.name}</SelectItem>
                        })}
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


  const onDeleteUser = async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: selectUser?.id})
      });
      await getUsers()
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
          description : "Succesfully Delete User"
        })
      }
    } catch (error) {
      console.log(error)
    }
  }


  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(users.length / itemsPerPage);

  const filteredUsers = (users: User[]) => {
    const { title, search, statustype, destination } = filters;

    return users.filter(user => {
        const latestRecord = user?.record?.[0] ?? null;
        let destinationMatch = true
        let statusMatch = true
        let titleMatch = true
        let nameMatch = true;
       
        if(statustype != 'All' && statustype != ''){
           statusMatch = user.statustype.name === statustype;
        }

        if(destination != 'All' && destination != '') {
          destinationMatch = latestRecord?.location.name === destination;
        }

        if(title != 'All' && title != ''){
          titleMatch = user.title === title;
        }

        if(search != ''){
          nameMatch =  user.firstName.toLowerCase().includes(search?.toLowerCase()) || 
              user.lastName.toLowerCase().includes(search?.toLowerCase());
        }
        return destinationMatch && statusMatch && titleMatch && nameMatch;
    });
  };

  const paginatedUsers = filteredUsers(users).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const init = async (): Promise<void> => {
      await Promise.all([
        getUsers(),
        getLocation(),
        getStatus()
      ]);
    };
    void init().catch()
  }, [])

  return (
  <main className="grid grid-cols-1 px-2">
      <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4" >
        <CardHeader className="flex flex-row items-start bg-muted/50">
          <div className="grid gap-0.5">
            <CardTitle className="group flex items-center gap-2 just text-lg">
              Details
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className='w-5 mx-1 p-0' onClick={() => {handleUpdate()}} disabled={!selectUser}>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className='w-5 mx-1 p-0' disabled={!selectUser}>
                    <Trash2 className='' />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                  </DialogHeader>
                    <p>Confirm Delete?</p>
                    <Button variant={'destructive'} onClick={() => {onDeleteUser()}}>Confirm</Button>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-2  text-sm">
                <div>
                  <div className='grid grid-cols-2'>
                      <Label>Position/Designation</Label>
                      {selectUser?.title}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>First Name</Label>
                      {selectUser?.firstName}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Middle Name</Label>
                      {selectUser?.middleName}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Last Name</Label>
                      {selectUser?.lastName}
                  </div>
                  <div className='grid grid-cols-2'>
                      <Label>Latest Status</Label>
                      {selectUser?.record && selectUser?.record[0]?.statustype?.name}
                  </div>

                </div>
        </CardContent>
      </Card>
    <Separator className='my-2' />
    <div className='grid gap-2 grid-cols-1 lg:grid-cols-3'>
    <div className="">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                <div className='flex justify-between'>
                  <p>Overview</p>
                  <div>
                  <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => {
                  setSelectUser(null)
                  form.resetField('id')
                  form.resetField('firstName')
                  form.resetField('middleName')
                  form.resetField('lastName')
                  form.resetField('title')
                  form.resetField('status')
                }}>
                <File className="h-3.5 w-3.5 mr-2" />
                <span>New User</span></Button>
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
              </CardDescription>
              
            </CardHeader>
            <CardContent>
              <div className="ml-auto grid grid-cols-2 items-center gap-2">
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button className='ml-2' variant="outline">Location</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Location - Destination</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setFilters({ ...filters, destination: '' })}>
                          <span>All</span>
                        </DropdownMenuItem>
                        {location.map((loc: Location, index: number) => (
                          <DropdownMenuSub key={index}>
                            <DropdownMenuSubTrigger>
                              <span>{loc.name}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {loc.destinations?.map((des, index) => (
                                  <DropdownMenuItem key={index} onClick={() => setFilters({ ...filters, destination: des.name })}>
                                    <span>{des.name}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setFilters({ ...filters, destination: '' })}>Clear</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className='ml-2' variant="outline">Status</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Status - Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setFilters({ ...filters, statustype: '' })}>
                          <span>All</span>
                        </DropdownMenuItem>
                        {status.map((status: Status, index: number) => (
                          <DropdownMenuSub key={index}>
                            <DropdownMenuSubTrigger>
                              <span>{status.name}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                {status.statusCategory?.map((cat, index) => (
                                  <DropdownMenuItem key={index} onClick={() => setFilters({ ...filters, statustype: cat.name })}>
                                    <span>{cat.name}</span>
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                          </DropdownMenuSub>
                        ))}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button onClick={() => setFilters({ ...filters, statustype: '' })}>Clear</Button>
                  <div className='ml-2 col-span-2'>
                    <Input 
                      placeholder='Search...'   
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })} 
                    />
                  </div>
                </div>
              <Separator className='my-2' />
            <Table>
        <TableHeader>
          <TableRow>
            {/* <TableHead className="hidden sm:table-cell">
              Position/Designation
            </TableHead> */}
            <TableHead className="hidden sm:table-cell">
              Name
            </TableHead>
            <TableHead>Field</TableHead>
            {/* <TableHead>Status</TableHead>
            <TableHead>Location</TableHead> */}
            <TableHead className="hidden md:table-cell">Last Update</TableHead>
            <TableHead>Select</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedUsers.map((user, index) => (
            <TableRow key={index} className="bg-accent">
              {/* <TableCell>
                <div className="font-medium">{user.title}</div>
              </TableCell> */}
              <TableCell className="hidden sm:table-cell">
                <div className="font-medium">{user.firstName} {user.lastName}</div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <div className="font-medium">{user?.statustype?.name}</div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(user.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button onClick={() =>{ handleSelect(user)}}>Select</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="pagination-controls flex justify-between items-center mt-4">
        <button 
          onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Next
        </button>
      </div>
              
          </CardContent>
          </Card>
    </div>
    <div className='col-span-2'>
        <HistoryContext.Provider value={{selectUser, status}}> 
          <History />
        </HistoryContext.Provider>
    </div>
    </div>
  </main>
  )
}

export default Page;
