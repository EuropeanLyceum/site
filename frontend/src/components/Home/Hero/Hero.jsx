import {Box, Typography} from "@mui/material";
import Image from "next/image";
import logo from "@/assets/photos/icons/logo_without_background.ico.png";
import {useTranslation} from "@/contexts/TranslationProvider";

export default function Hero() {
    const {t} = useTranslation();

    return (
        <Box className="container">
            <Box className="background">
                <Box className="gradient-bg"/>
                <Box className="logo-image-bg">
                    <Image src={logo} alt="Background Logo"/>
                </Box>
            </Box>

            <Box className="content">
                <Box className="text-container">
                    <Box className="text-box">
                        <Typography variant="h1" sx={{fontSize: "80px"}} className="welcome-text">
                            {t("welcome")}
                        </Typography>

                        <Typography sx={{whiteSpace: "pre-line"}}>
                            {t("welcomeDescription")}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
        ;
}