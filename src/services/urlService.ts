import { Log } from "../middleware/logger"

export interface ShortenedUrl {
  id: string
  originalUrl: string
  shortCode: string
  shortUrl: string
  createdAt: Date
  expiresAt: Date
  clicks: number
  clickDetails: ClickDetail[]
}

export interface ClickDetail {
  timestamp: Date
  source: string
  location: string
}

class UrlService {
  private urls: Map<string, ShortenedUrl> = new Map()
  private static instance: UrlService

  private constructor() {
    // Load from localStorage if available
    this.loadFromStorage()
  }

  public static getInstance(): UrlService {
    if (!UrlService.instance) {
      UrlService.instance = new UrlService()
    }
    return UrlService.instance
  }

  private saveToStorage(): void {
    try {
      const urlsArray = Array.from(this.urls.entries())
      localStorage.setItem("shortened_urls", JSON.stringify(urlsArray))
    } catch (error) {
      Log("frontend", "error", "component", "Failed to save URLs to storage")
    }
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem("shortened_urls")
      if (stored) {
        const urlsArray = JSON.parse(stored)
        this.urls = new Map(
          urlsArray.map(([key, value]: [string, any]) => [
            key,
            {
              ...value,
              createdAt: new Date(value.createdAt),
              expiresAt: new Date(value.expiresAt),
              clickDetails: value.clickDetails.map((click: any) => ({
                ...click,
                timestamp: new Date(click.timestamp),
              })),
            },
          ]),
        )
      }
    } catch (error) {
      Log("frontend", "error", "component", "Failed to load URLs from storage")
    }
  }

  private generateShortCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = ""
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  private isValidShortCode(shortCode: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(shortCode) && shortCode.length >= 3 && shortCode.length <= 10
  }

  public shortenUrl(originalUrl: string, validityMinutes = 30, customShortCode?: string): ShortenedUrl {
    try {
      // Validate URL
      if (!this.isValidUrl(originalUrl)) {
        Log("frontend", "error", "api", "Invalid URL entered by user")
        throw new Error("Invalid URL format")
      }

      // Generate or validate short code
      let shortCode: string
      if (customShortCode) {
        if (!this.isValidShortCode(customShortCode)) {
          Log("frontend", "error", "api", "Invalid custom shortcode format")
          throw new Error("Invalid shortcode format. Use alphanumeric characters only.")
        }
        if (this.urls.has(customShortCode)) {
          Log("frontend", "error", "api", "Shortcode collision detected")
          throw new Error("Shortcode already exists. Please choose a different one.")
        }
        shortCode = customShortCode
      } else {
        do {
          shortCode = this.generateShortCode()
        } while (this.urls.has(shortCode))
      }

      const now = new Date()
      const expiresAt = new Date(now.getTime() + validityMinutes * 60 * 1000)

      const shortenedUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl,
        shortCode,
        shortUrl: `http://localhost:3000/${shortCode}`,
        createdAt: now,
        expiresAt,
        clicks: 0,
        clickDetails: [],
      }

      this.urls.set(shortCode, shortenedUrl)
      this.saveToStorage()

      Log("frontend", "info", "api", `URL shortened successfully: ${shortCode}`)
      return shortenedUrl
    } catch (error) {
      Log("frontend", "error", "api", `URL shortening failed: ${error}`)
      throw error
    }
  }

  public getOriginalUrl(shortCode: string): string | null {
    try {
      const urlData = this.urls.get(shortCode)

      if (!urlData) {
        Log("frontend", "warn", "api", `Short URL not found: ${shortCode}`)
        return null
      }

      if (new Date() > urlData.expiresAt) {
        Log("frontend", "warn", "api", `Expired short URL accessed: ${shortCode}`)
        return null
      }

      // Record click
      urlData.clicks++
      urlData.clickDetails.push({
        timestamp: new Date(),
        source: "direct",
        location: "localhost",
      })

      this.saveToStorage()
      Log("frontend", "info", "api", `Short URL redirected: ${shortCode}`)

      return urlData.originalUrl
    } catch (error) {
      Log("frontend", "error", "api", `URL retrieval failed: ${error}`)
      return null
    }
  }

  public getAllUrls(): ShortenedUrl[] {
    return Array.from(this.urls.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  public getUrlByShortCode(shortCode: string): ShortenedUrl | null {
    return this.urls.get(shortCode) || null
  }
}

export const urlService = UrlService.getInstance()
