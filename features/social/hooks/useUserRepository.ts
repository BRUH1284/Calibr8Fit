import { useContext } from "react";
import { UserRepositoryContext } from "../context/UserRepositoryContext";

export const useUserRepository = () => {
    const context = useContext(UserRepositoryContext);

    if (!context)
        throw new Error('useUserRepository must be used within UserRepositoryProvider');

    return context;
}