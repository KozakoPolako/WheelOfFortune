import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import themes from "./themes";
import AppHeader from "./components/AppHeader";
import { useState } from "react";
import WheelOfFortuneSupervisor from "./components/WheelOfFortuneSupervisor";

function App() {
  const [currentTheme, setCurrentTheme] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? themes.darkTheme
      : themes.lightTheme
  );
  function toggleTheme() {
    setCurrentTheme(
      currentTheme === themes.darkTheme ? themes.lightTheme : themes.darkTheme
    );
  }
  return (
    <>
      <ThemeProvider theme={currentTheme}>
        <CssBaseline />
        <Box component="nav">
          <AppHeader currentTheme={currentTheme} onThemeToggle={toggleTheme} />
        </Box>
        <Box component="main">
          <div style={{height:"100px"}}></div>
          <WheelOfFortuneSupervisor />
        </Box>
      </ThemeProvider>
    </>
  );
}

export default App;
