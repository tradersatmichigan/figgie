import "../css/App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Dashboard from "./Dashboard";
import React from "react";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export const assetNames = ["Dressing", "Rye", "Swiss", "Pastrami"];
export const assetAbbreviations = ["DSG", "RYE", "SWS", "PAS"];

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Dashboard />
    </ThemeProvider>
  );
}
