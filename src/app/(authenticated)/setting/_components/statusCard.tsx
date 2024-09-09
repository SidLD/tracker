'use client'
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
import { Separator } from "@radix-ui/react-select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createContext, useEffect, useState } from "react";
import { StatusType ,type Status } from "@/lib/types/status";

import { StatusTable } from "./statusTable";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import _axios from "@/lib/axios";
import { useToast } from "@/hooks/use-toast"


const LocationSchema = z.object({
  id: z.any().optional(),
  name: z.string().min(3, 'Must have atleast 3 length')
})

export const StatusContext = createContext<{
  data: Status[],
  onSelectItem: any
} | undefined>(undefined);

export function StatusCard() {
  const {toast} = useToast();
  const [locations, setLocations] = useState<Status[]>([]);
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Status | null>(null);
  const [statusTypes, setStatusTypes] = useState<StatusType[]>()
  const [statusType, setStatusType] = useState<StatusType | null>()
  const form = useForm<z.infer<typeof LocationSchema>>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      name: ''
    },
  })

  const onSelectItem = (status : Status) => {
    setSelectedItem(status)
  }

  const onCreateItem = async (data: z.infer<typeof LocationSchema>) => {
    try {
      setLoading(true)
      if(!selectedItem){
        await fetch('/api/status', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }else{
        await fetch('/api/status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      await getItems()
      toast({
        title: "Success",
        variant: 'default',
        description: ""
      })

      hanldeClearItem()
    } catch (error) {
     console.log(error)  
    }
    setLoading(false)
  }

  const onDeleteItem = async () => {
    try {
      if(selectedItem){
        setLoading(true)
          await fetch('/api/status', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: selectedItem.id, name: selectedItem.name}),
          });
        await getItems()
        toast({
          title: "Success",
          variant: 'default',
          description: ""
        })
        hanldeClearItem()
      }
    } catch (error) {
      toast({
        title: "Fail",
        variant: 'destructive',
        description: ""
      })
    }
  }

  const getItems = async () => {
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
      setLocations(await response.json() as Status[]);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const hanldeClearItem = () => {
    setSelectedItem(null);
    form.setValue('name', '');
  }


  const fetchDestination = async () => {
    try {
      try {
        if(selectedItem){
          await _axios.get('/api/statustype', {
            params: {
              status: selectedItem.id
            }
          }).then(({data}) => {
            setStatusTypes(data)
          })
        }
      } catch (error) { /* empty */ }
    } catch (error) {
      { /* empty */ }
    }
  }

  const handleCreateCategory = async () => {
    try {
      if(statusType && statusType.name?.length > 0 && selectedItem){
        _axios.post('/api/statustype', {
          name: statusType?.name,
          status: selectedItem.id,
          id: statusType.id
        })
        await fetchDestination()
      }
    } catch (error) {
      { /* empty */ }
    }
  }

  useEffect(() => {
    void getItems()
  }, [])

  useEffect(() => {
    if(selectedItem){
      form.setValue("name", selectedItem.name)
      form.setValue("id", selectedItem.id)
      void fetchDestination()
    }
  }, [selectedItem])

  return (
    <div className="block md:flex justify-center p-2 gap-2">

    <div className="w-full md:w-1/3 h-fit">
      <Card >
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onCreateItem)}>
        <CardHeader>
          <CardTitle>Status Setting</CardTitle>
          <CardDescription>Create Status</CardDescription>
        </CardHeader>
        <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}           
                  name="id"
                  render={({ field }) => (
                      <FormItem className=" relative">
                      <FormControl>
                          <Input {...field} type="hidden" />
                      </FormControl>
                      </FormItem>
                  )}
                  />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                      <FormItem className=" relative">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                          <Input placeholder="Input Name" {...field} />
                      </FormControl>
                      <FormMessage className=" absolute -bottom-5"/>
                      </FormItem>
                  )}
                  />
              </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="secondary" onClick={onDeleteItem}>Delete</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={hanldeClearItem}>Clear</Button>
            <Button type="submit" disabled={loading}>{selectedItem ? 'Update': 'Save'}</Button>
          </div>
        </CardFooter>

        </form>
        </Form>
      </Card>
      <Separator className="my-2" />
      {selectedItem && <Card>
      <CardHeader>
          <CardTitle>Status Type</CardTitle>
          <CardDescription>Add Status Type</CardDescription>
        </CardHeader>
        <CardContent>
        <Input
              placeholder="Type..."
              onChange={(e:any) => {
                if(statusType){
                  setStatusType({
                    ...statusType,
                    name: e.target.value,
                  });
                }
              }}

              value={statusType?.name}
            />
          <Separator  className="my-5"/>
          <div>
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statusTypes?.map((statusType, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{statusType.name}</TableCell>
                    <TableCell className="grid grid-cols-2 gap-2">
                        <Button variant={'outline'} className="" onClick={() => {
                          setStatusType({
                            status: selectedItem,
                            name: statusType.name,
                            id: statusType.id,
                            statusCategory: undefined
                          })
                        }}>
                            Update
                        </Button>
                        <Button>
                            Delete
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2">
          <Button variant={'outline'} onClick={() => {
            setStatusType({
              id: null,
              name: '',
              status: selectedItem,
              statusCategory: undefined
            })

          }}>Clear</Button>
          <Button onClick={() => {handleCreateCategory()}} disabled={!selectedItem}>{statusType ? 'Save' : 'Add'}</Button>
        </CardFooter>
      </Card>}
      </div>
      <Separator className="md:hdden my-5" />
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Status List</CardTitle>
        </CardHeader>
        <CardContent>
          <StatusContext.Provider value={{
            data: locations,
            onSelectItem
          }}>
            <StatusTable />
          </StatusContext.Provider>
        </CardContent>
      </Card>
    </div>
  )
}
