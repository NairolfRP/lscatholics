import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { router, usePage } from "@inertiajs/react";
import Button from "@mui/material/Button";
import { type SvgIcon, useEventCallback } from "@mui/material";
import { type ComponentPropsWithRef, useRef } from "react";
import type { InferPageProps } from "@adonisjs/inertia/types";
import type ProfileController from "#controllers/profile_controller";
import Stack from "@mui/material/Stack";
import { DiscordIcon } from "@/components/icons/Discord/DiscordIcon";
import { FacebrowserIcon } from "@/components/icons/Facebrowser/FacebrowserIcon";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useTranslation } from "@/hooks/use_translation";

function ProviderIcon({
    provider,
    sx,
    ...props
}: ComponentPropsWithRef<typeof SvgIcon> & { provider: string }) {
    switch (provider) {
        case "discord":
            return <DiscordIcon sx={{ color: "#5865F2", ...sx }} {...props} />;
        case "facebrowser":
            return <FacebrowserIcon sx={{ color: "#d15454", ...sx }} {...props} />;
        default:
            return null;
    }
}

export default function Connections() {
    const { t } = useTranslation();
    const { providers } = usePage<InferPageProps<ProfileController, "show">>().props;
    const popupRef = useRef<Window | null>(null);

    const handleLink = useEventCallback((provider: string) => {
        popupRef.current = window.open(
            `/api/auth/${provider}/redirect`,
            "oauth-popup",
            "width=600,height=800",
        );

        const watchPopup = setInterval(() => {
            if (popupRef.current?.closed) {
                clearInterval(watchPopup);
                popupRef.current = null;
                router.reload();
            }
        }, 500);
    });

    const handleUnLink = useEventCallback((provider: string) => {
        if (window.confirm(t("profile.unlink_confirmation"))) {
            router.delete(`/api/auth/${provider}/unlink`, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    });

    const handleSetAsMain = useEventCallback((provider: string) => {
        if (window.confirm(t("profile.set_as_main_confirmation"))) {
            router.patch(`/api/auth/${provider}/set-main`, undefined, {
                preserveScroll: true,
                preserveState: true,
            });
        }
    });

    return (
        <Box component="section">
            <Box component="header">
                <Typography component="h2" variant="h3" gutterBottom>
                    {t("profile.connections")}
                </Typography>
            </Box>

            {providers.map((provider) => (
                <>
                    {provider.isMain ? (
                        <>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Typography variant="h5">{t("profile.main")}</Typography>
                                <ProviderIcon provider={provider.provider} />
                                <Typography fontWeight="700">
                                    {provider.provider.toUpperCase()} ({provider.username})
                                </Typography>
                            </Stack>
                        </>
                    ) : (
                        <Stack
                            key={provider.id}
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mt: 2 }}
                        >
                            <Button
                                onClick={() => handleUnLink(provider.provider)}
                                variant="contained"
                                sx={{
                                    backgroundColor:
                                        provider.provider === "discord"
                                            ? "#5865F2"
                                            : provider.provider === "facebrowser"
                                              ? "#D15454"
                                              : null,
                                }}
                                size="large"
                                startIcon={
                                    <ProviderIcon
                                        provider={provider.provider}
                                        sx={{ color: "inherit" }}
                                    />
                                }
                                endIcon={<LinkOffIcon />}
                            >
                                {t("profile.unlink", {
                                    provider: provider.provider,
                                    username: provider.username,
                                })}
                            </Button>
                            <Button
                                onClick={() => handleSetAsMain(provider.provider)}
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<VerifiedUserIcon />}
                            >
                                {t("profile.set_as_main")}
                            </Button>
                        </Stack>
                    )}
                </>
            ))}

            {!providers.some((p) => p.provider === "discord") && (
                <Button
                    sx={{ backgroundColor: "#5865F2", color: "#fff", mt: 3 }}
                    startIcon={<ProviderIcon sx={{ color: "inherit" }} provider="discord" />}
                    onClick={() => handleLink("discord")}
                >
                    {t("profile.link_discord")}
                </Button>
            )}
            {!providers.some((p) => p.provider === "facebrowser") && (
                <Button
                    sx={{ backgroundColor: "#D15454", color: "#FFF", mt: 3 }}
                    startIcon={<ProviderIcon sx={{ color: "inherit" }} provider="facebrowser" />}
                    onClick={() => handleLink("facebrowser")}
                >
                    {t("profile.link_facebrowser")}
                </Button>
            )}
        </Box>
    );
}
