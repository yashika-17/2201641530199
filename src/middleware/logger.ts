interface LogEntry {
  stack: "frontend" | "backend"
  level: "debug" | "info" | "warn" | "error" | "fatal"
  pkg: string
  message: string
  timestamp: string
}

class Logger {
  private static instance: Logger
  private logs: LogEntry[] = []

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public async Log(
    stack: "frontend" | "backend",
    level: "debug" | "info" | "warn" | "error" | "fatal",
    pkg: string,
    message: string,
  ): Promise<void> {
    const logEntry: LogEntry = {
      stack,
      level,
      pkg,
      message,
      timestamp: new Date().toISOString(),
    }

    // Store locally for development
    this.logs.push(logEntry)
    console.log(`[${level.toUpperCase()}] ${pkg}: ${message}`)

    // Send to evaluation service
    try {
      const token = localStorage.getItem("access_token")
      if (token) {
        await fetch("http://20.244.56.144/evaluation-service/logs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(logEntry),
        })
      }
    } catch (error) {
      console.error("Failed to send log to evaluation service:", error)
    }
  }

  public getLogs(): LogEntry[] {
    return [...this.logs]
  }
}

export const logger = Logger.getInstance()
export const Log = logger.Log.bind(logger)
