# SparkleShop Nexus

A premium, professionally-designed technology gadget membership platform built with modern web technologies. SparkleShop Nexus combines Apple-level product presentation with Material Design clarity and enterprise-grade design principles.

## 🎯 Overview

SparkleShop Nexus is a next-generation e-commerce platform designed for the tech-savvy consumer who demands premium design quality. This isn't a template-based site—it's a handcrafted platform that feels sophisticated, intentional, and production-ready.

**Live Demo**:

## ✨ Key Features

- **Premium Product Showcase**: Apple-inspired product presentation with detailed galleries
- **Advanced Filtering**: Intuitive chip-based filtering system for easy product discovery
- **User Dashboard**: Member portal with personalized event access and analytics
- **Event Management**: Conference-style event platform with speaker profiles and registration
- **Admin Portal**: Enterprise-grade admin interface for content management
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility First**: WCAG AA compliant with proper keyboard navigation and screen reader support

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives

### State Management & Routing
- **TanStack React Query** - Server state management
- **TanStack Router** - Type-safe routing
- **React Hook Form** - Efficient form handling

### UI Components & Tools
- **Framer Motion** - Smooth animations
- **Recharts** - Data visualization
- **React Day Picker** - Date selection
- **React Resizable Panels** - Flexible layouts

### Development
- **ESLint** - Code quality
- **Prettier** - Code formatting
- **Nitro** - Build optimization
- **Bun** - Fast package manager

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm, yarn, or bun

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd sparkleshop-nexus

# Install dependencies
npm install
# or
bun install
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

```
src/
├── components/        # React components
├── pages/            # Page components
├── utils/            # Utility functions
├── hooks/            # Custom React hooks
├── types/            # TypeScript type definitions
└── styles/           # Global styles

public/              # Static assets
```

## 🎨 Design System

### Color Palette (Strict)
- **Black**: `#000000`
- **White**: `#FFFFFF`
- **Dirty White**: `#F5F5F3`
- **Brighter Blue**: `#2563EB`
- **Dark Blue**: `#0F172A`

*No gradients, no additional colors, no colored shadows.*

### Icons
- **Material Icons Only** - All icons from [material.io](https://material.io/resources/icons/)
- Examples: dashboard, devices, smartphone, laptop, headphones, watch, event, groups, verified, support_agent, mail, call, location_on, search, tune, settings, analytics, workspace_premium, arrow_forward, check_circle

### Layout
- **Grid**: Professional 12-column grid system
- **Container Width**: 1440px max for large desktop
- **Content Width**: 1200px
- **Gutters**: 24px (desktop), 16px (tablet), 12px (mobile)
- **Section Spacing**: 96px (desktop), 64px (tablet), 48px (mobile)

## 📋 Pages & Sections

### Public Pages
- **Homepage**: Premium hero section with featured products
- **Products**: Showcase with filters, detailed product pages
- **Benefits**: Membership benefits with Bento-style layout
- **Events**: Conference-style event listing with timeline view
- **Contact**: Support center with contact methods and FAQ

### Member Portal
- **Dashboard**: Analytics, upcoming events, message inbox
- **Profile**: Member account settings
- **Event Details**: Speaker information, schedule, registration

### Admin Portal
- **Dashboard**: Content metrics and analytics
- **Product Management**: Add/edit/manage products
- **Event Management**: Create and manage events
- **User Management**: Member administration

## 🔧 Configuration

### Vite Configuration
The project uses a custom Vite + TanStack configuration for optimal development experience.

### ESLint & Prettier
- ESLint rules enforce code quality
- Prettier auto-formats code for consistency
- Configuration includes React hooks plugin for best practices

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accessibility

- WCAG AA contrast compliance
- Keyboard navigation support
- Screen reader optimization
- 44px minimum touch targets
- Semantic HTML structure
- Proper heading hierarchy
- Focus indicators in accessible colors

## 🔄 Build with Lovable

This project was developed with [Lovable](https://lovable.dev), an AI-powered design and development platform.

Continue developing in the [Lovable editor](https://lovable.dev/projects/c728470b-a123-410b-94ac-a1807f6cb6ef):

- **Ship faster**: Describe what you want and Lovable generates the code
- **Stay in sync**: Every change made in Lovable commits directly to this repository
- **Full ownership**: This code is yours. Push to `main` on GitHub and changes sync back to Lovable

## 📝 Development Workflow

1. Make changes locally or in the Lovable editor
2. Commit to `main` branch
3. Changes automatically sync across platforms
4. Deploy using your preferred hosting provider

## 📄 License

This project is private and proprietary. All rights reserved.

## 🤝 Contributing

For team members working on this project:
1. Create feature branches from `main`
2. Follow the established design system
3. Ensure all changes pass linting and formatting
4. Submit pull requests for review

---

**Last Updated**: August 2026
**Status**: Active Development
