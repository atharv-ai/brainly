import { useState } from "react";
import { CloseIcon } from "../../icons/CloseIcon";
import { Button } from "./Button";
import axios from "axios";
import { BACKEND_URL } from "../../config";

interface ShareModalProps {
    close: boolean;
    onClose: () => void;
}

export function ShareModal({ close, onClose }: ShareModalProps) {
    const [shareUrl, setShareUrl] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [sharingActive, setSharingActive] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const toggleShare = async (enable: boolean) => {
        setError("");
        setCopied(false);
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Authentication token missing.");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: enable
            }, {
                headers: {
                    "Authorization": token.startsWith("Bearer ") ? token : `Bearer ${token}`
                }
            });

            if (enable) {
                const hash = res.data.hash || res.data.link?.hash;
                if (hash) {
                    const fullUrl = `${window.location.origin}/share/${hash}`;
                    setShareUrl(fullUrl);
                    setSharingActive(true);
                }
            } else {
                setShareUrl("");
                setSharingActive(false);
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || "Failed to update share settings";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    if (!close) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl relative">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">Share Your Brain</h2>
                    <div className="cursor-pointer text-gray-500 hover:text-gray-700" onClick={onClose}>
                        <CloseIcon />
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-100 text-red-600 rounded text-sm">
                        {error}
                    </div>
                )}

                <p className="text-sm text-gray-600 mb-4">
                    Share your entire brain collection of notes, links, and videos with anyone via a public share link.
                </p>

                {!sharingActive && !shareUrl ? (
                    <div className="flex justify-center mt-4">
                        <Button
                            varient="secondary"
                            size="md"
                            text={loading ? "Generating Link..." : "Enable Public Sharing"}
                            onClick={() => toggleShare(true)}
                        />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                                Public Share Link
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={shareUrl}
                                    className="w-full bg-white border border-gray-300 rounded px-2 py-1 text-sm text-gray-800 select-all"
                                />
                                <Button
                                    varient="secondary"
                                    size="sm"
                                    text={copied ? "Copied!" : "Copy"}
                                    onClick={copyToClipboard}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                            <Button
                                varient="primary"
                                size="sm"
                                text={loading ? "Updating..." : "Disable Sharing"}
                                onClick={() => toggleShare(false)}
                            />
                            <Button
                                varient="secondary"
                                size="sm"
                                text="Done"
                                onClick={onClose}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
