import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  // SidebarFooter,
  SidebarHeader,
} from "../../components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

const items = [
  {
    title: "Dashboard",
    url: "/student/dashboard",
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="bg-black w-full rounded-md flex justify-center items-center gap-1 tracking-wide my-2 text-center font-black py-3">
          <span className="text-green-400">THE</span>
          <span className="text-blue-400">DEXES</span>
          <span className="text-red-400">COMPANY</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-3">
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <Link href={item.url}>
                    <Button
                      variant={`${
                        pathname === item.url ||
                        (item.url === "/admin/classroom" &&
                          pathname.startsWith("/admin/classroom"))
                          ? "secondary"
                          : "ghost"
                      }`}
                      className={`w-full ${
                        pathname === item.url ||
                        (item.url === "/admin/classroom" &&
                          pathname.startsWith("/admin/classroom"))
                          ? "text-black"
                          : "text-white/50 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className={`text-left w-full`}>{item.title}</span>
                    </Button>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {/* <SidebarFooter></SidebarFooter> */}
    </Sidebar>
  );
}
