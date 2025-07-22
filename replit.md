# replit.md

## Overview

This is a full-stack web application built for Smart Passes (formerly Wallet Club), a digital loyalty card registration platform. The application allows users to register for VIP loyalty programs and receive digital wallet cards for both iOS (Apple Wallet) and Android devices. The system integrates with the SmartPasses API for card generation and includes multi-language support (Spanish and English).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom glassmorphism effects and animated gradients
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: i18next for multi-language support (Spanish/English)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Development**: tsx for TypeScript execution in development
- **Session Management**: express-session with in-memory storage
- **API Integration**: External API calls to SmartPasses and Android installation services

### Database Strategy
- **Local Database**: None - all data is stored externally via SmartPasses API
- **Database Configuration**: Drizzle ORM configured for PostgreSQL (prepared for future use)
- **Session Storage**: In-memory store for user sessions

## Key Components

### Core Pages
1. **Home Page**: User registration form with phone input validation
2. **Loading Page**: Device detection and routing logic
3. **Thank You Page**: Device-specific installation instructions
4. **iPhone Install Page**: iOS-specific wallet installation guide
5. **Android Install Page**: Android-specific installation with email fallback

### External API Integrations
1. **SmartPasses API**: Loyalty card creation and management
2. **Android Installation Service**: Automatic APK link generation
3. **Email Service**: ChatGPT Builder webhook for email notifications

### UI/UX Features
- Responsive glassmorphism design with animated backgrounds
- Device detection for automatic platform routing
- QR code generation for cross-device installation
- Multi-language support with persistent language selection
- Progressive Web App (PWA) capabilities

## Data Flow

### Registration Process
1. User fills registration form on home page
2. Data is validated client-side with Zod schema
3. Form submission triggers API call to `/api/register`
4. Server forwards data to SmartPasses API for card creation
5. User is redirected to loading page for device detection
6. Based on device type, user is routed to appropriate installation page

### Card Installation Flow
- **iOS**: Direct link to .pkpass file for Apple Wallet
- **Android**: Integration with external service to generate installation APK
- **Desktop**: Manual device selection with QR codes and email options

### Error Handling
- Client-side form validation with real-time feedback
- Server-side error handling with user-friendly messages
- Retry mechanisms for failed API calls
- Fallback email delivery for installation instructions

## External Dependencies

### Production Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form, React Query
- **UI Libraries**: Radix UI components, React Icons, QR code generation
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Internationalization**: i18next, react-i18next
- **HTTP Client**: Axios for API communication
- **Phone Input**: react-phone-input-2 for international phone formatting
- **Date Utilities**: date-fns for date manipulation

### External Services
- **SmartPasses API**: Primary backend for loyalty card management
- **Android Installation Service**: Replit-hosted service for Android APK generation
- **ChatGPT Builder API**: Email delivery service integration
- **SendGrid**: Email service provider (configured but not actively used)

### Development Dependencies
- **Build Tools**: Vite, esbuild for production builds
- **TypeScript**: Full TypeScript support with strict configuration
- **Development Server**: Express with Vite middleware for HMR

## Deployment Strategy

### Build Process
1. Frontend built with Vite to `dist/public`
2. Backend bundled with esbuild to `dist/index.js`
3. Static assets served from build directory

### Environment Configuration
- Development: `npm run dev` - runs tsx server with Vite middleware
- Production: `npm run build` then `npm start` - serves bundled application
- Database: `npm run db:push` - pushes schema changes (when database is added)

### Hosting Requirements
- Node.js environment for Express server
- Environment variables for API keys and external service URLs
- Static file serving capability for built frontend assets
- Session storage (currently in-memory, should be upgraded for production scaling)

### Environment Variables
- `WALLET_CLUB_PROGRAM_ID`: SmartPasses program identifier
- `WALLET_CLUB_API_KEY`: SmartPasses API authentication key
- `DATABASE_URL`: PostgreSQL connection string (for future use)
- `ANDROID_INSTALL_URL`: External Android installation service endpoint
- Various branding and customization variables for different deployments