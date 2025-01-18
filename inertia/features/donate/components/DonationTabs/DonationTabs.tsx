import { DONATION_TYPE } from "@/features/donate/constants/donation";
import { useDonateFormContext } from "@/features/donate/hooks/useDonateFormContext";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Dispatch, SetStateAction, type SyntheticEvent } from "react";

interface DonationTabsProps {
    donationType: number;
    setDonationType: Dispatch<SetStateAction<number>>;
}

export default function DonationTabs({ donationType, setDonationType }: DonationTabsProps) {
    const { isProcessing } = useDonateFormContext();
    const { t } = useTranslation();

    const handleDonationTypeChange = useEventCallback((_: SyntheticEvent, value: number) =>
        setDonationType(value),
    );

    return (
        <Tabs
            value={donationType}
            onChange={handleDonationTypeChange}
            textColor="primary"
            indicatorColor="secondary"
            aria-disabled={isProcessing}
        >
            {Object.entries(DONATION_TYPE).map(([key, value]) => (
                <Tab
                    key={key}
                    label={t(`${key.toLowerCase()}_donation`)}
                    value={value}
                    disabled={isProcessing}
                />
            ))}
        </Tabs>
    );
}
