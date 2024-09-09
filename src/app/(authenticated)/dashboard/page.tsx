'use client'
import {
  CreditCard,
  ListFilter,
  Users2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import React, { useEffect, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight
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
import { type Role } from '@/lib/types/role'
import { EducationalTitles, type User } from '@/lib/types/user'
import { Separator } from '@/components/ui/separator'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { type Status } from '@/lib/types/status'
import { type Location } from '@/lib/types/location'
import { type History as historyType } from '@/lib/types/history'

import _axios from '@/lib/axios'
import { History } from "./_components/history"
import { HistoryContext } from "@/lib/context"
import { Graph } from "./_components/graph"

const Page = () => {
  const [selectUser, setSelectUser] = useState<User | null>(null)
  const [roles, setRoles] = useState<Role[]>([]);
  const [status, setStatus] = useState<Status[]>([]);
  const [location, setLocation] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([])
  const [history, setHistory] = useState<historyType[]>([])
 
  const [filters, setFilters] = useState({
    title: '',
    statustype: '',
    destination: '',
    search: ''
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const filteredUsers = () => {
    return users.filter(user => {
      let titleMatch, statusMatch, destinationMatch, nameMatch = false;
      const latestRecord = user?.record?.[0] ?? null
      titleMatch = filters.title ? user.title === filters.title : true;
      if(filters.title == 'All'){
        titleMatch = true
      }
      if(latestRecord){
        statusMatch = latestRecord.statustype?.name ? latestRecord.statustype?.name === filters.statustype : true;
        if(filters.statustype == 'All'){
          statusMatch = true
        }

        destinationMatch = latestRecord.destination?.name ? latestRecord.destination?.name === filters.destination : true;
        if(filters.statustype == 'All'){
          statusMatch = true
        }

        nameMatch = filters.search ? 
        (user.firstName.toLowerCase().includes(filters.search.toLowerCase()) || 
         user.lastName.toLowerCase().includes(filters.search.toLowerCase())) : 
        true;
  
      }
      return titleMatch && statusMatch && nameMatch && destinationMatch && users;
    })
  };

  const getUsers = async () => {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json() as User[];
    setUsers(data)
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

      setLocation(await response.json())
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
      setStatus(await response.json())
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const handleSelect = async (user: User) => {
    setSelectUser(user)
  }

  const getHistory = async () => {
    try {
      if(selectUser?.id){
        const response = await _axios.get('/api/history', {
          params: {
            userId: selectUser.id
          }
        });
      setHistory(response.data)
      }
    } catch (error) {
      console.log('err', error)
    }
  }

  useEffect(() => {
    const init = async (): Promise<void> => {
      await Promise.all([
        getUsers(),
        getLocation(),
        getStatus(),
      ]);
    };
    void init().catch()
  }, [])

  return (
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
        <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
          <Tabs defaultValue="week">
          <div className="grid gap-4 grid-cols-2">
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                User
              </CardTitle>
              <Users2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
              </p>
            </CardContent>
          </Card>
          <Card x-chunk="dashboard-00-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Location
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
              </p>
            </CardContent>
          </Card>
        </div>
            <TabsContent value="week">
              <Card x-chunk="dashboard-05-chunk-3">
                <CardHeader className="px-7">
                  <CardTitle>Dashboard</CardTitle>
                  <CardDescription>
                    Overview
                  </CardDescription>
                  
              <div className="ml-auto flex items-center gap-2">
                <Input placeholder='Search...'   onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
                {/* <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filtered: </span>
                      <p>{filters.destination.length > 10 ? filters.destination.substring(0,10) + '...' : filters.destination}</p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {filters.z.map((role : Role, index: number) => {
                        return  <DropdownMenuCheckboxItem
                        key={index}
                        checked={filters.role ===  role.name}
                        onCheckedChange={() => handleFilterChange('role', role.name)}
                      >
                        {role.name}
                      </DropdownMenuCheckboxItem>
                      })}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 gap-1 text-sm"
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only">Filtered: </span>
                      <p>{filters.title.length > 15 ? filters.title.substring(0,15) + '...' : filters.title}</p>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {EducationalTitles.map((title: string, index: number) => {
                        return  <DropdownMenuCheckboxItem
                        key={index}
                        checked={filters.title ===  title}
                        onCheckedChange={() => handleFilterChange('title', title)}
                      >
                        {title}
                      </DropdownMenuCheckboxItem>
                      })}
                    </DropdownMenuContent>
                </DropdownMenu> */}
              </div>
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
                        <TableHead className="">
                          Status
                        </TableHead>
                        <TableHead className="">
                          Location
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Last Update</TableHead>
                        <TableHead className="">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                    {filteredUsers().map((user, index) => (
                          <TableRow key={index} className="bg-accent">
                            <TableCell>
                              <div className="font-medium">{user.title}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge className="text-xs" variant="secondary">
                                {user?.record?.[0]?.statustype?.name ?? ''}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge className="text-xs" variant="secondary">
                                {user?.record?.[0]?.destination?.name ?? ''}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                            {new Date(user.updatedAt).toString()}
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
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  History
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              <HistoryContext.Provider value={{user: selectUser, status, location, getHistory, history}}> 
                <History />
              </HistoryContext.Provider>
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
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
          <Separator className="my-5" />
          <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
            <CardHeader className="flex flex-row items-start bg-muted/50">
              <div className="grid gap-0.5">
                <CardTitle className="group flex items-center gap-2 text-lg">
                  Calendar
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 text-sm">
                <Graph />
            </CardContent>
            <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
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
