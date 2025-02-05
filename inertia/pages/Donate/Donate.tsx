import FormDivider from "@/components/common/FormDivider/FormDivider";
import DonationTabs from "@/features/donate/components/DonationTabs/DonationTabs";
import DonationForm from "@/features/donate/components/Form/DonationForm";
import RecurringDonationInfo from "@/features/donate/components/Recurring/RecurringDonationInfo";
import { DONATION_TYPE } from "@/features/donate/constants/donation";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Container from "@mui/material/Container";
import i18n from "i18next";
import { type ReactNode, useState } from "react";
import { PaymentProcessingProvider } from "@/features/donate/context/PaymentProcessingForm";

const Donate = () => {
    const { t } = useTranslation();
    const [donationType, setDonationType] = useState<number>(DONATION_TYPE.ONE_TIME);

    return (
        <>
            <Head title={t("donate")} />
            <Container sx={{ mb: 10, mt: 5 }}>
                <PaymentProcessingProvider>
                    <DonationTabs donationType={donationType} setDonationType={setDonationType} />
                    <FormDivider />
                    {donationType === DONATION_TYPE.RECURRING ? (
                        <RecurringDonationInfo />
                    ) : (
                        <DonationForm />
                    )}
                </PaymentProcessingProvider>
            </Container>
        </>
    );
};

// eslint-disable-next-line react/no-children-prop
Donate.layout = (page: ReactNode) => (
    <MainLayout children={page} bannerTitle={i18n.t("donate")} hideBanner />
);

export default Donate;
