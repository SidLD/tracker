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
import { RoleTable } from "./roleTable"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/trpc/react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { createContext, useEffect, useState } from "react";
import { Role } from "@/lib/types/role";


const RoleSchema = z.object({
  id: z.any().optional(),
  name: z.string().min(3, 'Must have atleast 3 length')
})

export const RoleContext = createContext<{
  data: Role[],
  onSelectRole: any
} | undefined>(undefined);

export function RoleCard() {
  const {toast} = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const createRoleForm = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: ''
    },
  })

  const onSelectRole = (role : Role) => {
    setSelectedRole(role)
  }

  const onCreateRole = async (data: z.infer<typeof RoleSchema>) => {
    try {
      setLoading(true)
      if(!selectedRole){
        await fetch('/api/role', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }else{
        await fetch('/api/role', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
      }
      await getRoles()
      toast({
        title: "Success",
        variant: 'default',
        description: ""
      })

      hanldeClearRole()
    } catch (error) {
     console.log(error)  
    }
    setLoading(false)
  }

  const onDeleteRole = async () => {
    try {
      if(selectedRole){
        setLoading(true)
          await fetch('/api/role', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: selectedRole.id, name: selectedRole.name}),
          });
        await getRoles()
        toast({
          title: "Success",
          variant: 'default',
          description: ""
        })
        hanldeClearRole()
      }
    } catch (error) {
      toast({
        title: "Fail",
        variant: 'destructive',
        description: ""
      })
    }
  }

  const getRoles = async () => {
    try {
      const data = api
      const response = await fetch('/api/role', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setRoles(await response.json() as Role[]);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  const hanldeClearRole = () => {
    setSelectedRole(null);
    createRoleForm.setValue('name', '');
  }

  useEffect(() => {
    getRoles()
  }, [])

  useEffect(() => {
    if(selectedRole){
      createRoleForm.setValue("name", selectedRole.name)
      createRoleForm.setValue("id", selectedRole.id)
    }
  }, [selectedRole])

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
          <Button variant="secondary" onClick={onDeleteRole}>Delete</Button>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" onClick={hanldeClearRole}>Clear</Button>
            <Button type="submit" disabled={loading}>{selectedRole ? 'Update': 'Save'}</Button>
          </div>
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
          <RoleContext.Provider value={{
            data: roles,
            onSelectRole
          }}>
            <RoleTable />
          </RoleContext.Provider>
        </CardContent>
      </Card>
    </div>
  )
}
