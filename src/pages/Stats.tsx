import type React from "react"
import { Container, Box } from "@mui/material"
import { UrlStats } from "../components/UrlStats"

export const Stats: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <UrlStats />
      </Box>
    </Container>
  )
}
