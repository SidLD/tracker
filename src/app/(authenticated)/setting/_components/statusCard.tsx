'use client';
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
import { Label } from "@/components/ui/label"
import { Separator } from "@radix-ui/react-select"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/server"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createContext, useEffect, useState } from "react";
import { status } from "@/lib/types/status";
import { LocationTable } from "./locationTable";
import { StatusTable } from "./statusTable";


const LocationSchema = z.object({
  id: z.any().optional(),
  name: z.string().min(3, 'Must have atleast 3 length')
})

export const StatusContext = createContext<{
  data: status[],
  onSelectItem: any
} | undefined>(undefined);

export function StatusCard() {
  const {toast} = useToast();
  const [locations, setLocations] = useState<status[]>([]);
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<status | null>(null);
  const form = useForm<z.infer<typeof LocationSchema>>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      name: ''
    },
  })

  const onSelectItem = (status : status) => {
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
      setLocations(await response.json() as status[]);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const hanldeClearItem = () => {
    setSelectedItem(null);
    form.setValue('name', '');
  }

  useEffect(() => {
    getItems()
  }, [])

  useEffect(() => {
    if(selectedItem){
      form.setValue("name", selectedItem.name)
      form.setValue("id", selectedItem.id)
    }
  }, [selectedItem])

  return (
    <div className="block md:flex justify-center p-2 gap-2">
      <Card className="w-full md:w-1/3 h-fit">
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
