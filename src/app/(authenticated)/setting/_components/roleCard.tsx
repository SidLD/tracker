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
import { SettingTable } from "./settingTable"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/server"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react";
import { Role } from "@/lib/types/role";


const RoleSchema = z.object({
  name: z.string().min(3, 'Must have atleast 3 length')
})

export function RoleCard() {
  const {toast} = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const createRoleForm = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: ''
    },
  })
  const onCreateRole = async (data: z.infer<typeof RoleSchema>) => {
    try {
      const response = await fetch('/api/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log("test", response)
      toast({
        title: "Success",
        variant: 'default',
        description: ""
      })
    } catch (error) {
     console.log(error)  
    }
  }

  const getRoles = async () => {
    try {
      const response = await fetch('/api/role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setRoles(await response.json());
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    getRoles()
  }, [])

  return (
    <div className="block md:flex justify-center p-2 gap-2">
      <Card className="w-full md:w-1/3 h-fit">
      <Form {...createRoleForm}>
      <form onSubmit={createRoleForm.handleSubmit(onCreateRole)}>
        <CardHeader>
          <CardTitle>Role Setting</CardTitle>
          <CardDescription>Create Role</CardDescription>
        </CardHeader>
        <CardContent>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={createRoleForm.control}
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
          <Button variant="outline">Delete</Button>
          <Button type="submit">Save</Button>
        </CardFooter>

        </form>
        </Form>
      </Card>
      <Separator className="md:hdden my-5" />
      <Card className="w-full md:w-2/3">
        <CardHeader>
          <CardTitle>Role List</CardTitle>
        </CardHeader>
        <CardContent>
          <SettingTable />
        </CardContent>
      </Card>
    </div>
  )
}
