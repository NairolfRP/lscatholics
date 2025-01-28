import type { StaffListProps } from "@/features/departments/types/staff_list";
import { useTranslation } from "@/hooks/use_translation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import StaffListCard from "../StaffListCard/StaffListCard";
import StaffListLeader from "../StaffListLeader/StaffListLeader";
import StaffListTittle from "../StaffListTitle/StaffListTitle";

export default function StaffList({ children, director, sections = [] }: StaffListProps) {
    const { t } = useTranslation();
    return (
        <>
            <StaffListTittle />
            <StaffListLeader {...director} />
            <Container>
                {sections.map((section, index) => (
                    <Box key={index} sx={{ mb: 10 }}>
                        <Typography variant="h3" component="h3" color="#e3550a" gutterBottom>
                            {t(section.title)}
                        </Typography>
                        {section.cards && section.cards.length > 0 ? (
                            <Grid container spacing={2}>
                                {section.cards.map((card, cardIndex) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={cardIndex}>
                                        <StaffListCard {...card} />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : null}
                    </Box>
                ))}
            </Container>
            {children}
        </>
    );
}
