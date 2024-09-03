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
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="role">Role</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="status">Status</TabsTrigger>
      </TabsList>
        <TabsContent value="role">
          <RoleCard/>
        </TabsContent>
        <TabsContent value="location">
          <LocationCard/>
        </TabsContent>
        <TabsContent value="status">
          <StatusCard />
        </TabsContent>
    </Tabs>
    );
}
 
export default Page;