import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Card } from "../components/ui/Card";
import { Logo } from "../icons/Logo";

interface ContentItem {
    _id: string;
    title?: string;
    tittle?: string;
    link: string;
    type: "youtube" | "twitter" | "tweet" | "document" | "link";
    tags?: any[];
}

export function SharedBrain() {
    const { shareLink } = useParams<{ shareLink: string }>();
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function fetchSharedContent() {
            if (!shareLink) return;
            try {
                setLoading(true);
                const res = await axios.get(`${BACKEND_URL}/api/v1/brain/${shareLink}`);
                setContents(res.data.content || []);
                setUsername(res.data.username || "User");
            } catch (err: any) {
                const msg = err.response?.data?.message || "Invalid or expired share link";
                setError(msg);
            } finally {
                setLoading(false);
            }
        }
        fetchSharedContent();
    }, [shareLink]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <p className="text-gray-500 font-medium">Loading shared brain...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
                <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Unavailable</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 max-w-6xl mx-auto">
                <div className="flex items-center text-2xl font-bold text-purple-600 gap-2">
                    <Logo />
                    <span>{username}'s Brain</span>
                </div>
                <span className="text-sm bg-purple-100 text-purple-700 font-medium px-3 py-1 rounded-full">
                    Public Share
                </span>
            </header>

            <main className="max-w-6xl mx-auto">
                {contents.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
                        No public content shared yet.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-4 justify-start">
                        {contents.map((item) => (
                            <Card
                                key={item._id}
                                _id={item._id}
                                title={item.title || item.tittle}
                                link={item.link}
                                type={item.type}
                                tags={item.tags}
                                readOnly={true}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
