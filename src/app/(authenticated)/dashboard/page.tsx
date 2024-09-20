'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CreditCard, Users2, ChevronLeft, ChevronRight, CalendarIcon, MapPinIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { addDays, format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { HistoryContext } from "@/lib/context";
import { History } from "./_components/history";
import { Graph } from "./_components/graph";
import _axios from '@/lib/axios';

interface Location {
  id: number;
  name: string;
  location: {
    id: number;
    name: string;
  };
}

interface TravelRequest {
  id: string;
  userId: string;
  dateFrom: string;
  dateTo: string;
  purpose: string;
  fundSource: string | null;
  documentTracker: string;
  createdAt: string;
  updatedAt: string;
  locations: Location[];
  user: {
    id: string;
    name: string | null;
  };
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  record?: Array<{ statustype?: { name: string } }>;
}

interface Status {
  id: string;
  name: string;
}

const itemsPerPage = 10;

const Page: React.FC = () => {
  const [selectUser, setSelectUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status[]>([]);
  const [location, setLocation] = useState<Location[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [history, setHistory] = useState<TravelRequest[]>([]);
  const [sortColumn, setSortColumn] = useState<keyof TravelRequest>('dateFrom');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: Date | null; to: Date | null }>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [analysis, setAnalysis] = useState<{ userCount: number; locationCount: number }>({
    userCount: 0,
    locationCount: 0
  });

  const travelRequests: TravelRequest[] = [
    {
      "id": "cm18t8vyr000di8nt5n06f26r",
      "userId": "cm18m2eza00012z2l4dp3l2ko",
      "dateFrom": "2024-08-20T04:47:12.447Z",
      "dateTo": "2024-09-19T04:47:12.447Z",
      "purpose": "asdasdasd",
      "fundSource": null,
      "documentTracker": "asdasdsadsa",
      "createdAt": "2024-09-19T04:47:25.395Z",
      "updatedAt": "2024-09-19T04:47:25.395Z",
      "locations": [
        {
          "id": 2,
          "name": "Oquendo 3",
          "location": {
            "id": 2,
            "name": "CALBAYOG 2"
          }
        }
      ],
      "user": {
        "id": "cm18m2eza00012z2l4dp3l2ko",
        "name": "John Doe"
      }
    },
    {
      "id": "cm18t52sj000bi8ntqdngje28",
      "userId": "cm18m2eza00012z2l4dp3l2ko",
      "dateFrom": "2024-08-31T16:00:00.000Z",
      "dateTo": "2024-09-11T16:00:00.000Z",
      "purpose": "test",
      "fundSource": null,
      "documentTracker": "asdsad",
      "createdAt": "2024-09-19T04:44:27.548Z",
      "updatedAt": "2024-09-19T06:03:55.538Z",
      "locations": [
        {
          "id": 1,
          "name": "DESTINATION 6",
          "location": {
            "id": 1,
            "name": "CALBAYOG 1"
          }
        },
        {
          "id": 2,
          "name": "Oquendo 3",
          "location": {
            "id": 2,
            "name": "CALBAYOG 2"
          }
        }
      ],
      "user": {
        "id": "cm18m2eza00012z2l4dp3l2ko",
        "name": "Jane Smith"
      }
    }
  ];

  const handleSort = (column: keyof TravelRequest) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const filteredAndSortedRequests = useMemo(() => {
    return travelRequests
      .filter(request => {
        const matchesSearch = 
          request.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.documentTracker.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          request.locations.some(loc => 
            loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.location.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
        const matchesUser = !selectedUser || request.user.id === selectedUser;
        const matchesLocation = !selectedLocation || request.locations.some(loc => 
          loc.id.toString() === selectedLocation || loc.location.id.toString() === selectedLocation
        );
        const matchesDateRange = 
          (!dateRange.from || new Date(request.dateFrom) >= dateRange.from) &&
          (!dateRange.to || new Date(request.dateTo) <= dateRange.to);
        
        return matchesSearch && matchesUser && matchesLocation && matchesDateRange;
      })
      .sort((a:any, b:any) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [travelRequests, searchTerm, selectedUser, selectedLocation, dateRange, sortColumn, sortDirection]);

  const paginatedRequests = filteredAndSortedRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedRequests.length / itemsPerPage);

  const uniqueUsers = Array.from(new Set(travelRequests.map(req => req.user.id)));
  const uniqueLocations = Array.from(new Set(travelRequests.flatMap(req => 
    req.locations.map(loc => loc.location.id)
  )));

  const getUsers = async () => {
    try {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getLocation = async () => {
    try {
      const response = await fetch('/api/location');
      if (!response.ok) throw new Error('Failed to fetch locations');
      setLocation(await response.json());
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const getStatus = async () => {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Failed to fetch statuses');
      setStatus(await response.json());
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  const getHistory = async () => {
    try {
      if (selectUser?.id) {
        const response = await _axios.get('/api/history', {
          params: { userId: selectUser.id }
        });
        setHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const getAnalysis = async () => {
    try {
      const response = await _axios.get('/api/analysis');
      setAnalysis(response.data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([
        getUsers(),
        getLocation(),
        getStatus(),
        getAnalysis(),
      ]);
    };
    init().catch(err => console.error(err));
  }, []);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="container mx-auto p-4 col-span-2">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredAndSortedRequests.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earliest Travel Date</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatDate(filteredAndSortedRequests.reduce((min, req) => req.dateFrom < min ? req.dateFrom : min, filteredAndSortedRequests[0]?.dateFrom || ''))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Destinations</CardTitle>
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(filteredAndSortedRequests.flatMap(req => req.locations.map(loc => loc.location.name))).size}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters and Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* <Select value={selectedUser || ''} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Select User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Users</SelectItem>
                  {uniqueUsers.map(userId => (
                    <SelectItem key={userId} value={userId}>
                      {travelRequests.find(req => req.user.id === userId)?.user.name || userId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
              {/* <Select value={selectedLocation || ''} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Locations</SelectItem>
                  {uniqueLocations.map(locId => (
                    <SelectItem key={locId} value={locId.toString()}>
                      {travelRequests.find(req => req.locations.some(loc => loc.location.id === locId))?.locations[0].location.name || locId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select> */}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Travel Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]" onClick={() => handleSort('dateFrom')}>Date From</TableHead>
                  <TableHead className="w-[100px]" onClick={() => handleSort('dateTo')}>Date To</TableHead>
                  <TableHead onClick={() => handleSort('purpose')}>Purpose</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead className="w-[100px]" onClick={() => handleSort('documentTracker')}>Document Tracker</TableHead>
                  <TableHead onClick={() => handleSort('userId')}>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>{formatDate(request.dateFrom)}</TableCell>
                    <TableCell>{formatDate(request.dateTo)}</TableCell>
                    <TableCell>{request.purpose}</TableCell>
                    <TableCell>
                      {request.locations.map((location) => (
                        <Badge key={location.id} variant="secondary" className="mr-1 mb-1">
                          {location.name} ({location.location.name})
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell>{request.documentTracker}</TableCell>
                    <TableCell>{request.user.name || request.userId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div >
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-start bg-muted/50">
            <div className="grid gap-0.5">
              <CardTitle className="group flex items-center gap-2 text-lg">
                User Detail
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
        <Card className="overflow-hidden">
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