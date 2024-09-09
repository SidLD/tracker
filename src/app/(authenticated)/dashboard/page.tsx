'use client';
import {
  CreditCard,
  Users2
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React, { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import { type Role } from '@/lib/types/role';
import { type User } from '@/lib/types/user';
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { type Status } from '@/lib/types/status';
import { type Location } from '@/lib/types/location';
import { type History as historyType } from '@/lib/types/history';

import _axios from '@/lib/axios';
import { History } from "./_components/history";
import { HistoryContext } from "@/lib/context";
import { Graph } from "./_components/graph";
import { number } from "zod";

const itemsPerPage = 10;

const Page = () => {
  const [selectUser, setSelectUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status[]>([]);
  const [location, setLocation] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<historyType[]>([]);

  const [analysis, setAnalysis] = useState<{
    userCount: number,
    locationCount: number
  }>({
    userCount: 0,
    locationCount: 0
  });

  const [filters, setFilters] = useState({
    title: '',
    statustype: '',
    destination: '',
    search: ''
  });

  const filteredUsers = (users: User[]) => {
    const { title, search, statustype, destination } = filters;

    return users.filter(user => {
        const latestRecord = user?.record?.[0] ?? null;
        let destinationMatch = true
        let statusMatch = true
        let titleMatch = true
        let nameMatch = true;
       
        if(statustype != 'All' && statustype != ''){
           statusMatch = latestRecord?.statustype?.name === statustype;
        }

        if(destination != 'All' && destination != '') {
          destinationMatch = latestRecord?.destination?.name === destination;
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
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredUsers(users).length / itemsPerPage);


  const paginatedUsers = filteredUsers(users).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getUsers = async () => {
    const response = await fetch('/api/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json() as User[];
    setUsers(data);
  };

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

      setLocation(await response.json());
    } catch (error) {
      console.error("Error fetching locations:", error);
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
      setStatus(await response.json());
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const handleSelect = async (user: User) => {
    setSelectUser(user);
  };

  const getHistory = async () => {
    try {
      if (selectUser?.id) {
        const response = await _axios.get('/api/history', {
          params: {
            userId: selectUser.id
          }
        });
        setHistory(response.data);
      }
    } catch (error) {
      console.log('Error fetching history:', error);
    }
  };

  const getAnalysis = async () => {
    try {
      const response = await _axios.get('/api/analysis');
        setAnalysis(response.data);
    } catch (error) {
      console.log('Error fetching history:', error);
    }
  };

  useEffect(() => {
    const init = async (): Promise<void> => {
      await Promise.all([
        getUsers(),
        getLocation(),
        getStatus(),
        getAnalysis(),
      ]);
    };
    void init().catch(err => {
      console.log(err);
    });
  }, []);

  useEffect(() => {
    console.log(filters);
  }, [filters]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
                <div className="text-2xl font-bold">+{analysis?.userCount}</div>
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
                <div className="text-2xl font-bold">+{analysis?.locationCount}</div>
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
                  <Input 
                    placeholder='Search...'   
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })} 
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className='ml-2' variant="outline">Location</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Location - Destination</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setFilters({ ...filters, destination: 'All' })}>
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
                        Field
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
                    {paginatedUsers.map((user, index) => (
                      <TableRow key={index} className="bg-accent">
                        <TableCell>
                          <div className="font-medium">{user.title}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="font-medium">{user.role.name}</div>
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
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-6 w-6"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Page</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button 
                        size="icon" 
                        variant="outline" 
                        className="h-6 w-6"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Page</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
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
            <HistoryContext.Provider value={{ user: selectUser, status, location, getHistory, history }}> 
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
  );
}

export default Page;
