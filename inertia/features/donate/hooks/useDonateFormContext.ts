import { useContext } from "react";
import { DonateFormContext } from "../context/DonateFormContext";

export function useDonateFormContext() {
    const context = useContext(DonateFormContext);
    if (!context) {
        throw new Error("useDonateFormContext must be used within a DonateFormProvider");
    }

    return context;
}
