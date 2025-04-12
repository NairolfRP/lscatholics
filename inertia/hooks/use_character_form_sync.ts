import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import { useEffect } from "react";

export function useCharacterFormSync({
    setValue,
    fields,
}: {
    setValue: Function;
    fields: string[];
}) {
    const { auth } = usePage<SharedProps>().props;
    const currentCharacter = auth?.user?.currentCharacter;
    useEffect(() => {
        if (currentCharacter) {
            for (const fieldName in currentCharacter) {
                if (fieldName in currentCharacter) {
                    setValue(
                        fieldName,
                        currentCharacter[fieldName as keyof typeof currentCharacter] || "",
                    );
                }
            }
        }
    }, [currentCharacter, setValue, fields]);

    return {
        currentCharacter,
    };
}
