import { Button } from '@/components/ui/button'
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { type History as historyType } from '@/lib/types/history'
import _axios from '@/lib/axios'
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { type DateRange } from 'react-day-picker'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import {  format, subDays } from 'date-fns';
import { Card, CardHeader, CardTitle, CardFooter, CardContent } from '@/components/ui/card'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { HistoryContext, HistoryContextType } from '@/lib/context'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Destination, Location } from '@/lib/types/location'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table'

export const historySchema = z.object({
  id: z.string().optional(),
  location: z.array(z.object({
    id: z.number(),
    name: z.string()
  })),
  date: z.date(),
  purpose: z.string(),
  documentTracker: z.string()
})

export type HistoryEntry = z.infer<typeof historySchema>

export const History = () => {
  const {selectUser} = useContext<HistoryContextType>(HistoryContext)  
  const [selectedHistory, setSelectedHistory] = useState<historyType | null>(null);
  const [history, setHistory] = useState<historyType[]>([])
  const [selectdDestination, setSelectedDestination] = useState<Destination[]>([]);
  const [destinationOptions, setDestinationOptions] = useState<Destination[]>([]);
  const {toast} = useToast()
  const today = new Date();
  const defaultStartDate = subDays(today, 30);
  const [date, setDate] = React.useState<DateRange | undefined | any>({
    from: defaultStartDate,
    to: today,
  });
  const [open, setOpen] = useState(false);  

  const form = useForm<HistoryEntry>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      location: [],
      date: new Date(),
      purpose: '',
      documentTracker: ''
    },
  })

  const fetchDestination = async () => {
    try {
      try {
          await _axios.get('/api/destination', {
            params: {
              location: 0
            }
          }).then(({data}) => {
            setDestinationOptions(data as Destination[])
          })
      } catch (error) { /* empty */ }
    } catch (error) { /* empty */ }
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

  const handleDelete = async (id:string | undefined) => {
    try {
      if(!id){
        toast({
          variant: 'destructive',
          title: "Error",
          description: "No Selected History"
        })
      }else{
        await _axios.delete(`/api/history/`, {
         data: {id}
        })
        toast({
          variant: 'default',
          title: "Success",
          description: "Delete History"
        })
        await getHistory()
      }
    } catch (error) {
      toast({
        variant: 'default',
        title: "Success",
        description: "Delete History"
      })
    }
  }

  const handleSelect = (data:historyType) => {
    setSelectedHistory(data);
  }

  // Add location to form
  const handleAddLocation = (location:Destination) => {
    if (!selectdDestination.some((des) => des.id === location.id)) {
      setSelectedDestination([...selectdDestination, location]);
    }
  };

  const onUpdateHistory = async (data:any) => {
    try {
      if(selectedHistory){
        const response = await _axios.put('/api/history', {
          id: selectedHistory.id,
          location: data.location,
          dateFrom: date?.from,
          dateTo: date?.to,
          purpose: data.purpose,
          documentTracker : data.documentTracker,
          user: selectUser.id
        })
        if(response.status == 200){
          await getHistory()
          toast({
            title: "Success Create"
          })
        }
      }else{
        const response = await _axios.post('/api/history', {
          location: data.location,
          dateFrom: date?.from,
          dateTo: date?.to,
          purpose: data.purpose,
          documentTracker : data.documentTracker,
          user: selectUser.id
        })
        if(response.status == 200){
          await getHistory()
          setSelectedHistory(null)
          toast({
            title: "Success Update"
          })
        }
       
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onSubmit = async (data: HistoryEntry) => {
    try {
      const payload = {...data, dateFrom: date?.from, dateTo: date?.to, date: undefined, location: selectdDestination, user: selectUser}
        await onUpdateHistory(payload);
        form.reset()
    } catch (err) {
      console.log(err)
    } 
  }

  const handleClear = () => {
    try {
      setDate(defaultStartDate)
      setSelectedDestination([])
      form.reset()
    } catch (error) {
      console.log(error)
      { /* No Comment */}
    }
  }

  const makeHistoryForm = () => {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormItem>
            <FormLabel>Select a location</FormLabel>
            <FormControl>
              <Select
                onValueChange={(value) => {
                  const data = destinationOptions.find(
                    (loc: Destination) => loc.id === Number(value)
                  );
                  if (data) handleAddLocation(data);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a location" />
                </SelectTrigger>
                <SelectContent>
                  {destinationOptions.map((loc: Destination) => (
                    <SelectItem key={loc.id} value={loc.id as unknown as string}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          </FormItem>
  
          {/* Display Selected Locations as part of the form */}
          {selectdDestination.length > 0 && (
            <div>
              <h3 className="my-4 text-lg font-semibold">Selected Locations</h3>
              {selectdDestination.map((location, index) => (
                <div key={location.id} className="my-2">
                  <p>
                    <strong>Location {index + 1}:</strong> {location.name}
                  </p>
                  <Input
                    type="hidden"
                    name={`location.${index}.id`}
                    value={location.id as number}
                  />
                  <Input
                    type="hidden"
                    name={`location.${index}.name`}
                    value={location.name}
                  />
                </div>
              ))}
            </div>
          )}
  
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="relative my-5">
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant="outline"
                          className={`w-[300px] justify-start text-left font-normal ${
                            !date && "text-muted-foreground"
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date?.from ? (
                            date.to ? (
                              <>
                                {format(date.from, "LLL dd, y")} -{" "}
                                {format(date.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(date.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from || new Date()} // Use current date if date.from is null
                        selected={date || { from: null, to: null }} // Provide a fallback object if date is null
                        onSelect={setDate}
                        {...field}
                      />
                      </PopoverContent>
                    </Popover>
                  </div>
                </FormControl>
                <FormMessage className="absolute -bottom-5" />
              </FormItem>
            )}
          />

          <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                      <FormItem className=" relative">
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                          <Textarea placeholder="Input Name" {...field} />
                      </FormControl>
                      <FormMessage className=" absolute -bottom-5"/>
                      </FormItem>
                  )}
                  />

            <FormField
                  control={form.control}
                  name="documentTracker"
                  render={({ field }) => (
                      <FormItem className=" relative">
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                      <Input  
                placeholder="Enter document tracker"
                {...field}
              />
                      </FormControl>
                      <FormMessage className=" absolute -bottom-5"/>
                      </FormItem>
                  )}
                  />

          <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-2'>
            <Button type='button' onClick={() =>  {handleClear()}} variant={'link'} className="mt-4">
              Clear
            </Button>
            <Button type="submit" className="mt-4">
              Submit
            </Button>
          </div>
        </form>
      </Form>
    );
  };

  useEffect(() => {
    const init = async (): Promise<void> => {
      await getHistory()
      await fetchDestination()
    }
    void init()
    
  }, [selectUser])

  useEffect(() => {
    if(selectedHistory){
      form.setValue('purpose', selectedHistory.purpose)
      form.setValue('documentTracker', selectedHistory.documentTracker)
      setDate({
        from: selectedHistory.dateFrom,
        to: selectedHistory.dateTo
      });
      const newLocations = selectedHistory.locations as any as Destination[]
      setSelectedDestination(newLocations)
      setOpen(true)
    }else{
      handleClear()
    }
  }, [selectedHistory])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDate, setFilterDate] = React.useState<DateRange | undefined | any>({
    from: defaultStartDate,
    to: today,
  });

  const filteredData = useMemo(() => {
   if(filterDate){
    return history.filter(entry => {
      const matchesSearch = 
        entry.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.documentTracker.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
   }else{
    return history;
   }

  }, [history, searchTerm, filterDate])

  return (
   <>
   <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4">
    <CardHeader className="flex flex-row items-start bg-muted/50">
      <div className="grid gap-0.5">
        <CardTitle className="group flex items-center gap-2 text-lg">
          History
        <Dialog open={open} onOpenChange={setOpen} >
          <DialogTrigger asChild>
            <Button variant="outline" disabled={!selectUser} onClick={() => {setOpen(!open)}}>+</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New History</DialogTitle>
            </DialogHeader>
            <DialogContent>
              {makeHistoryForm()}
              <DialogFooter className="sm:justify-start">
                  
                </DialogFooter>
            </DialogContent>
          </DialogContent>
        </Dialog>
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className='w-full'>
    <div className="space-y-4">
      <div className="flex space-x-4">
        <Input
          placeholder="Search purpose or document tracker"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date From</TableHead>
            <TableHead>Date To</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Document Tracker</TableHead>
            <TableHead>Locations</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((entry) => {
            return (
              <TableRow key={entry.id}>
                <TableCell>{format(new Date(entry.dateFrom), 'PPP')}</TableCell>
                <TableCell>{format(new Date(entry.dateTo), 'PPP')}</TableCell>
                <TableCell>{entry.purpose}</TableCell>
                <TableCell>{entry.documentTracker}</TableCell>
                <TableCell>{entry.locations.map((loc: { name: any }) => loc.name).join(', ')}</TableCell>
                <TableCell>
                  <Button onClick={() => {handleSelect(entry)}}>Select</Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
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
     
   </>
  )
}
