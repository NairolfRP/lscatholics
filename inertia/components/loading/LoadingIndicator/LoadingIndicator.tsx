import LoadingScreen from "@/components/loading/LoadingScreen/LoadingScreen";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { router } from "@inertiajs/react";
import React from "react";

export default function LoadingIndicator() {
    const [loading, setLoading] = React.useState(false);

    useIsomorphicLayoutEffect(() => {
        const removeStartEventListener = router.on("start", () => {
            setLoading(true);
        });

        const removeFinishEventListener = router.on("finish", () => {
            setLoading(false);
        });

        return () => {
            removeStartEventListener();
            removeFinishEventListener();
        };
    }, [setLoading]);

    return loading ? <LoadingScreen /> : null;
}
