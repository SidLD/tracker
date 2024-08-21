'use client'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();
    useEffect(() => {
        const logout = async () => {
            await signOut({ redirect: false })
            router.push('/')
        }
        logout()
    }, [])
    return (<div>asd</div>);
}
 
export default Page;