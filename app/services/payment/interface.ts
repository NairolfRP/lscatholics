export interface PaymentIntentMap {
    donation: DonationMetaData;
}

export interface PaymentIntent<T extends keyof PaymentIntentMap = keyof PaymentIntentMap> {
    type: T;
    price: number;
    metadata: PaymentIntentMap[T];
}

export interface DonationMetaData {
    firstname: string;
    lastname: string;
    age: number | null;
    phone: number | null;
    organization: string | null;
    anonymous: boolean;
}
