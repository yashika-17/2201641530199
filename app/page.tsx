"use client"

import type React from "react"
import { useState } from "react"
import { AppBar, Toolbar, Typography, Box, Container, Tab, Tabs } from "@mui/material"
import { Link as LinkIcon } from "@mui/icons-material"
import { Home } from "../src/pages/Home"
import { Stats } from "../src/pages/Stats"

export default function App() {
  const [currentTab, setCurrentTab] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <LinkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener - Campus Hiring
          </Typography>

          <Tabs value={currentTab} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
            <Tab label="Shortener" />
            <Tab label="Statistics" />
          </Tabs>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {currentTab === 0 && <Home />}
        {currentTab === 1 && <Stats />}
      </Container>
    </Box>
  )
}
