"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material"
import { Analytics, Link as LinkIcon, AccessTime, Mouse, ContentCopy, OpenInNew } from "@mui/icons-material"
import { urlService, type ShortenedUrl } from "../services/urlService"
import { Log } from "../middleware/logger"

export const UrlStats: React.FC = () => {
  const [urls, setUrls] = useState<ShortenedUrl[]>([])

  useEffect(() => {
    loadUrls()
    Log("frontend", "info", "component", "Statistics page loaded")
  }, [])

  const loadUrls = () => {
    try {
      const allUrls = urlService.getAllUrls()
      setUrls(allUrls)
      Log("frontend", "info", "component", `Loaded ${allUrls.length} URLs for statistics`)
    } catch (error) {
      Log("frontend", "error", "component", `Failed to load URL statistics: ${error}`)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      Log("frontend", "info", "component", "URL copied from statistics page")
    } catch (err) {
      Log("frontend", "error", "component", "Failed to copy URL from statistics")
    }
  }

  const isExpired = (expiresAt: Date): boolean => {
    return new Date() > expiresAt
  }

  const formatDuration = (createdAt: Date, expiresAt: Date): string => {
    const diffMs = expiresAt.getTime() - createdAt.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 60) return `${diffMins}m`
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ${diffMins % 60}m`
    return `${Math.floor(diffMins / 1440)}d ${Math.floor((diffMins % 1440) / 60)}h`
  }

  if (urls.length === 0) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Analytics sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No URLs Shortened Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Start by shortening some URLs to see statistics here.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Analytics color="primary" />
        URL Statistics
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track performance and manage your shortened URLs.
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary">
              {urls.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total URLs
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" color="success.main">
              {urls.filter((url) => !isExpired(url.expiresAt)).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active URLs
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" color="info.main">
              {urls.reduce((sum, url) => sum + url.clicks, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Clicks
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" color="warning.main">
              {urls.filter((url) => isExpired(url.expiresAt)).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Expired URLs
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* URLs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Shortened URLs
          </Typography>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Clicks</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <LinkIcon fontSize="small" color="primary" />
                        <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                          /{url.shortCode}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Tooltip title={url.originalUrl}>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {url.originalUrl}
                        </Typography>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{url.createdAt.toLocaleDateString()}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {url.createdAt.toLocaleTimeString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2">{url.expiresAt.toLocaleDateString()}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {url.expiresAt.toLocaleTimeString()}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip label={formatDuration(url.createdAt, url.expiresAt)} size="small" icon={<AccessTime />} />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Mouse fontSize="small" />
                        <Typography variant="body2" fontWeight="medium">
                          {url.clicks}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={isExpired(url.expiresAt) ? "Expired" : "Active"}
                        size="small"
                        color={isExpired(url.expiresAt) ? "error" : "success"}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Copy Short URL">
                          <IconButton size="small" onClick={() => copyToClipboard(url.shortUrl)}>
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Open Original URL">
                          <IconButton size="small" onClick={() => window.open(url.originalUrl, "_blank")}>
                            <OpenInNew fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Click Details for URLs with clicks */}
      {urls.some((url) => url.clicks > 0) && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Click Activity
            </Typography>

            {urls
              .filter((url) => url.clickDetails.length > 0)
              .slice(0, 5)
              .map((url) => (
                <Box key={url.id} sx={{ mb: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    /{url.shortCode} → {url.originalUrl.substring(0, 50)}...
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {url.clickDetails.slice(-3).map((click, index) => (
                      <Chip
                        key={index}
                        label={`${click.timestamp.toLocaleString()} - ${click.source}`}
                        size="small"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              ))}
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
