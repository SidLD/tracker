"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation"
import { useState } from "react"
import {   Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FormSchema = z.object({
    username: z.string().min(3, {
      message: "Username must be at least 5 characters.",
    }),
    password: z.string().min(8, {
      message: "Username must be at least 8 characters.",
    }),
})

export function LoginCard() {
  const [loginLoading, setLoginLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password:"",
    },
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try{
      setLoginLoading(true)
      return await signIn('credentials', { username : data.username, password : data.password, redirect: false}).then((data)=>{
      if(data?.error){
        toast({
          variant:"destructive",
          title : "User not found",
          description : "Please input correct credentials."
        })
      }else {
        toast({
          title : "Success login",
          description : "Welcome user."
        })
        router.push("/dashboard")
      }
    }).finally(()=>{
      setLoginLoading(false)
    })
    }catch(e){
      setLoginLoading(false)
      toast({
        variant:"destructive",
        title : "User not found",
        description : "Please input correct credentials."
      })
    }
  }

  return (
    <Card className="md:w-[450px] lg:w-[450px] w-full m-5 p-2 px-7 rounded-xl">
        <CardHeader>
            <CardTitle className=" text-center text-3xl font-extrabold">LOGIN</CardTitle>
            <CardDescription className=" text-center text-base">{`Login Portal`}</CardDescription>
        </CardHeader>
        <CardContent>
                <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <div className=" py-5">
                    <Button type="submit" disabled={loginLoading} className=" w-full">Login</Button>
                </div>
            </form>
            </Form>
        </CardContent>
    </Card>
  )
}