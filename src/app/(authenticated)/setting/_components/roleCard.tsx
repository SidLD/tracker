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

const RoleSchema = z.object({
  name: z.string().min(3, 'Must have atleast 3 length')
})

export function RoleCard() {
  const createRoleForm = useForm<z.infer<typeof RoleSchema>>({
    resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: ''
    },
  })
  const onCreateRole = async (data: z.infer<typeof RoleSchema>) => {
    try {
      const result = await api.role.createRole({name: data.name});
      if(result){
        console.log(result)
      }
    } catch (error) {
     console.log(error)  
    }
  }

  return (
    <div className="block md:flex justify-center p-2 gap-2">
      <Card className="w-full md:w-1/3 h-fit">
        <CardHeader>
          <CardTitle>Role Setting</CardTitle>
          <CardDescription>Create Role</CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...createRoleForm}>
          <form onSubmit={createRoleForm.handleSubmit(onCreateRole)}>
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
            </form>
        </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Delete</Button>
          <Button>Save</Button>
        </CardFooter>
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
