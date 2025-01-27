import { test } from "@japa/runner";
import DonateController from "#controllers/donate_controller";
import { PaymentIntent } from "#services/payment/interface";
import { HttpContextFactory } from "@adonisjs/core/factories/http";
import i18nManager from "@adonisjs/i18n/services/main";

test.group("DonateController", (/*group*/) => {
    /*let paymentService: FleecaPaymentService;
    let controller: DonateController;

    group.each.setup(() => {
        paymentService = new FleecaPaymentService();
        controller = new DonateController(paymentService);
    });*/

    test("show renders Donate page", async ({ client }) => {
        const response = await client.get("/donate").withInertia();

        response.assertInertiaComponent("Donate/Donate");
    });

    test("processes donation and sends Discord notifications", async () => {
        const donationIntent: PaymentIntent<"donation"> = {
            type: "donation",
            price: 1000000,
            metadata: {
                firstname: "John",
                lastname: "Doe",
                age: 25,
                phone: 12345678,
                organization: "ACME Corp",
                anonymous: false,
            },
        };

        const ctx = new HttpContextFactory().create();

        ctx.i18n = i18nManager.locale("fr");

        const newT = (key: string, values: Record<string, unknown>) => {
            try {
                return ctx.i18n.t(key, values);
            } catch (e) {
                console.log(`${key} trigger error`, e);
            }
        };

        // @ts-expect-error Don't need more properties for this test
        await DonateController.processDonation({ i18n: { t: newT } }, donationIntent);
    });
});
