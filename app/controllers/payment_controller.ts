import type { HttpContext } from "@adonisjs/core/http";

import { FleecaPaymentService } from "#services/fleeca_payment_service";
import { inject } from "@adonisjs/core";
import DonateController from "#controllers/donate_controller";
import { PaymentIntent } from "#services/payment/interface";

@inject()
export default class PaymentController {
    constructor(protected service: FleecaPaymentService) {}

    public async callback(ctx: HttpContext) {
        const { response, params, session } = ctx;

        if (!this.service.hasPaymentIntent()) {
            return response.unauthorized("401 - No pending payments");
        }

        const token = params.token as string;

        try {
            const encryptedIntent = session.get(this.service.PAYMENT_INTENT_SESSION);

            const intent = await this.service.verifyPaymentIntent(encryptedIntent);

            if (!intent) {
                return response.abort("Invalid payment intent", 400);
            }

            const paymentResponse = this.service.validatePaymentToken({
                token,
                price: intent.price,
            });

            if (!paymentResponse) return response.abort("Invalid payment", 400);

            switch (intent.type) {
                case "donation":
                    await DonateController.processDonation(
                        ctx,
                        intent as PaymentIntent<"donation">,
                    );
                    break;
                default:
                    return response.abort("Invalid payment type", 400);
            }

            this.service.deletePaymentIntent();

            session.flash("success", true);
            session.flashOnly(["success"]);
        } catch (e) {
            this.service.deletePaymentIntent();
            console.error("Error in payment callback:", e);
            session.flashErrors({ errorMessage: "Payment processing failed" });
        } finally {
            response.send("<script>window.close()</script>");
        }
    }

    public async cancel({ response }: HttpContext) {
        this.service.deletePaymentIntent();
        return response.redirect().back();
    }
}
