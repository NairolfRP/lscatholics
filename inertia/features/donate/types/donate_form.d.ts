import type { Dispatch, SetStateAction } from "react";
import { InertiaFormProps } from "@inertiajs/react/types/useForm";

export type DonatePropsForm = {
    firstname: string;
    lastname: string;
    age: string;
    phone: string;
    organization: string;
    anonymous: boolean;
    amount: number;
    confirmation: boolean;
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export type AMOUNT_SELECTOR_MODE_TYPE = 0 | 1;

export interface OneTimeDonationFormProps {
    inPaymentProgress: boolean;
    setInPaymentProgress: Dispatch<SetStateAction<boolean>>;
    useForm: InertiaFormProps<DonatePropsForm>;
}
