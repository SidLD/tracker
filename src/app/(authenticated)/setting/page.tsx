import { Separator } from "@/components/ui/separator";
import { LocationCard } from "./_components/locationCard";
import { StatusCard } from "./_components/statusCard";
import {
  Tabs,
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