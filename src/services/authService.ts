import { Log } from "../middleware/logger"

interface RegisterRequest {
  email: string
  name: string
  mobileNo: string
  githubUsername: string
  rollNo: string
  accessCode: string
}

interface RegisterResponse {
  clientID: string
  clientSecret: string
}

interface AuthRequest {
  email: string
  name: string
  rollNo: string
  accessCode: string
  clientID: string
  clientSecret: string
}

interface AuthResponse {
  access_token: string
}

export class AuthService {
  private static readonly BASE_URL = "http://20.244.56.144/evaluation-service"

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      Log("frontend", "info", "api", "Attempting user registration")

      const response = await fetch(`${this.BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Registration failed: ${response.statusText}`)
      }

      const result = await response.json()
      Log("frontend", "info", "api", "User registration successful")
      return result
    } catch (error) {
      Log("frontend", "error", "api", `Registration error: ${error}`)
      throw error
    }
  }

  static async authenticate(data: AuthRequest): Promise<AuthResponse> {
    try {
      Log("frontend", "info", "api", "Attempting user authentication")

      const response = await fetch(`${this.BASE_URL}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Authentication failed: ${response.statusText}`)
      }

      const result = await response.json()

      // Store token in localStorage
      localStorage.setItem("access_token", result.access_token)
      Log("frontend", "info", "api", "User authentication successful")

      return result
    } catch (error) {
      Log("frontend", "error", "api", `Authentication error: ${error}`)
      throw error
    }
  }

  static getToken(): string | null {
    return localStorage.getItem("access_token")
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
}
