import { Button } from '@/components/ui/button'
import { ChevronRight, CreditCard, Pencil, Trash } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { type History as historyType } from '@/lib/types/history'
import _axios from '@/lib/axios'
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
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
import { StatusType, type Status } from '@/lib/types/status'
import { type Location } from '@/lib/types/location'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { HistoryContext, HistoryContextType } from '@/lib/context'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast'
import {  format, subDays } from 'date-fns';


const historySchema = z.object({
  id: z.string().optional(),
  statustype: z.string(),
  destination: z.string(),
  date: z.any(),

})

export const History = () => {
  const {user, location, status, getHistory, history} = useContext<HistoryContextType>(HistoryContext)  
  const [selectedHistory, setSelectedHistory] = useState<historyType | null>(null);
  const {toast} = useToast()
  const today = new Date();
  const defaultStartDate = subDays(today, 30);

  const [date, setDate] = React.useState<DateRange | undefined | any>({
    from: defaultStartDate,
    to: today,
  });

  const historyForm = useForm<z.infer<typeof historySchema>>({
    resolver: zodResolver(historySchema),
    defaultValues: {
      statustype: '',
      destination: '',
    },
  })

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

  const onUpdateHistory = async (data: z.infer<typeof historySchema>) => {
    try {
      if(selectedHistory){
          const response = await _axios.put('/api/history', {
            id: selectedHistory.id,
            location: parseInt(data.destination),
            status: parseInt( data.statustype),
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
              name="destination"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormItem className=" relative my-5">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className='ml-2' variant="outline">Select Here</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Location - Destination</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                            {location.map((loc: Location, index: number) => {
                              return <>
                                <DropdownMenuSub key={index}>
                                  <DropdownMenuSubTrigger>
                              <span>{loc.name}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                  {loc.destinations?.map((des, index2) => {
                                    return <DropdownMenuItem key={index2} onClick={() => {onChange(des.id?.toString())}} >
                                    <span>{des.name}</span>
                                  </DropdownMenuItem>
                                  })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        </>
                            })}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  </FormControl>
                  <FormMessage className=" absolute -bottom-5"/>
                  </FormItem>
              )}
            />
            <FormField
              control={historyForm.control}
              name="statustype"
              render={({ field: { onChange, onBlur, value } }) => (
                <FormItem className=" relative my-5">
                  <FormLabel>Status</FormLabel>
                  <FormControl >
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className='ml-5' variant="outline">Select Here</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                            {status.map((status: Status, index: number) => {
                              return <>
                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger key={index}>
                              <span>{status.name}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                              <DropdownMenuSubContent>
                                  {status.statusCategory?.map((des: StatusType, index: number) => {
                                    return <DropdownMenuItem key={index} onClick={() => {onChange(des.id?.toString())}}>
                                    <span>{des.name}</span>
                                  </DropdownMenuItem>
                                  })}
                              </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        </>
                            })}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
                  <FormLabel>Dates</FormLabel>
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
                          defaultMonth={date.from}
                          selected={date}
                          onSelect={setDate}
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
      const selectedDestination = selectedHistory?.destination?.id?.toString() ?? '';
      const selectedStatusType = selectedHistory?.statustype?.id?.toString() ?? '';
      historyForm.setValue('destination', selectedDestination)
      historyForm.setValue('statustype', selectedStatusType)
      setDate({
        from: selectedHistory.dateFrom,
        to: selectedHistory.dateTo
      });
    }else{
      historyForm.setValue('destination', '')
      historyForm.setValue('statustype', '')
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
              <span>
              <Dialog >
              <DialogTrigger asChild>
                <Button variant="ghost" className='w-4 ml-2 mx-1 p-0' onClick={() => handleSelect(data)}>
                  <Pencil  />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update History</DialogTitle>
                </DialogHeader>
                {makeHistoryForm()}
            </DialogContent>
              </Dialog>
              </span>
          <div className='w-[100%]'>
            <Dialog>
              <DialogTrigger asChild>
              <Button className='float-right w-8 h-8 p-0 bg-red-500'>
                <Trash  />
              </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm Delete</DialogTitle>
                </DialogHeader>
                <Button className=' bg-red-500' onClick={async () => { void handleDelete(data.id)}}>Confirm</Button>
            </DialogContent>
          </Dialog>
          </div>
            </div>
            <Separator className='my-5' />
            <dl className="grid gap-3">
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Status
                </dt>
                <dd>{data?.statustype?.name}</dd>  
              </div>
              <div className="flex items-center justify-between">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Location
                </dt>
                <dd>{data?.destination?.name}</dd>
              </div>
            </dl>
          </div>
        })}
      </div>
   </>
  )
}
