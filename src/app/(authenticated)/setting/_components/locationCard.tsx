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
import { Separator } from "@radix-ui/react-select"
import { useToast } from "@/components/ui/use-toast"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createContext, useEffect, useState } from "react";
import { Destination, type Location } from "@/lib/types/location";
import { LocationTable } from "./locationTable";
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


const LocationSchema = z.object({
  id: z.any().optional(),
  name: z.string().min(3, 'Must have atleast 3 length')
})

export const LocationContext = createContext<{
  data: Location[],
  onSelectItem: any
} | undefined>(undefined);

export function LocationCard() {
  const {toast} = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>()
  const [destination, setDestination] = useState<Destination | null>()
  const form = useForm<z.infer<typeof LocationSchema>>({
    resolver: zodResolver(LocationSchema),
    defaultValues: {
      name: ''
    },
  })

  const onSelectItem = (location : Location) => {
    setSelectedLocation(location)
  }

  const onCreateItem = async (data: z.infer<typeof LocationSchema>) => {
    try {
      setLoading(true)
      if(!selectedLocation){
        await fetch('/api/location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }else{
        await fetch('/api/location', {
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
      if(selectedLocation){
        setLoading(true)
          await fetch('/api/location', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: selectedLocation.id, name: selectedLocation.name}),
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
      const response = await fetch('/api/location', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setLocations(await response.json() as Location[]);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const hanldeClearItem = () => {
    setSelectedLocation(null);
    form.setValue('name', '');
  }

  const fetchDestination = async () => {
    try {
      try {
        if(selectedLocation){
          await _axios.get('/api/destination', {
            params: {
              location: selectedLocation.id
            }
          }).then(({data}) => {
            setDestinations(data as Destination[])
          })
        }
      } catch (error) { /* empty */ }
    } catch (error) { /* empty */ }
  }

  const handleCreateCategory = async () => {
    try {
      if(destination && destination.name?.length > 0 && selectedLocation){
        _axios.post('/api/destination', {
          name: destination?.name,
          location: selectedLocation.id,
          id: destination.id
        })
        await fetchDestination()
      }
    } catch (error) { /* empty */ }
  }

  useEffect(() => {
    void getItems()
  }, [])

  useEffect(() => {
    if(selectedLocation){
      form.setValue("name", selectedLocation.name)
      form.setValue("id", selectedLocation.id)
      void fetchDestination()
    }
  }, [selectedLocation])

  return (
    <div className="block md:flex justify-center p-2 gap-2">
      <div className="w-full md:w-1/3 h-fit">
      <Card>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onCreateItem)}>
        <CardHeader>
          <CardTitle>Location Setting</CardTitle>
          <CardDescription>Create Location</CardDescription>
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
            <Button type="submit" disabled={loading}>{selectedLocation ? 'Update': 'Save'}</Button>
          </div>
        </CardFooter>
        </form>
        </Form>
      </Card>
      <Separator className="my-2" />
      {selectedLocation && <Card>
      <CardHeader>
          <CardTitle>Destination</CardTitle>
          <CardDescription>Add Destination</CardDescription>
        </CardHeader>
        <CardContent>
        <Input
              placeholder="Destination..."
              onChange={(e:any) => {
                if(destination){
                  setDestination({
                    ...destination,
                    name: e.target.value,
                  });
                }
              }}

              value={destination?.name}
            />
          <Separator  className="my-5"/>
          <div>
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Destination</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {destinations?.map((destination, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{destination.name}</TableCell>
                    <TableCell className="grid grid-cols-2 gap-2">
                        <Button variant='outline' onClick={() => {
                          setDestination({
                            location: selectedLocation,
                            name: destination.name,
                            id: destination.id
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
            setDestination({
              id: null,
              name: '',
              location: selectedLocation
            })

          }}>Clear</Button>
          <Button onClick={() => {handleCreateCategory()}} disabled={!selectedLocation}>{destination ? 'Save' : 'Add'}</Button>
        </CardFooter>
      </Card>}
      </div>
      <Separator className="md:hdden my-5" />
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Location List</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationContext.Provider value={{
            data: locations,
            onSelectItem
          }}>
            <LocationTable />
          </LocationContext.Provider>
        </CardContent>
      </Card>
    </div>
  )
}
