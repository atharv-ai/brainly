import { Logo } from "../../icons/Logo";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SideBarItem } from "./SideBarItem";
import { useNavigate } from "react-router-dom";

interface SideBarProps {
    onSelectFilter?: (filter: string) => void;
}

export function SideBar({ onSelectFilter }: SideBarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    return (
        <div className="fixed bg-white top-0 left-0 h-screen w-72 pl-6 pt-4 border-r border-gray-200 flex flex-col justify-between pb-6">
            <div>
                <div className="flex items-center text-2xl font-bold p-2 text-purple-600 gap-2 cursor-pointer" onClick={() => onSelectFilter && onSelectFilter("all")}>
                    <Logo />
                    <span>Brainly</span>
                </div>

                <div className="pt-4 pl-4 space-y-1">
                    <SideBarItem Icon={<YoutubeIcon />} content="All Notes" onClick={() => onSelectFilter && onSelectFilter("all")} />
                    <SideBarItem Icon={<YoutubeIcon />} content="Youtube" onClick={() => onSelectFilter && onSelectFilter("youtube")} />
                    <SideBarItem Icon={<TwitterIcon />} content="Twitter" onClick={() => onSelectFilter && onSelectFilter("twitter")} />
                </div>
            </div>

            <div className="pl-4">
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 font-medium hover:bg-red-50 rounded transition-colors text-sm"
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}