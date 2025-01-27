import env from "#start/env";
import { PaymentService } from "#services/payment_service";

export interface FleecaGatewayTokenResponse {
    token: string;
    auth_key: string;
    message: "payment_successful";
    payment: number;
    routing_from: number;
    routing_to: number;
    sandbox: boolean;
    token_expired: boolean;
    token_created_at: string;
}

export class FleecaPaymentService extends PaymentService {
    protected readonly ENCRYPTION_PURPOSE: string;

    private readonly gatewayURL: string;
    private readonly gatewayTokenURL: string;
    private readonly authKey: string;
    private readonly sandboxAuthKey: string | null;

    public constructor() {
        super();
        const fleecaBaseURL = env.get("FLEECA_BASE_URL");
        this.gatewayURL = fleecaBaseURL + "/gateway";
        this.gatewayTokenURL = fleecaBaseURL + "/gateway_token";
        this.sandboxAuthKey = env.get("FLEECA_SANDBOX_AUTH_KEY") || null;
        this.authKey = env.get("FLEECA_AUTH_KEY");
        this.ENCRYPTION_PURPOSE = env.get("FLEECA_PAYMENT_ENCRYPTION_PURPOSE");
    }

    public getPaymentAuthorizationURL({
        type = 0,
        price,
        sandbox = false,
    }: {
        type?: number;
        price: number;
        sandbox?: boolean;
    }): string {
        if (Number.isNaN(price) || price <= 0) {
            throw new Error("'price' parameter must be a number superior to 0");
        }

        if (type > 0 || type < 0) {
            console.warn(
                `Currently, only type "0" exists in Fleeca Gateway. So, type '${type}' has no effect.`,
            );
        }

        if (sandbox && !this.sandboxAuthKey) {
            throw new Error("Fleeca Gateway Sandbox Auth Key is not set.");
        }

        const authKey = sandbox ? this.sandboxAuthKey : this.authKey;

        return this.gatewayURL + `/${authKey}/${type}/${price}`;
    }

    public getPaymentTokenValidationURL({ token }: { token: string }) {
        if (!token) {
            throw Error("Cannot generate Fleeca Gateway Token URL without valid string token.");
        }

        return `${this.gatewayTokenURL}/${token}`;
    }

    public async validatePaymentToken({
        token,
        price,
        sandbox = false,
    }: {
        token: string;
        price: number;
        sandbox?: boolean;
    }): Promise<FleecaGatewayTokenResponse | null> {
        const gatewayTokenURL = this.getPaymentTokenValidationURL({ token });

        try {
            const request = await fetch(gatewayTokenURL, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!request.ok) return null;

            const response = (await request.json()) as FleecaGatewayTokenResponse;

            if (sandbox && response.auth_key !== this.sandboxAuthKey) return null;

            if (!sandbox && response.auth_key !== this.authKey) return null;

            if (response.token_expired) return null;

            if (price !== response.payment) return null;

            return response;
        } catch {
            return null;
        }
    }
}
