'use client'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    useEffect(() => {
        signOut()
    }, [])
    return (<div>asd</div>);
}
 
export default Page;