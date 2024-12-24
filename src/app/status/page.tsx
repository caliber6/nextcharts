'use client'
import { checkDatabaseConnection } from "../../features/dashboard/actions";
import { useState, useEffect } from "react";

export default function CheckDBStatus() {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const dbResult = await checkDatabaseConnection();
            setResult(dbResult as boolean);
            setLoading(false);
        };

        fetchData();
    }, []);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white">
            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mr-4"></div>
                    <h1 className="text-4xl font-bold transition-opacity duration-500 animate-fade-in">
                        Loading...
                    </h1>
                </div>
            ) : (
                <h1 className={`text-4xl font-bold transition-opacity duration-500 animate-fade-in ${result ? "text-green-400" : "text-red-400"}`}>
                    Database status: {result ? "Connected" : "Disconnected"}
                </h1>
            )}
        </div>
    );
}
