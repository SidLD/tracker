import * as React from "react"

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

export function RoleCard() {
  return (
    <div className="block md:flex justify-center p-2 gap-2">
    <Card className="w-full md:w-1/3 h-fit">
      <CardHeader>
        <CardTitle>Role Setting</CardTitle>
        <CardDescription>Create Role</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Title</Label>
              <Input id="name" placeholder="name" />
            </div>
          </div>
        </form>
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
