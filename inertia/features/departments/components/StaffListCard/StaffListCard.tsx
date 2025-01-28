import { IStaffListCard } from "@/features/departments/types/staff_list";
import { useTranslation } from "@/hooks/use_translation";
import { CardMedia, CardMediaProps } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const StaffImage = styled(CardMedia)<CardMediaProps>(({ theme }) => ({
    ...theme.typography.body1,
    backgroundColor: "#e3550a",
    padding: "2.5rem 2rem 1.5rem",
}));

export default function StaffListCard({ name, position, image, phone, email }: IStaffListCard) {
    const { t } = useTranslation();
    return (
        <Card elevation={1} sx={{ width: "100%" }}>
            <StaffImage sx={{ backgroundImage: image ? `url(${image}` : undefined }}>
                <Typography variant="h3" color="#FFF">
                    {name}
                </Typography>
                <Typography component="p" variant="h5">
                    {t(position)}
                </Typography>
            </StaffImage>
            <CardContent>
                {phone ? (
                    <>
                        <Typography gutterBottom variant="h4" color="#e3550a">
                            {t("phone")}
                        </Typography>
                        <Typography sx={{ mb: 3 }}>{phone}</Typography>
                    </>
                ) : null}

                {email ? (
                    <>
                        <Typography gutterBottom variant="h4" color="#e3550a">
                            {t("email")}
                        </Typography>
                        <Typography>{email}</Typography>
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
}
