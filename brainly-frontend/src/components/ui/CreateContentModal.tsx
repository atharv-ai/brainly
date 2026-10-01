import { useRef, useState } from "react";
import { CloseIcon } from "../../icons/CloseIcon";
import { Button } from "./Button";
import { InputBox } from "./InputBox";
import axios from "axios";
import { BACKEND_URL } from "../../config";

const ContentType = {
    Youtube: "youtube",
    Twitter: "twitter",
    Document: "document",
    Link: "link"
} as const;

type ContentTypeValue = typeof ContentType[keyof typeof ContentType];

interface CreateContentModalProps {
    close: boolean;
    onClose: () => void;
    onSubmitSuccess?: () => void;
}

export function CreateContentModal({ close, onClose, onSubmitSuccess }: CreateContentModalProps) {
    const textRef = useRef<HTMLInputElement>(null);
    const linkRef = useRef<HTMLInputElement>(null);
    const tagsRef = useRef<HTMLInputElement>(null);
    const [type, setType] = useState<ContentTypeValue>(ContentType.Youtube);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    async function addContent() {
        setError("");
        const title = textRef.current?.value.trim();
        const link = linkRef.current?.value.trim();
        const tagsRaw = tagsRef.current?.value.trim() || "";

        if (!title || !link) {
            setError("Title and Link are required");
            return;
        }

        const tags = tagsRaw ? tagsRaw.split(",").map(t => t.trim()).filter(Boolean) : [];
        const token = localStorage.getItem("token");

        if (!token) {
            setError("Authentication token missing. Please sign in.");
            return;
        }

        try {
            setLoading(true);
            await axios.post(`${BACKEND_URL}/api/v1/content`, {
                title,
                link,
                type,
                tags
            }, {
                headers: {
                    "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`
                }
            });

            if (textRef.current) textRef.current.value = "";
            if (linkRef.current) linkRef.current.value = "";
            if (tagsRef.current) tagsRef.current.value = "";
            
            onClose();
            if (onSubmitSuccess) {
                onSubmitSuccess();
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to add content. Please check your inputs.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

    if (!close) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Add Content</h2>
                    <div className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    <InputBox refrence={textRef} texts="Title" />
                    <InputBox refrence={linkRef} texts="Link URL" />
                    <InputBox refrence={tagsRef} texts="Tags (comma separated, e.g. tech, news)" />
                </div>

                <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 text-sm mb-2">Type</h3>
                    <div className="grid grid-cols-2 gap-2">
                        <Button text="Youtube" varient={type === ContentType.Youtube ? "secondary" : "primary"} size="sm" onClick={() => setType(ContentType.Youtube)} />
                        <Button text="Twitter" varient={type === ContentType.Twitter ? "secondary" : "primary"} size="sm" onClick={() => setType(ContentType.Twitter)} />
                        <Button text="Document" varient={type === ContentType.Document ? "secondary" : "primary"} size="sm" onClick={() => setType(ContentType.Document)} />
                        <Button text="Link" varient={type === ContentType.Link ? "secondary" : "primary"} size="sm" onClick={() => setType(ContentType.Link)} />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <Button varient="primary" size="md" text="Cancel" onClick={onClose} />
                    <Button varient="secondary" size="md" text={loading ? "Adding..." : "Submit"} onClick={addContent} />
                </div>
            </div>
        </div>
    );
}


