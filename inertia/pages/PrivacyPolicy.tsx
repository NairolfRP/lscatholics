import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Head from "@/components/AppHead";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const DISCORD_URL = "https://discord.com";
const GTAW_URL = "https://gta.world";

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <MainLayout hideBanner>
            <Head title={t("privacy_policy")} />
            <Container sx={{ mt: 5, mb: 15 }}>
                <Alert severity="warning">
                    Contrairement au reste du site, cette page n&#39;est pas fictive.
                </Alert>

                <Box mt={3}>
                    <Typography variant="h2" gutterBottom>
                        {t("privacy_policy")}
                    </Typography>
                    <Divider sx={{ mb: 5 }} />
                    <Typography variant="h3" gutterBottom>
                        1. Informations Collectées
                    </Typography>
                    <Typography component="p" variant="body1">
                        Lors de l’utilisation de notre site, nous collectons uniquement les
                        informations nécessaires à l&apos;authentification des utilisateurs via
                        l'API de{" "}
                        <Link href={GTAW_URL} target="_blank">
                            GTA World
                        </Link>{" "}
                        . Après l'inscription, l'utilisateur peut aussi, de manière optionnelle,
                        lier son compte utilisateur{" "}
                        <Link href={DISCORD_URL} target="_blank">
                            Discord
                        </Link>
                        . Les données collectées sont les suivantes :
                    </Typography>
                    <List sx={{ pl: 2 }}>
                        <ListItem disablePadding>
                            <ListItemText>
                                <strong>Nom d’utilisateur :</strong> pseudonyme GTA World et/ou
                                Discord
                            </ListItemText>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemText>
                                <strong>Identifiant unique :</strong> ID du compte GTA World et/ou
                                Discord
                            </ListItemText>
                        </ListItem>
                    </List>
                    <Typography component="p" variant="body1">
                        Ces informations sont exclusivement utilisées pour l’identification et la
                        gestion des comptes sur notre site.
                    </Typography>
                </Box>

                <Box mt={3}>
                    <Typography variant="h3" gutterBottom>
                        2. Utilisation des Données
                    </Typography>
                    <Typography component="p" variant="body1">
                        Les informations collectées servent uniquement à :
                    </Typography>
                    <List sx={{ listStyle: "decimal", pl: 4 }}>
                        <ListItem sx={{ display: "list-item" }} disablePadding>
                            <ListItemText>
                                Permettre l’accès sécurisé aux fonctionnalités du site
                            </ListItemText>
                        </ListItem>
                        <ListItem sx={{ display: "list-item" }} disablePadding>
                            <ListItemText>Gérer et maintenir votre compte utilisateur</ListItemText>
                        </ListItem>
                    </List>
                    <Typography component="p" variant="body1">
                        Aucune autre information n’est demandée ni stockée, et vos données ne sont
                        jamais partagées ni vendues à des tiers.
                    </Typography>
                </Box>

                <Box mt={3}>
                    <Typography variant="h3" gutterBottom>
                        3. Cookies
                    </Typography>
                    <Typography component="p" variant="body1">
                        Notre site utilise des cookies pour permettre une connexion sécurisée et
                        maintenir la session utilisateur. Ces cookies sont nécessaires au bon
                        fonctionnement du site et ne contiennent pas d’informations personnelles
                        sensibles.
                    </Typography>
                </Box>

                <Box mt={3}>
                    <Typography variant="h3" gutterBottom>
                        4. Suppression des Comptes
                    </Typography>
                    <Typography component="p" variant="body1">
                        Vous avez la possibilité de supprimer votre compte à tout moment depuis les
                        paramètres de votre profil. La suppression de votre compte entraîne la
                        suppression définitive de toutes les informations associées (nom
                        d’utilisateur et identifiant unique).
                    </Typography>
                </Box>

                <Box mt={3}>
                    <Typography variant="h3" gutterBottom>
                        5. Modifications de cette Politique
                    </Typography>
                    <Typography component="p" variant="body1">
                        Cette politique de confidentialité peut être mise à jour pour refléter les
                        changements de nos pratiques ou des exigences légales.
                    </Typography>
                </Box>
            </Container>
        </MainLayout>
    );
}
