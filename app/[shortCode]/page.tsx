"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { Box, Typography, CircularProgress } from "@mui/material"
import { urlService } from "../../src/services/urlService"
import { Log } from "../../src/middleware/logger"

export default function RedirectPage() {
  const params = useParams()
  const shortCode = params.shortCode as string

  useEffect(() => {
    if (shortCode) {
      Log("frontend", "info", "handler", `Redirect attempt for shortcode: ${shortCode}`)

      const originalUrl = urlService.getOriginalUrl(shortCode)

      if (originalUrl) {
        Log("frontend", "info", "handler", `Redirecting to: ${originalUrl}`)
        window.location.href = originalUrl
      } else {
        Log("frontend", "warn", "handler", `Invalid or expired shortcode: ${shortCode}`)
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      }
    }
  }, [shortCode])

  const originalUrl = urlService.getOriginalUrl(shortCode)

  if (!originalUrl) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          p: 3,
        }}
      >
        <Typography variant="h4" color="error" gutterBottom>
          Link Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          The short link you're looking for doesn't exist or has expired.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Redirecting to home page in 3 seconds...
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Redirecting...
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Taking you to your destination
      </Typography>
    </Box>
  )
}
