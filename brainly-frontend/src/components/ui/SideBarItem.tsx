import type { ReactElement } from "react";

export function SideBarItem({ Icon, content, onClick }: { Icon: ReactElement; content: string; onClick?: () => void }) {
    return (
        <div onClick={onClick} className="flex text-gray-800 cursor-pointer hover:bg-gray-200 rounded max-w-48 pl-4 transition-all duration-200">
            <div className="p-2">
                {Icon}
            </div>
            <div className="p-2">
                {content}
            </div>
        </div>
    );
}