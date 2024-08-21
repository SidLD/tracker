'use client'
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();
    useEffect( () => {
        const logout = async () => {
            await signOut({ redirect: false })
            router.push('/')
        }
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        logout()
    }, [])
    return (<div></div>);
}
 
export default Page;