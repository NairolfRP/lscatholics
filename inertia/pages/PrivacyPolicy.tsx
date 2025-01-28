import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const DISCORD_URL = "https://discord.com";
const FACEBROWSER_URL = "https://facebrowser.gta.world";

export default function PrivacyPolicy() {
    const { t } = useTranslation();

    return (
        <MainLayout bannerTitle={t("privacy_policy")}>
            <Head title={t("privacy_policy")} />
            <Container sx={{ mt: 5, mb: 15 }}>
                <Alert severity="warning">
                    Contrairement au reste du site, cette page n&#39;est pas fictive.
                </Alert>

                <Box mt={3}>
                    <Typography variant="h3" gutterBottom>
                        1. Informations Collectées
                    </Typography>
                    <Typography component="p" variant="body1">
                        Lors de l’utilisation de notre site, nous collectons uniquement les
                        informations nécessaires à l&apos;authentification des utilisateurs via{" "}
                        <Link href={DISCORD_URL} target="_blank">
                            Discord
                        </Link>{" "}
                        ou{" "}
                        <Link href={FACEBROWSER_URL} target="_blank">
                            Facebrowser
                        </Link>
                        . Les données collectées sont les suivantes :
                    </Typography>
                    <ul>
                        <li>
                            <Typography variant="body1">
                                <strong>Nom d’utilisateur :</strong> pseudonyme Facebrowser ou
                                Discord
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                <strong>Identifiant unique :</strong> ID du compte Facebrowser ou
                                Discord
                            </Typography>
                        </li>
                    </ul>
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
                    <ul>
                        <li>
                            <Typography variant="body1">
                                Permettre l’accès sécurisé aux fonctionnalités du site
                            </Typography>
                        </li>
                        <li>
                            <Typography variant="body1">
                                Gérer et maintenir votre compte utilisateur
                            </Typography>
                        </li>
                    </ul>
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
