import { HttpContext } from "@adonisjs/core/http";
import encryption from "@adonisjs/core/services/encryption";
import { PaymentIntent, PaymentIntentMap } from "#services/payment/interface";

export class PaymentService {
    protected readonly PAYMENT_EXPIRATION: string = "15 minutes" as const;
    protected readonly ENCRYPTION_PURPOSE: string = "";

    public readonly PAYMENT_INTENT_SESSION = "payment_intent" as const;

    public createPaymentIntent<T extends keyof PaymentIntentMap>(
        payload: PaymentIntent<T>,
    ): string {
        const ctx = HttpContext.getOrFail();

        if (this.hasPaymentIntent()) {
            throw Error("This session already exists. Forget it first.");
        }

        const encrypted = encryption.encrypt(
            payload,
            this.PAYMENT_EXPIRATION,
            this.ENCRYPTION_PURPOSE,
        );

        ctx.session.put(this.PAYMENT_INTENT_SESSION, encrypted);

        return encrypted;
    }

    public async verifyPaymentIntent<T extends keyof PaymentIntentMap>(
        encryptedIntent: string,
    ): Promise<PaymentIntent<T> | null> {
        return encryption.decrypt(encryptedIntent, this.ENCRYPTION_PURPOSE);
    }

    public getPaymentAuthorizationURL(..._options: any[]) {
        return "";
    }

    public getPaymentTokenValidationURL(..._options: any[]): string {
        return "";
    }

    public async validatePaymentToken(
        _options: { token: string } & Record<string, any>,
    ): Promise<any> {
        return null;
    }

    public deletePaymentIntent() {
        const ctx = HttpContext.getOrFail();

        if (ctx.session.has(this.PAYMENT_INTENT_SESSION)) {
            ctx.session.forget(this.PAYMENT_INTENT_SESSION);
        }
    }

    public hasPaymentIntent() {
        const ctx = HttpContext.getOrFail();

        return ctx.session.has(this.PAYMENT_INTENT_SESSION);
    }
}
