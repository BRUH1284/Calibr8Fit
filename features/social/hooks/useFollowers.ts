import { useContext } from "react";
import { FollowersContext } from "../context/FollowersContext";

export const useFollowers = () => {
    const context = useContext(FollowersContext);
    if (!context) {
        throw new Error('useFollowers must be used within a FollowersProvider');
    }
    return context;
};