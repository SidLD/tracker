import { Button } from '@/components/ui/button'
import { ChevronRight, CreditCard } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import _axios from '@/lib/axios'
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type DateRange } from 'react-day-picker'
import { type Status } from '@/lib/types/status'
import { type Location } from '@/lib/types/location'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { HistoryContext, type HistoryContextType } from '@/lib/context'
import { type History as historyType } from '@/lib/types/history'


const historySchema = z.object({
  id: z.string().optional(),
  status: z.string(),
  location: z.string(),
  date: z.any(),
})

export const History = () => {
  const {user, location, status, getHistory, history} = useContext<HistoryContextType>(HistoryContext)  
  const [selectedHistory, setSelectedHistory] = useState<historyType | null>(null);
  const {toast} = useToast()
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 20), 
  })

  const historyForm = useForm<z.infer<typeof historySchema>>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      status: '',
      location: '',
    },
  })


  const handleDelete = async (id:string | undefined) => {
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
      await getHistory()
    }
  }

  const handleSelect = (data:historyType) => {
    setSelectedHistory(data);
  }

  const onUpdateHistory = async (data: z.infer<typeof historySchema>) => {
    try {
      if(selectedHistory){
          const response = await _axios.put('/api/history', {
            id: selectedHistory.id,
            location: data.location,
            status: data.status,
            dateFrom: date?.from,
            dateTo: date?.to
          })
          if(response.status == 200){
            await getHistory()
            setSelectedHistory(null)
          }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const makeHistoryForm = () => {
    return <Form {...historyForm}>
      <form onSubmit={historyForm.handleSubmit(onUpdateHistory)}>
            <FormField
              control={historyForm.control}
              name="id"
              render={({ field }) => (
                  <FormItem className="hidden">
                  <FormControl>
                      <Input placeholder="Input Title" {...field} type='hidden'/>
                  </FormControl>
                  </FormItem>
              )}
            />
            <FormField
              control={historyForm.control}
              name="location"
              render={({ field }) => (
                <FormItem className=" relative my-5">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select Title" {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {location?.map( (location:Location) => <SelectItem key={location.id} value={location.id.toString()}>{location.name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5"/>
                  </FormItem>
              )}
            />
            <FormField
              control={historyForm.control}
              name="status"
              render={({ field }) => (
                <FormItem className=" relative my-5">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                  <Select onValueChange={(value) => field.onChange(value)} value={field.value}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Select Title" {...field}/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {status.map((status: Status) => <SelectItem key={status.id} value={status.id.toString()}>{status.name}</SelectItem>)}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5"/>
                  </FormItem>
              )}
            />
            <FormField
              control={historyForm.control}
              name="date"
              render={({ field }) => (
                <FormItem className=" relative my-5">
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                  <div className={cn("grid gap-2")}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          id="date"
                          variant={"outline"}
                          className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                          )}
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
                          defaultMonth={date?.from}
                          selected={date}
                          onSelect={setDate}
                          numberOfMonths={2}
                          {...field}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5"/>
                  </FormItem>
              )}
            />

       <Button type='submit' onClick={() => onUpdateHistory}>Confirm</Button>
    </form>
  </Form>
  }

  useEffect(() => {
    const init = async (): Promise<void> => {
      await getHistory()
    }
    void init()
    
  }, [user])

  useEffect(() => {
    if(selectedHistory){
      historyForm.setValue('id', selectedHistory.id)
      historyForm.setValue('location', selectedHistory.location.id.toString())
      historyForm.setValue('status', selectedHistory.status.id.toString())
      setDate({
        from: selectedHistory.dateFrom,
        to: selectedHistory.dateTo
      });
    }else{
      historyForm.setValue('status', '')
      historyForm.setValue('location', '')
    }
  }, [selectedHistory])

  return (
   <>
      <div className="grid gap-3">
        {history?.map((data: historyType, index: number) => {
          return <div key={index}>
            <div className="font-semibold flex justify-between items-center">
              <span>{new Date(data.dateFrom).toDateString()}</span>
              <span><ChevronRight /></span>
              <span>{new Date(data.dateTo).toDateString()}</span>
            </div>
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Status
                </dt>
                <dd>{data.status.name}</dd>
                
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Location
                </dt>
                <dd>{data.location.name}</dd>
              </div>
            </dl>
          </div>
        })}
      </div>
   </>
  )
}
