import {
    createContext,
    type Dispatch,
    type PropsWithChildren,
    type SetStateAction,
    useContext,
    useState,
} from "react";

type ContextType = {
    setPaymentInProgress: Dispatch<SetStateAction<boolean>>;
    isPaymentProcessing: boolean;
};

export const PaymentProcessingContext = createContext<ContextType>({
    setPaymentInProgress: () => {},
    isPaymentProcessing: false,
});

export function PaymentProcessingProvider({ children }: PropsWithChildren<{}>) {
    const [paymentInProgress, setPaymentInProgress] = useState(false);

    return (
        <PaymentProcessingContext
            value={{
                setPaymentInProgress,
                isPaymentProcessing: paymentInProgress,
            }}
        >
            {children}
        </PaymentProcessingContext>
    );
}

export const usePaymentProcessing = () => useContext(PaymentProcessingContext);
