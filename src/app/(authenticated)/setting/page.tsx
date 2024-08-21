import { Separator } from "@/components/ui/separator";
import { RoleCard } from "./_components/roleCard";
import { LocationCard } from "./_components/locationCard";
import { StatusCard } from "./_components/statusCard";

const Page = () => {
    return (
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
          <RoleCard/>
          <Separator />
          {/* <LocationCard/>
          <Separator />
          <StatusCard/> */}
      </main>
    );
}
 
export default Page;