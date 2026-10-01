import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import type { CardSchema } from '../components/ui/Card';
import { CreateContentModal } from '../components/ui/CreateContentModal';
import { EditContentModal } from '../components/ui/EditContentModal';
import { ShareModal } from '../components/ui/ShareModal';
import { MasonryLayout } from '../components/ui/MasonryLayout';
import { PlusIcon } from '../icons/PlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { SideBar } from '../components/ui/SideBar';
import { BACKEND_URL } from '../config';

interface ContentItem {
    _id: string;
    title?: string;
    tittle?: string;
    link: string;
    type: "youtube" | "twitter" | "tweet" | "document" | "link";
    tags?: any[];
}

export function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<CardSchema | null>(null);
    const [contents, setContents] = useState<ContentItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();

    const fetchContents = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/signin");
            return;
        }

        try {
            setLoading(true);
            setError("");
            const res = await axios.get(`${BACKEND_URL}/api/v1/content`, {
                headers: {
                    "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`
                }
            });
            setContents(res.data.content || []);
        } catch (err: any) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem("token");
                navigate("/signin");
                return;
            }
            setError(err.response?.data?.message || "Failed to fetch content");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    const handleItemDeleted = (deletedId: string) => {
        setContents((prev) => prev.filter((item) => item._id !== deletedId));
    };

    const handleEditItem = (card: CardSchema) => {
        setEditingItem(card);
        setEditModalOpen(true);
    };

    const filteredContents = contents.filter((item) => {
        if (filter === "all") return true;
        if (filter === "twitter") return item.type === "twitter" || item.type === "tweet";
        return item.type === filter;
    });

    return (
        <div className="p-4 min-h-screen bg-gray-100">
            <SideBar onSelectFilter={(f) => setFilter(f)} activeFilter={filter} />
            
            <CreateContentModal
                close={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmitSuccess={fetchContents}
            />

            <EditContentModal
                close={editModalOpen}
                content={editingItem}
                onClose={() => {
                    setEditModalOpen(false);
                    setEditingItem(null);
                }}
                onSubmitSuccess={fetchContents}
            />

            <ShareModal
                close={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
            />

            <div className="ml-72">
                <div className="flex justify-between items-center mb-6">
                    <div className="pl-4 font-semibold text-3xl text-gray-800 capitalize">
                        {filter === "all" ? "All Notes" : `${filter} Notes`}
                    </div>
                    <div className="flex justify-end gap-4 items-center p-4">
                        <Button
                            startIcon={<ShareIcon />}
                            varient="primary"
                            size="md"
                            text="Share Brain"
                            onClick={() => setShareModalOpen(true)}
                        />
                        <Button
                            onClick={() => setModalOpen(true)}
                            startIcon={<PlusIcon size="md" />}
                            varient="secondary"
                            size="md"
                            text="Add Content"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-gray-500 font-medium">
                        Loading content...
                    </div>
                ) : error ? (
                    <div className="p-6 m-4 bg-red-50 text-red-600 rounded-xl font-medium">
                        {error}
                    </div>
                ) : filteredContents.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 bg-white rounded-xl shadow-sm m-4">
                        No content found. Click <span className="font-semibold text-purple-600">Add Content</span> to create your first note!
                    </div>
                ) : (
                    <MasonryLayout
                        items={filteredContents}
                        renderItem={(item) => (
                            <Card
                                id={item._id}
                                _id={item._id}
                                title={item.title || item.tittle}
                                link={item.link}
                                type={item.type}
                                tags={item.tags}
                                onDelete={handleItemDeleted}
                                onEdit={handleEditItem}
                            />
                        )}
                    />
                )}
            </div>
        </div>
    );
}



