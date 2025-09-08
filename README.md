# URL Shortener 

A React-based URL Shortener Web App built for campus hiring evaluation with Material UI and comprehensive logging.

## 🚀 Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Optional custom alphanumeric short codes
- **Expiration Control**: Set validity period (default 30 minutes)
- **Click Tracking**: Monitor clicks with timestamps and source details
- **Statistics Dashboard**: View all URLs, click counts, and activity
- **Robust Validation**: Client-side URL and shortcode validation
- **Logging Middleware**: Comprehensive logging for all actions
- **Responsive Design**: Material UI components with mobile support

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material UI v5
- **Routing**: Next.js App Router
- **State Management**: Local state with localStorage persistence
- **Logging**: Custom middleware with evaluation service integration
- **Styling**: Material UI theme system

## 📁 Project Structure

\`\`\`
/src
  /components
    UrlShortener.tsx    # Main URL shortening component
    UrlStats.tsx        # Statistics and analytics component
  /middleware
    logger.ts           # Logging middleware implementation
  /services
    authService.ts      # Authentication service for evaluation server
    urlService.ts       # URL shortening business logic
  /pages
    Home.tsx           # Home page wrapper
    Stats.tsx          # Statistics page wrapper
  /theme
    theme.ts           # Material UI theme configuration
/app
  layout.tsx           # Root layout with Material UI setup
  page.tsx            # Main app with navigation
  [shortCode]/page.tsx # Dynamic redirect handler
\`\`\`

## 🔧 Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Start Development Server

\`\`\`bash
npm run dev
\`\`\`

The app will be available at `http://localhost:3000`

### 3. Test Server Registration (Optional)

For full evaluation server integration:

1. **Register your application**:
   \`\`\`bash
   curl -X POST http://20.244.56.144/evaluation-service/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "yashika.psit.edu@gmail.com",
       "name": "Yashika Agnihotri",
       "mobileNo": "6394223253",
       "githubUsername": "yashika-17",
       "rollNo": "2201641530199",
       "accessCode": "sAWTuR"
     }'
   \`\`\`

2. **Authenticate and get access token**:
   \`\`\`bash
   curl -X POST http://20.244.56.144/evaluation-service/auth \
     -H "Content-Type: application/json" \
     -d '{
       "email": "yashika.psit.edu@gmail.com",
       "name": "Yashika Agnihotri",
       "rollNo": "2201641530199",
       "accessCode": "sAWTuR",
       "clientID": "5e27c57f-f1d0-41a0-9c49-7b5dd5cbb178",
       "clientSecret": "cCtHmrcASpeBGEus"
     }'
   \`\`\`

The access token will be automatically stored in localStorage for logging integration.

## 🎯 Usage

### Shortening URLs

1. Navigate to the home page
2. Enter a long URL in the input field
3. Optionally set:
   - Custom short code (3-10 alphanumeric characters)
   - Validity period in minutes (default: 30)
4. Click "Shorten URL"
5. Copy the generated short link

### Viewing Statistics

1. Click the "Statistics" tab
2. View summary cards showing:
   - Total URLs created
   - Active vs expired URLs
   - Total click count
3. Browse the detailed table with:
   - Short codes and original URLs
   - Creation and expiration times
   - Click counts and activity
4. Use action buttons to copy URLs or open original links

### URL Redirection

- Visit `http://localhost:3000/{shortCode}` to be redirected
- Expired or invalid links show an error message
- All redirections are logged and tracked

## 🔍 Key Features

### Validation
- URL format validation using native URL constructor
- Custom shortcode validation (alphanumeric, 3-10 chars)
- Uniqueness checking for custom shortcodes
- Expiration time validation

### Error Handling
- Invalid URL format detection
- Shortcode collision prevention
- Expired link handling
- Network error management
- User-friendly error messages

### Logging Integration
- All major actions logged with appropriate levels
- Integration with evaluation service logging API
- Local logging fallback for development
- Structured log format with timestamps

### Data Persistence
- URLs stored in localStorage for session persistence
- Click tracking with detailed timestamps
- Automatic cleanup of expired URLs
- Export-ready data structure

## 🏗️ Architecture

### Component Design
- **UrlShortener**: Handles URL input, validation, and shortening
- **UrlStats**: Displays analytics and manages URL data
- **Logger**: Centralized logging with evaluation service integration
- **UrlService**: Business logic for URL operations and storage

### Data Flow
1. User input → Validation → URL Service
2. URL Service → Local Storage + Logging
3. Statistics Component → URL Service → Display
4. Redirect Handler → URL Service → Navigation

### Error Boundaries
- Form validation with immediate feedback
- Network error handling with retry logic
- Graceful degradation for offline usage
- Comprehensive error logging

## 📊 Logging

The application implements comprehensive logging using the `Log(stack, level, pkg, message)` function:

- **Levels**: debug, info, warn, error, fatal
- **Packages**: api, component, handler
- **Integration**: Automatic sending to evaluation service
- **Fallback**: Console logging for development

Example logs:
- `Log("frontend", "info", "api", "URL shortened successfully")`
- `Log("frontend", "error", "component", "Invalid URL entered by user")`
- `Log("frontend", "warn", "handler", "Expired short URL accessed")`

## 🚀 Deployment

For production deployment:

1. Build the application:
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server:
   \`\`\`bash
   npm start
   \`\`\`

3. Configure environment variables for the evaluation service endpoints if needed.

## 📝 Notes

- The app runs entirely in the browser with localStorage persistence
- No backend database required for basic functionality
- Evaluation service integration is optional but recommended for full compliance
- All Material UI components are properly themed and responsive
- TypeScript provides full type safety throughout the application
