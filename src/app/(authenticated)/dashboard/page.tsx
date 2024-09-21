'use client'

import { useState, useMemo, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { Graph } from './_components/graph'
import _axios from '@/lib/axios'

interface Destination {
  name: string
  id: number
}

interface Location {
  name: string
  destinations: Destination[]
}

interface TravelRecord {
  id: string
  userId: string
  dateFrom: string
  dateTo: string
  purpose: string
  fundSource: string | null
  documentTracker: string
  createdAt: string
  updatedAt: string
  user: {
    firstName: string
    lastName: string
    statustype: {
      name: string
      id: number
    }
    title: string
  }
  locations: {
    location: Location
  }[]
}

const ITEMS_PER_PAGE = 10

function Dropdown({ options, value, onChange, placeholder }: {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" className="w-[180px] justify-between">
          {value || placeholder}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="w-[180px] bg-white rounded-md shadow-lg p-1">
        <DropdownMenu.Item 
          className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded"
          onSelect={() => onChange('')}
        >
          All
        </DropdownMenu.Item>
        {options.map((option) => (
          <DropdownMenu.Item 
            key={option} 
            className="px-2 py-1 text-sm cursor-pointer hover:bg-gray-100 rounded"
            onSelect={() => onChange(option)}
          >
            {option}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default function TravelRecordsTable() {
  const [records, setRecords] = useState<TravelRecord[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [purposeFilter, setPurposeFilter] = useState('')
  const [documentTrackerFilter, setDocumentTrackerFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchRecords = async () => {
      setIsLoading(true)
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const formattedMonth = `${year}-${month}`;
  
        const { data } = await _axios.get('/api/adminRecords', {
          params: {
            month: formattedMonth
          }
        });
        setRecords(data)
      } catch (error) {
        console.error('Error fetching records:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecords()
  }, [])

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const locationMatch = record.locations.some(loc => 
        loc.location.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      const userMatch = `${record.user.firstName} ${record.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      const statusMatch = statusFilter ? record.user.statustype.name === statusFilter : true
      const locationFilterMatch = locationFilter ? record.locations.some(loc => loc.location.name === locationFilter) : true
      const purposeMatch = purposeFilter ? record.purpose.toLowerCase().includes(purposeFilter.toLowerCase()) : true
      const documentTrackerMatch = documentTrackerFilter ? record.documentTracker.toLowerCase().includes(documentTrackerFilter.toLowerCase()) : true

      return (locationMatch || userMatch) && statusMatch && locationFilterMatch && purposeMatch && documentTrackerMatch
    })
  }, [records, searchTerm, statusFilter, locationFilter, purposeFilter, documentTrackerFilter])

  const pageCount = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE)
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const uniqueStatuses = Array.from(new Set(records.map(record => record.user.statustype.name)))
  const uniqueLocations = Array.from(new Set(records.flatMap(record => record.locations.map(loc => loc.location.name))))
  const uniquePurposes = Array.from(new Set(records.map(record => record.purpose)))

  const totalTravels = records.length
  const activeTravels = records.filter(record => new Date(record.dateTo) >= new Date()).length
  const completedTravels = records.filter(record => new Date(record.dateTo) < new Date()).length
  const uniqueDestinations = new Set(records.flatMap(record => record.locations.flatMap(loc => loc.location.destinations.map(dest => dest.name)))).size

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className='grid grid-cols-3'>
        <div className="space-y-6 col-span-2 px-2">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Travels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTravels}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Travels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeTravels}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed Travels</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedTravels}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Unique Destinations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueDestinations}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Input
                placeholder="Search location or user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Dropdown
                options={uniqueStatuses}
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder="Filter by status"
              />
              <Dropdown
                options={uniqueLocations}
                value={locationFilter}
                onChange={setLocationFilter}
                placeholder="Filter by location"
              />
              <Dropdown
                options={uniquePurposes}
                value={purposeFilter}
                onChange={setPurposeFilter}
                placeholder="Filter by purpose"
              />
              <Input
                placeholder="Filter by document tracker..."
                value={documentTrackerFilter}
                onChange={(e) => setDocumentTrackerFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Locations</TableHead>
                  <TableHead>Date From</TableHead>
                  <TableHead>Date To</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Document Tracker</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{`${record.user.firstName} ${record.user.lastName}`}</TableCell>
                    <TableCell>{record.user.title}</TableCell>
                    <TableCell>{record.user.statustype.name}</TableCell>
                    <TableCell>
                      {record.locations.map(loc => loc.location.name).join(', ')}
                    </TableCell>
                    <TableCell>{new Date(record.dateFrom).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(record.dateTo).toLocaleDateString()}</TableCell>
                    <TableCell>{record.purpose}</TableCell>
                    <TableCell>{record.documentTracker}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex items-center justify-between">
              <div>
                Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredRecords.length)} of {filteredRecords.length} records
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div>Page {currentPage} of {pageCount}</div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(page => Math.min(pageCount, page + 1))}
                  disabled={currentPage === pageCount}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className='col-span-1'>
          <Graph />
        </div>
    </main>
  )
}