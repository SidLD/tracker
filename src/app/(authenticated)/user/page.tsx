'use client'

import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  File,
  Pencil,
  Trash2,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EducationalTitles, User as UserType } from '@/lib/types/user'
import { Separator } from '@/components/ui/separator'
import { Status } from '@/lib/types/status'
import { Location, Destination } from '@/lib/types/location'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  firstName: z.string().min(3, 'Min 3'),
  middleName: z.string().optional(),
  lastName: z.string().min(3, 'Min 3'),
  status: z.string(),
})

type FormValues = z.infer<typeof formSchema>

const itemsPerPage = 10

export default function UserManagement() {
  const { toast } = useToast()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      firstName: "",
      middleName: "",
      lastName: "",
      status: "",
    },
  })
  const [selectUser, setSelectUser] = useState<UserType | null>(null)
  const [status, setStatus] = useState<Status[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
   
  const [filters, setFilters] = useState({
    title: '',
    statustype: '',
    search: ''
  })

  const onCreateUser = async (data: FormValues) => {
    try {
      const method = selectUser ? 'PUT' : 'POST'
      const response = await fetch('/api/user', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: `Invalid Credentials or User ${selectUser ? 'Does Not Exist' : 'Already Exists'}`
        })
      } else {
        toast({
          variant: "default",
          title: "Success",
          description: `Successfully ${selectUser ? 'Updated' : 'Created'} User ${data.firstName} ${data.lastName}`
        })
        await getUsers()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getUsers = async () => {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setUsers(await response.json() as UserType[])
  }

  const getLocations = async () => {
    try {
      const response = await fetch('/api/location', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const locationData = await response.json() as Location[]
      setLocations(locationData)
      
      const allDestinations = locationData.flatMap(location => 
        location.destinations?.map(dest => ({...dest, locationName: location.name})) || []
      )
      setDestinations(allDestinations)
    } catch (error) {
      console.error("Error fetching locations:", error)
    }
  }

  const getStatus = async () => {
    try {
      const response = await fetch('/api/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json() as Status[]
      setStatus(data)
    } catch (error) {
      console.error("Error fetching status:", error)
    }
  }

  const handleSelect = (user: UserType) => {
    setSelectUser(user)
  }

  const handleUpdate = () => {
    if(selectUser){
      form.setValue('id', selectUser.id)
      form.setValue('title', selectUser.title || '')
      form.setValue('firstName', selectUser.firstName)
      form.setValue('middleName', selectUser.middleName || '')
      form.setValue('lastName', selectUser.lastName)
      if(selectUser.statustype.id){
        form.setValue('status', selectUser.statustype?.id.toString() || '')
      }
    }
  }

  const makeForm = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCreateUser)} className="space-y-4">
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input {...field} type='hidden'/>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position/Designation</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {EducationalTitles.filter(et => et != 'All').map((title:string) => (
                        <SelectItem key={title} value={title}>{title}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Input First Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Middle Name</FormLabel>
                <FormControl>
                  <Input placeholder="Input Middle Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Input Last Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {status.map((status) => (
                        <SelectItem key={status.id} value={status.id.toString()}>{status.name}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className="w-full">Confirm</Button>
        </form>
      </Form>
    )
  }

  const onDeleteUser = async () => {
    try {
      if (!selectUser) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No user selected for deletion"
        })
        return
      }
      const response = await fetch('/api/user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({id: selectUser.id})
      })
      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid Credentials or User Does Not Exist"
        })
      } else {
        toast({
          variant: "default",
          title: "Success",
          description: "Successfully Deleted User"
        })
        setSelectUser(null)
        await getUsers()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(users.length / itemsPerPage)

  const filteredUsers = users.filter(user => {
    const { title, search, statustype } = filters
    const latestRecord = user.record?.[0]
    let statusMatch = true
    let titleMatch = true
    let nameMatch = true
    
    if (statustype && statustype !== 'All') {
      statusMatch = user.statustype?.name === statustype
    }

    if (title && title !== 'All') {
      titleMatch = user.title === title
    }

    if (search) {
      nameMatch = user.firstName.toLowerCase().includes(search.toLowerCase()) || 
                user.lastName.toLowerCase().includes(search.toLowerCase())
    }

    return statusMatch && titleMatch && nameMatch
  })

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    const init = async (): Promise<void> => {
      await Promise.all([
        getUsers(),
        getLocations(),
        getStatus()
      ])
    }
    void init()
  }, [])

  return (
    <main className="grid grid-cols-3 gap-4 p-4">
      <Card className="col-span-2">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>User Management</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" onClick={() => {
                  setSelectUser(null)
                  form.reset()
                }}>
                  <File className="h-4 w-4 mr-2" />
                  <span>New User</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>New User</DialogTitle>
                </DialogHeader>
                {makeForm()}
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Status</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setFilters({ ...filters, 
                    statustype: '' })}>
                      <span>All</span>
                    </DropdownMenuItem>
                    {status.map((s) => (
                      <DropdownMenuItem key={s.id} onClick={() => setFilters({ ...filters, statustype: s.name })}>
                        <span>{s.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Input 
                placeholder='Search...'   
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full md:w-auto" 
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Position/Designation</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className={selectUser?.id === user.id ? "bg-muted" : ""}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName} ${user.lastName}`} />
                          <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{`${user.firstName} ${user.lastName}`}</div>
                          <div className="text-sm text-muted-foreground">{user.title || 'N/A'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.title || 'N/A'}</TableCell>
                    <TableCell>{user.statustype?.name || 'N/A'}</TableCell>
                    <TableCell>{user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" onClick={() => handleSelect(user)}>Select</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between">
              <Button 
                onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button 
                onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            User Details
            {selectUser && (
              <div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" onClick={handleUpdate}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>
                    {makeForm()}
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 ml-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this user?</p>
                    <Button variant="destructive" onClick={onDeleteUser}>Confirm Delete</Button>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectUser ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectUser.firstName} ${selectUser.lastName}`} />
                  <AvatarFallback>{selectUser.firstName[0]}{selectUser.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold">{`${selectUser.firstName} ${selectUser.lastName}`}</h2>
                  <p className="text-muted-foreground">{selectUser.title || 'N/A'}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  <p>{selectUser.firstName}</p>
                </div>
                <div>
                  <Label>Middle Name</Label>
                  <p>{selectUser.middleName || 'N/A'}</p>
                </div>
                <div>
                  <Label>Last Name</Label>
                  <p>{selectUser.lastName}</p>
                </div>
                <div>
                  <Label>Latest Status</Label>
                  <p>{selectUser.statustype?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label>Latest Destination</Label>
                  <p>{selectUser.record?.[0]?.location?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p>{selectUser.updatedAt ? new Date(selectUser.updatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
              <User className="h-16 w-16 mb-4" />
              <p>Select a user to view details</p>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}