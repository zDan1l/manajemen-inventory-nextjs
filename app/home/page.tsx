import React from "react";
import Navbar from "../component/navbar";

const HomePage = () => {
    return (
        <div>
            <Navbar />
            <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content text-center">
                <div className="max-w-md">
                <h1 className="text-5xl font-bold">Home Page</h1>
                </div>
            </div>
            </div>
        </div>
    )
}
