import { useCallback, useRef } from "react";

export function usePaymentPopup() {
    const popupRef = useRef<Window | null>(null);

    const openPopup = useCallback((url: string) => {
        popupRef.current = window.open(url, "FleecaPayment", "width=600,height=600");
        return popupRef.current;
    }, []);

    const watchPopup = useCallback((onClose: () => void) => {
        const interval = setInterval(() => {
            if (popupRef.current?.closed) {
                clearInterval(interval);
                popupRef.current = null;
                onClose();
            }
        }, 500);
        return interval;
    }, []);

    return { openPopup, watchPopup };
}
