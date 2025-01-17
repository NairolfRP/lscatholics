import Link from "@/components/common/Link/Link";
import type { EventArticle } from "@/features/events/types/events";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import { CardActionArea, CardMedia } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function EventCard({ article }: { article: EventArticle }) {
    return (
        <Card
            component="article"
            sx={{ flexGrow: 1, bgcolor: "#000", color: "primary.contrastText" }}
        >
            <CardActionArea component={Link} href={article.link} sx={{ height: "100%" }}>
                <CardMedia
                    image={article.image}
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                    }}
                >
                    <CardContent
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "flex-end",
                            justifyContent: "center",
                        }}
                    >
                        <Typography
                            color="primary.contrastText"
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "primary.main",
                                p: 1,
                            }}
                            gutterBottom
                        >
                            {article.datetime}
                        </Typography>
                        <Typography
                            gutterBottom
                            variant="h2"
                            sx={{
                                typography: {
                                    xs: {
                                        fontSize: "1.8rem",
                                    },
                                },
                            }}
                            color="inherit"
                            component="div"
                        >
                            {article.title.substring(0, 50)}
                        </Typography>
                        <Typography variant="body1" color="inherit">
                            {article.description}
                        </Typography>
                        <ReadMoreIcon sx={{ position: "absolute", bottom: 15 }} />
                    </CardContent>
                </CardMedia>
            </CardActionArea>
        </Card>
    );
}
