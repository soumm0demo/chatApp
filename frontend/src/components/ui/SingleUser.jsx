"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SingleUser = (props) => {
    const { user , id , isOnline} = props;
    const router = useRouter() ; 
    const searchParams = useSearchParams();
    const [isClicked, setClicked] = useState(false);

    useEffect(() => {
        const selectedId = searchParams.get("id");
        setClicked(selectedId === id); // Update `isClicked` when URL changes
    }, [searchParams, id]); // Reacts to `id` changes

    const clickHandler = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("id", id);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <button
            className={`flex items-center p-2 gap-x-6 
                ${isClicked ? "bg-[#697565] " : "bg-[#40534C]"}
            `}
            onClick={clickHandler}
        >
            <img src={user.imgUrl} alt="user" className="w-16 h-16 rounded-full" />
            <div>
                <p>{user.username}</p>
                <p>{isOnline ? 'Online' : 'Offline'}</p>
            </div>
        </button>
    );
};

export default SingleUser;
