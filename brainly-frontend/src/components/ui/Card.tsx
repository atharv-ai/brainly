import { useState } from "react";
import { ShareIcon } from "../../icons/ShareIcon";
import { TrashIcon } from "../../icons/TrashIcon";
import axios from "axios";
import { BACKEND_URL } from "../../config";

export interface TagItem {
    _id?: string;
    tittle?: string;
    title?: string;
}

export interface CardSchema {
    id?: string;
    _id?: string;
    title?: string;
    tittle?: string;
    link: string;
    type: "youtube" | "twitter" | "tweet" | "document" | "link";
    tags?: (string | TagItem)[];
    onDelete?: (id: string) => void;
    readOnly?: boolean;
}

export const Card = ({ id, _id, title, tittle, link, type, tags, onDelete, readOnly = false }: CardSchema) => {
    const [deleting, setDeleting] = useState(false);
    const contentId = id || _id;
    const cardTitle = title || tittle || "Untitled";

    const handleDelete = async () => {
        if (!contentId) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete "${cardTitle}"?`);
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Authentication token missing. Please sign in.");
            return;
        }

        try {
            setDeleting(true);
            await axios.delete(`${BACKEND_URL}/api/v1/content`, {
                headers: {
                    "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`
                },
                data: {
                    contentId
                }
            });
            if (onDelete) {
                onDelete(contentId);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to delete content";
            alert(msg);
        } finally {
            setDeleting(false);
        }
    };

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            if (url.includes("youtube.com/watch")) {
                const videoId = new URL(url).searchParams.get("v");
                return `https://www.youtube.com/embed/${videoId}`;
            }
            if (url.includes("youtu.be/")) {
                const videoId = url.split("youtu.be/")[1]?.split("?")[0];
                return `https://www.youtube.com/embed/${videoId}`;
            }
            return url.replace("watch", "embed");
        } catch {
            return url;
        }
    };

    const normalizeType = type === "tweet" ? "twitter" : type;

    return (
        <div className={`border-gray-200 border shadow-sm rounded-xl bg-white max-w-72 px-4 py-3 min-h-52 min-w-72 mt-4 ml-2 flex flex-col justify-between ${deleting ? "opacity-50" : ""}`}>
            <div>
                <div className="flex justify-between font-medium items-center mb-2">
                    <div className="flex gap-2 text-gray-700 items-center truncate max-w-[160px]" title={cardTitle}>
                        <span className="capitalize text-xs font-semibold px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                            {normalizeType}
                        </span>
                        <span className="truncate">{cardTitle}</span>
                    </div>
                    <div className="text-gray-500 flex gap-2 items-center">
                        <a href={link} target="_blank" rel="noopener noreferrer" title="Open link">
                            <ShareIcon />
                        </a>
                        {!readOnly && contentId && (
                            <button onClick={handleDelete} disabled={deleting} title="Delete content" className="cursor-pointer">
                                <TrashIcon />
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-2">
                    {normalizeType === "youtube" && (
                        <iframe 
                            className="w-full rounded-xl mt-2 h-40" 
                            src={getYoutubeEmbedUrl(link)} 
                            title={cardTitle} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            referrerPolicy="strict-origin-when-cross-origin" 
                            allowFullScreen
                        />
                    )}

                    {normalizeType === "twitter" && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-600 break-words">
                            <a href={link.replace('x.com', 'twitter.com')} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                View Tweet: {link}
                            </a>
                        </div>
                    )}

                    {(normalizeType === "document" || normalizeType === "link") && (
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700 break-words">
                            <p className="font-medium text-gray-900 mb-1">{cardTitle}</p>
                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline text-xs break-all">
                                {link}
                            </a>
                        </div>
                    )}
                </div>
            </div>

            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                    {tags.map((tag, idx) => {
                        const tagText = typeof tag === "string" ? tag : (tag.tittle || tag.title || "");
                        if (!tagText) return null;
                        return (
                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                #{tagText}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};