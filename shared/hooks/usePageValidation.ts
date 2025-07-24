import { useEffect, useState } from 'react';

export const usePageValidation = (
    currentPage: number,
    validations: Record<number, () => boolean>
) => {
    const [isValid, setIsValid] = useState(false);

    useEffect(() => {
        const validator = validations[currentPage];
        setIsValid(validator ? validator() : false);
    }, [currentPage, ...Object.values(validations)]);

    return isValid;
};