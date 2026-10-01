import { useRef, useState } from "react";
import { Button } from "../components/ui/Button";
import { InputBox } from "../components/ui/InputBox";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const SingIn = () => {
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    async function signin() {
        setError("");
        const username = usernameRef.current?.value.trim();
        const password = passwordRef.current?.value.trim();

        if (!username || !password) {
            setError("Username and password are required");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
                username,
                password
            });
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } catch (e: any) {
            const msg = e.response?.data?.message || "Wrong username or password";
            setError(msg);
        }
    }

    return (
        <div className="h-screen bg-gray-200 flex justify-center items-center">
            <div className="p-6 bg-white rounded-xl w-80 shadow-md">
                <div className="text-center mb-4">
                    <h1 className="text-2xl font-bold text-purple-600">Sign In</h1>
                </div>

                {error && (
                    <div className="mb-3 p-2 bg-red-100 text-red-600 rounded text-xs text-center">
                        {error}
                    </div>
                )}

                <div>
                    <InputBox refrence={usernameRef} texts="Username" />
                    <InputBox refrence={passwordRef} texts="Password" type="password" />

                    <div className="flex justify-center pt-2">
                        <Button
                            varient="secondary"
                            size="md"
                            text="Sign In"
                            fullWidth={true}
                            onClick={signin}
                        />
                    </div>

                    <p className="flex justify-center mt-4 text-sm text-gray-600">
                        Don't have an account?
                        <Link to="/signup" className="text-indigo-600 cursor-pointer ml-1 font-semibold">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

