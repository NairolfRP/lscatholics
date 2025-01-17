import BackButton from "@/components/common/BackButton/BackButton";
import type { Job } from "@/features/jobs/types/jobs";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import type { PageProps } from "@/types/pageProps";
import { formatStringDate, getJobCategoryColor } from "@/utils/helpers";
import { Head, router } from "@inertiajs/react";
import CloseIcon from "@mui/icons-material/Close";
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove";
import { Divider, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

function InformationLabel({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
    if (label && value) {
        return (
            <Box>
                <Typography
                    gutterBottom
                    color="secondary"
                    textAlign="center"
                    fontWeight="800"
                    textTransform="uppercase"
                >
                    {label}
                </Typography>{" "}
                <Typography>{value}</Typography>
            </Box>
        );
    }

    return null;
}

function JobDescriptionLabel({
    label,
    value,
    id,
}: {
    label: React.ReactNode;
    value: React.ReactNode;
    id?: string;
}) {
    if (label && value) {
        return (
            <Box id={id} sx={{ mt: 5 }}>
                <Typography
                    component="h2"
                    variant="h4"
                    gutterBottom
                    color="primary"
                    fontWeight="800"
                    textTransform="uppercase"
                >
                    {label}
                </Typography>{" "}
                <Typography textAlign="justify">{value}</Typography>
            </Box>
        );
    }

    return null;
}

export default function SingleJob({ job }: PageProps<{ job: Job }>) {
    const { t } = useTranslation();

    const handleJobApplyButton = useEventCallback(() => {
        router.visit(`/job/apply/${job.id}`);
    });

    return (
        <MainLayout bannerTitle={job.title} bannerColor={getJobCategoryColor(job.category)}>
            <Head title={job.title} />

            <Container sx={{ mt: 5, mb: 25 }}>
                <BackButton to="/jobs" sx={{ mb: 3 }}>
                    {t("job_button_back")}
                </BackButton>

                <Grid container direction={{ sm: "row", xs: "column" }}>
                    <Grid
                        container
                        size={{ sm: 6, xs: 12 }}
                        sx={{ display: "flex" }}
                        alignItems="flex-end"
                        justifyContent="flex-start"
                        spacing={2}
                    >
                        <Grid>
                            <InformationLabel
                                label={t("created_at")}
                                value={t("date", formatStringDate(job.createdAt))}
                            />
                        </Grid>
                        <Grid>
                            {job.isOpen ? (
                                <InformationLabel
                                    label={t("expires")}
                                    value={t("date", formatStringDate(job.expiration))}
                                />
                            ) : (
                                <InformationLabel
                                    label={t("statut")}
                                    value={
                                        <Typography
                                            textTransform="uppercase"
                                            fontWeight="800"
                                            color="error"
                                        >
                                            <Stack direction="row" alignItems="center">
                                                <CloseIcon />
                                                {t("closed")}
                                            </Stack>
                                        </Typography>
                                    }
                                />
                            )}
                        </Grid>
                    </Grid>
                    <Grid
                        container
                        size={{ sm: 6, xs: 12 }}
                        sx={{ display: "flex" }}
                        alignItems="flex-end"
                        justifyContent="flex-end"
                        spacing={2}
                    >
                        <Grid>
                            <InformationLabel
                                label={t("organization_department")}
                                value={job.organization}
                            />
                        </Grid>
                        <Grid>
                            <InformationLabel label={t("location")} value={job.location} />
                        </Grid>
                    </Grid>
                </Grid>

                <Divider sx={{ mt: 3 }} />

                <Box sx={{ mt: 3 }}>
                    <JobDescriptionLabel
                        id="description"
                        label={t("description")}
                        value={job.description}
                    />
                    <JobDescriptionLabel
                        id="requirements"
                        label={t("requirements")}
                        value={job.requirements}
                    />
                    <JobDescriptionLabel id="wage" label={t("wage_range")} value={job.wage} />
                </Box>

                <Box id="application" sx={{ mt: 5 }}>
                    <Button
                        onClick={handleJobApplyButton}
                        startIcon={<DriveFileMoveIcon />}
                        color="secondary"
                        variant="contained"
                        rel="noopener noreferrer"
                        disabled={!job.isOpen}
                    >
                        {t("job_apply_button")}
                    </Button>
                </Box>
            </Container>
        </MainLayout>
    );
}
