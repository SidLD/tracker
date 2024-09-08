import { Separator } from "@/components/ui/separator";
import { RoleCard } from "./_components/roleCard";
import { LocationCard } from "./_components/locationCard";
import { StatusCard } from "./_components/statusCard";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

const Page = () => {
    return (
    <Tabs defaultValue="role" className="">
          <LocationCard/>
          <Separator />
          <StatusCard />
    </Tabs>
    );
}
 
export default Page;