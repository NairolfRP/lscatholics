import Link from "@/components/common/Link/Link";
import { departments } from "@/features/departments/constants/departments_list";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function Department({
    name,
    description,
    isExternalLink = false,
    link,
}: {
    name: string;
    description: string;
    isExternalLink?: boolean;
    link?: string;
}) {
    const { t } = useTranslation();
    return (
        <Box sx={{ mb: 5 }}>
            <strong>{name}:</strong>
            <Typography>{description}</Typography>
            {link ? (
                <Link href={isExternalLink ? link : `/departments/${link}`}>{t("learn_more")}</Link>
            ) : null}
        </Box>
    );
}

export default function Departments() {
    const { t } = useTranslation();

    const departmentsInAlphabeticalOrder = [...departments].sort((a, b) =>
        t(a.name).localeCompare(t(b.name)),
    );

    return (
        <MainLayout bannerTitle={t("archdiocesan_departments")}>
            <Head title={t("archdiocesan_departments")} />
            <Container sx={{ mt: 10, mb: 15 }}>
                <Typography gutterBottom variant="h2">
                    {t("archdiocesan_departments_alphabetical_order")}
                </Typography>

                {departmentsInAlphabeticalOrder.map((dep, depIndex) => (
                    <Department
                        key={depIndex}
                        name={t(dep.name)}
                        isExternalLink={dep.isExternalLink}
                        link={dep.link}
                        description={t(`${dep.name}_description`)}
                    />
                ))}
            </Container>
        </MainLayout>
    );
}
