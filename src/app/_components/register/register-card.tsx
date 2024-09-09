/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation"
import { useState } from "react"
import {   Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios"
import { useToast } from "@/hooks/use-toast"

const FormSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 5 characters.",
    }),
    firstName: z.string().min(3, {
      message: "First name must be at least 5 characters.",
    }),
    middleName: z.string().optional(),
    lastName: z.string().min(3, {
      message: "Last name must be at least 5 characters.",
    }),
    password: z.string().min(8, {
      message: "Username must be at least 8 characters.",
    }),
    extension: z.string().optional(),
    title: z.string().optional(),
    role: z.string().optional()
})

export function RegisterCard() {
  const [signUpLoading, setSignUpLoading] = useState(false)
  const { toast } = useToast()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password:""
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try{
      setSignUpLoading(true)
      await axios.post('http://localhost:3000/api/user', data)
        .then( async (data: any) => {
          toast({
            variant:"default",
            title : "Success",
            description : `Succefully Registered ${data.username}`
          })
        })
        .catch(() => {
          setSignUpLoading(false)
        })
        .finally(() => {
          setSignUpLoading(false)
        });
      
    }catch(e){
      setSignUpLoading(false)
      toast({
        variant:"destructive",
        title : "Error while sing up",
        description : "Please input correct credentials."
      })
    }
  }

  return (
    <Card className="md:w-[450px] lg:w-[900px] w-full m-5 p-2 px-7 rounded-xl">
        <CardHeader>
            <CardTitle className=" text-center text-3xl font-extrabold">Sign Up</CardTitle>
            <CardDescription className=" text-center text-base">{`Sign Up Portal`}</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="lg:grid grid-cols-2 gap-10">
                    <div className="grid grid-cols-1 gap-5">
                      <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                              <Input placeholder="Input username" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                              <Input type="password" placeholder="Input password" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-5">
                      <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Input first name" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="middleName"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>Middle Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Input middle name" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Input last name" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />

                    <FormField
                      control={form.control}
                      name="extension"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>Name Extension</FormLabel>
                          <FormControl>
                              <Input placeholder="Input name Extension" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />
                      <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                          <FormItem className=" relative">
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                              <Input placeholder="Input Title" {...field} />
                          </FormControl>
                          <FormMessage className=" absolute -bottom-5"/>
                          </FormItem>
                      )}
                      />
                    </div>
                </div>
                <div className="py-5">
                    <Button type="submit" disabled={signUpLoading} className=" w-full">Sign Up</Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}