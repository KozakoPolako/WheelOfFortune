import {
  AppBar,
  Button,
  Container,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import themes from "../themes";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useRef, useState } from "react";
import DownloadingIcon from "@mui/icons-material/Downloading";
import CheckIcon from "@mui/icons-material/Check";

type Props = { onThemeToggle: () => void; currentTheme: Theme };

export default function AppHeader({ onThemeToggle, currentTheme }: Props) {
  const [isInstallSupported, setIsInstallSupported] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  const installPrompt = useRef<Event & { prompt?: () => Promise<string> }>();

  document.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installPrompt.current = e;
    setIsInstallSupported(true);
  });
  window.addEventListener("appinstalled", () => {
    setIsAppInstalled(true);
  });

  function triggerInstalation() {
    if (!installPrompt.current || !installPrompt.current.prompt) return;
    installPrompt.current.prompt();
  }

  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar disableGutters>
          <Grid2 container flexGrow={1} alignItems={"center"}>
            <Grid2 xs="auto" height="50px" sx={{ pr: 2 }}>
              <img src="./KoloFortuny_logo.png" height="50px" />
            </Grid2>
            <Grid2 xs>
              <Typography variant="h4" component="h1">
                Wheel of Fortune
              </Typography>
            </Grid2>
            {isInstallSupported ? (
              <Grid2 xs="auto">
                <Button
                  disabled={isAppInstalled}
                  sx={{ borderRadius: 5 }}
                  startIcon={
                    isAppInstalled ? <CheckIcon /> : <DownloadingIcon />
                  }
                  onClick={triggerInstalation}
                >
                  {isAppInstalled ? "Installed" : "Install"}
                </Button>
              </Grid2>
            ) : null}
            <Grid2 xs="auto">
              <Button onClick={onThemeToggle} sx={{ color: "white" }}>
                {currentTheme == themes.darkTheme ? (
                  <LightModeIcon />
                ) : (
                  <DarkModeIcon />
                )}
              </Button>
            </Grid2>
          </Grid2>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
