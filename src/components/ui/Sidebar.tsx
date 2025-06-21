import { Logo } from "../../Icons/logo";
import { TwitterIcon } from "../../Icons/TwitterIcon";
import { YoutubeIcon } from "../../Icons/YoutubeIcon";
import { SidebarItem } from "./SiderbarItem";

export function Sidebar() {
  return (
    <div className="bg-white dark:bg-gray-900 fixed top-0 left-0 h-screen border-r border-gray-200 dark:border-gray-700 w-72 px-6 py-6">
      
      <div className="flex items-center text-2xl font-semibold text-purple-600 dark:text-purple-400">
        <div className="mr-2">
          <Logo />
        </div>
        Brainly
      </div>

      
      <div className="mt-10 space-y-4 text-lg text-gray-700 dark:text-gray-300">
        <SidebarItem text="Twitter" icon={<TwitterIcon />} />
        <SidebarItem text="Youtube" icon={<YoutubeIcon />} />
      </div>
    </div>
  );
}
