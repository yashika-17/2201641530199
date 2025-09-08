"use client"

import type React from "react"
import { useState } from "react"
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Snackbar,
  InputAdornment,
  Chip,
} from "@mui/material"
import { Link as LinkIcon, ContentCopy, Timer } from "@mui/icons-material"
import { urlService, type ShortenedUrl } from "../services/urlService"
import { Log } from "../middleware/logger"

export const UrlShortener: React.FC = () => {
  const [longUrl, setLongUrl] = useState("")
  const [customShortCode, setCustomShortCode] = useState("")
  const [validityMinutes, setValidityMinutes] = useState(30)
  const [result, setResult] = useState<ShortenedUrl | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const validateInputs = (): boolean => {
    if (!longUrl.trim()) {
      setError("Please enter a URL")
      return false
    }

    if (validityMinutes < 1 || validityMinutes > 10080) {
      // Max 1 week
      setError("Validity must be between 1 and 10080 minutes")
      return false
    }

    if (customShortCode && (customShortCode.length < 3 || customShortCode.length > 10)) {
      setError("Custom shortcode must be between 3-10 characters")
      return false
    }

    if (customShortCode && !/^[a-zA-Z0-9]+$/.test(customShortCode)) {
      setError("Custom shortcode can only contain letters and numbers")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)

    if (!validateInputs()) {
      Log("frontend", "warn", "component", "Form validation failed")
      return
    }

    setLoading(true)

    try {
      Log("frontend", "info", "component", "Attempting to shorten URL")

      const shortenedUrl = urlService.shortenUrl(longUrl, validityMinutes, customShortCode || undefined)

      setResult(shortenedUrl)
      Log("frontend", "info", "component", "URL shortened successfully")

      // Reset form
      setLongUrl("")
      setCustomShortCode("")
      setValidityMinutes(30)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to shorten URL"
      setError(errorMessage)
      Log("frontend", "error", "component", `URL shortening error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setSnackbarOpen(true)
      Log("frontend", "info", "component", "Short URL copied to clipboard")
    } catch (err) {
      Log("frontend", "error", "component", "Failed to copy to clipboard")
    }
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LinkIcon color="primary" />
            URL Shortener
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Transform long URLs into short, shareable links with custom expiration times.
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              label="Long URL"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/path"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LinkIcon color="action" />
                  </InputAdornment>
                ),
              }}
              required
            />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Custom Short Code (Optional)"
                value={customShortCode}
                onChange={(e) => setCustomShortCode(e.target.value)}
                placeholder="mylink"
                helperText="3-10 alphanumeric characters"
                sx={{ flex: 1, minWidth: 200 }}
              />

              <TextField
                label="Validity (Minutes)"
                type="number"
                value={validityMinutes}
                onChange={(e) => setValidityMinutes(Number(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Timer color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ flex: 1, minWidth: 150 }}
                inputProps={{ min: 1, max: 10080 }}
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.5 }}>
              {loading ? "Shortening..." : "Shorten URL"}
            </Button>
          </Box>

          {result && (
            <Card sx={{ mt: 3, bgcolor: "success.light", color: "success.contrastText" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ✅ URL Shortened Successfully!
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <TextField
                    fullWidth
                    value={result.shortUrl}
                    InputProps={{
                      readOnly: true,
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            size="small"
                            onClick={() => copyToClipboard(result.shortUrl)}
                            startIcon={<ContentCopy />}
                          >
                            Copy
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    variant="outlined"
                    sx={{ bgcolor: "white" }}
                  />
                </Box>

                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  <Chip label={`Expires: ${result.expiresAt.toLocaleString()}`} size="small" color="default" />
                  <Chip label={`Short Code: ${result.shortCode}`} size="small" color="default" />
                </Box>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Copied to clipboard!"
      />
    </Box>
  )
}
