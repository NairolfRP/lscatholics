import BackButton from "@/components/common/BackButton/BackButton";
import FormDivider from "@/components/common/FormDivider/FormDivider";
import type { Job } from "@/features/jobs/types/jobs";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Form from "@/pages/ApplyJob/Parts/Form";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const ApplyJob = ({ job }: { job: Job }) => {
    const { t } = useTranslation();

    return (
        <MainLayout hideBanner>
            <Container sx={{ mt: 15, mb: 35 }}>
                <Box sx={{ mb: 5 }}>
                    <BackButton to="jobs">{t("job_button_back")}</BackButton>
                </Box>

                <Typography variant="h3">
                    {job.title} ({job.organization})
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {job.location}
                </Typography>

                <FormDivider />

                <Typography gutterBottom>{t("job_application_archdiocese_policy_description")}</Typography>

                <Form jobID={job.id} />
            </Container>
        </MainLayout>
    );
};

// eslint-disable-next-line react/no-children-prop
ApplyJob.layout = (page: React.ReactNode) => <MainLayout children={page} hideBanner />;

export default ApplyJob;
