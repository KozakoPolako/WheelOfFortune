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

type Props = { onThemeToggle: () => void; currentTheme: Theme };

export default function AppHeader({ onThemeToggle, currentTheme }: Props) {
  return (
    <AppBar position="sticky">
      <Container>
        <Toolbar disableGutters>
          <Grid2 container flexGrow={1} alignItems={"center"}>
            <Grid2 xs="auto" height="50px" sx={{pr:2}}>
              <img src="/KoloFortuny_logo.png" height="50px" />
            </Grid2>
            <Grid2 xs>
              <Typography variant="h4" component="h1">
                Wheel of Fortune
              </Typography>
            </Grid2>
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
