import { type DonatePropsForm } from "@/features/donate/types/donate_form";
import { useForm, type InertiaFormProps } from "@inertiajs/react";
import { createContext, type Dispatch, type ReactNode, type SetStateAction, useState } from "react";

type DonateFormContextType = {
    setPaymentInProgress: Dispatch<SetStateAction<boolean>>;
    isProcessing: boolean;
    form: InertiaFormProps<DonatePropsForm>;
};

export const DonateFormContext = createContext<DonateFormContextType | null>(null);

export function DonateFormProvider({ children }: { children: ReactNode }) {
    const form = useForm<DonatePropsForm>({
        firstname: "",
        lastname: "",
        age: "",
        phone: "",
        organization: "",
        anonymous: false,
        amount: 0,
        confirmation: false,
    });

    const [paymentInProgress, setPaymentInProgress] = useState(false);
    const isProcessing = paymentInProgress || form.processing;

    return (
        <DonateFormContext.Provider
            value={{
                form,
                setPaymentInProgress,
                isProcessing,
            }}
        >
            {children}
        </DonateFormContext.Provider>
    );
}
