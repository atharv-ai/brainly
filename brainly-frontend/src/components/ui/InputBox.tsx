export function InputBox({ texts, refrence, type = "text" }: { texts: string; refrence?: any; type?: string }) {
    return (
        <div>
            <input placeholder={texts} type={type} ref={refrence} className="shadow border-gray-300 border-2 p-2 m-2 rounded-md w-full" />
        </div>
    );
}