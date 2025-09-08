import type React from "react"
import { Container, Box } from "@mui/material"
import { UrlShortener } from "../components/UrlShortener"

export const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <UrlShortener />
      </Box>
    </Container>
  )
}
