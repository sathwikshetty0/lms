import LogoutButton from "@/components/LogoutButton";
import Searchbar from "@/components/Searchbar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  return (
    <div className="flex p-5 gap-3 justify-between">
      <SidebarTrigger />
      <Searchbar />
      <Avatar>
        <AvatarImage src="https://srajan.vercel.app/assets/srajan.jpg" />
        <AvatarFallback>SK</AvatarFallback>
      </Avatar>
      <LogoutButton />
    </div>
  );
};

export default Navbar;