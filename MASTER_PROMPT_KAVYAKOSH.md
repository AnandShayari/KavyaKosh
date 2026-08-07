# Master Prompt — Build KavyaKosh

You are an elite full-stack engineer, product designer, and AI architect. Build a production-ready, premium, emotionally immersive web application called KavyaKosh — the world’s most advanced AI literary platform.

This project must feel like a real SaaS product, not a demo. It should be visually stunning, emotionally rich, highly polished, and fully functional across frontend, backend, database, authentication, AI generation, payments, community, marketplace, admin, analytics, and deployment.

## Project Context

The workspace already contains a React + Vite frontend and a Node + Express backend. Use the existing structure and complete the application in a professional, scalable way.

Use the current folders as the foundation:
- Frontend in the client folder
- Backend in the server folder
- Follow MVC-style separation of concerns
- Keep code modular, reusable, and production-grade

## Core Product Vision

KavyaKosh is an AI-powered literary ecosystem where users can:
- Create, discover, publish, purchase, review, and share poetry, shayari, ghazals, nazms, quotes, books, and stories
- Interact with AI to generate literary content in multiple languages and styles
- Join a premium social platform for creators and readers
- Buy ebooks and physical books through a modern marketplace
- Track orders, subscriptions, achievements, AI history, and reading activity
- Enjoy a luxurious, cinematic experience inspired by Netflix, Medium, Spotify, Goodreads, and Pinterest

## Technology Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- Redux Toolkit
- Axios
- React Hook Form
- Shadcn UI
- Radix UI
- Lucide Icons
- Chart.js
- React Query

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose

### Authentication
- JWT Authentication
- Google Login
- GitHub Login
- Email OTP Login
- Forgot Password
- Reset Password
- Refresh Token
- Secure Cookies

### Storage
- Cloudinary
- Multer

### Payments
- Razorpay
- Stripe

### AI
- OpenAI API
- Streaming Responses
- Conversation Memory

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas
- Images: Cloudinary

## Architecture Requirements

Build the app using enterprise-level development standards:
- Follow MVC architecture
- Use reusable components
- Use custom hooks
- Use a service layer
- Use middleware
- Use validation and centralized error handling
- Use environment variables
- Use clean, maintainable, scalable code
- Follow REST API best practices
- Implement proper status codes, pagination, filtering, sorting, and search
- Add Swagger documentation for APIs

## Design Direction

The platform should feel like a premium digital literary universe.

Create a theme that combines:
- Dark premium mode
- Light elegant mode
- Glassmorphism
- Luxury UI
- Cinematic motion
- Smooth transitions
- Parallax effects
- Premium gradients
- Beautiful typography
- High-end animations

The app should feel emotionally immersive, inspiring, and artistic.

## Fully Functional Theme System

Implement a complete dark/light mode system with these requirements:
- Theme persists after refresh
- Theme is stored in local storage
- Theme state is managed with Redux
- Toggle animation is smooth and polished
- Every page updates correctly
- Every card, component, table, modal, dialog, form, toast, navbar, footer, dashboard, and chart changes with the theme
- No component should remain in the wrong color scheme

## Pages to Build Completely

### Home Page
Build a premium landing experience with:
- Hero section
- AI demo section
- Trending shayari
- Trending ghazals
- Featured writers
- Featured books
- Daily quote
- Categories
- Popular authors
- Statistics
- Testimonials
- Community highlights
- Marketplace preview
- Premium plans
- Footer

### Explore Page
Build a sophisticated discovery experience with:
- Advanced search
- Infinite scroll
- Category filters
- Language filters
- Mood filters
- Genre filters
- Popularity filters
- Trending content
- Recommended content
- Bookmarks
- Collections

### AI Studio
This is the core of the platform.

Integrate OpenAI API and build a powerful creative workspace that can generate:
- Shayari
- Ghazals
- Poems
- Nazm
- Quotes
- Captions
- Stories
- Haiku
- Song lyrics
- Wedding shayari
- Love shayari
- Sad shayari
- Romantic shayari
- Friendship shayari
- Motivational shayari
- Urdu poetry
- Hindi poetry
- English poetry

Include AI controls for:
- Emotion selector
- Theme selector
- Writing style
- Creativity slider
- Length slider
- Language
- Tone
- Keywords
- Audience
- Literary device
- Rhyming scheme
- Regenerate
- Improve
- Rewrite
- Continue writing
- Expand
- Shorten
- Translate
- Explain meaning
- Generate image prompt
- Voice read
- Copy
- Download PDF
- Download DOCX
- Share
- Save draft
- Publish directly

The AI generation must stream responses like ChatGPT and support conversation memory.

### Community Page
Create a premium social platform where users can:
- Post poetry
- Upload cover image
- Upload profile image
- Like posts
- Comment
- Reply
- Share
- Bookmark
- Follow and unfollow users
- Mention users
- Use hashtags
- Explore trending topics
- Join communities and groups
- Participate in polls and events
- Join poetry challenges
- Attend live sessions
- View leaderboards
- Receive notifications
- Send private messages
- Moderate content
- Report posts
- Pin featured posts
- View verified authors and badges
- Track writing streaks
- Participate in daily challenges
- Unlock achievements

### Publish Page
Create a full publishing workflow with:
- Rich text editor
- Markdown support
- Image upload
- Audio upload
- Video upload
- Draft saving
- Publish action
- Schedule publishing
- Visibility options: private, public, followers only

### Reviews Page
Implement AI-powered and human review capabilities with:
- Emotion score
- Creativity score
- Grammar score
- Rhythm score
- Imagery score
- Suggestions
- Improvement tips

### Marketplace
Build a complete bookstore with features similar to Amazon:
- Category browsing
- Search
- Filters
- Wishlist
- Cart
- Checkout
- Coupons
- Reviews and ratings
- Related books
- Recently viewed
- Featured books
- Trending books
- Best sellers
- New arrivals
- Authors and publishers
- Stock status
- Discounts and offers
- Book details
- Sample preview
- PDF preview
- Audiobooks
- Ebooks
- Physical books
- Inventory
- Order tracking
- Order history
- Invoices
- Returns and refunds
- AI-based recommendations

### User Dashboard
Create a rich personal dashboard with:
- Profile
- Orders
- Wishlist
- Bookmarks
- Following and followers
- Achievements
- Statistics
- Downloads
- Purchase history
- Published works
- AI history
- Subscription
- Notifications
- Settings
- Security
- Sessions
- API usage

### Admin Panel
Build a full enterprise admin dashboard with:
- Dashboard
- Users
- Authors
- Books
- Orders
- Payments
- Inventory
- Coupons
- Reports
- Analytics
- Revenue
- Subscriptions
- Competitions
- Community
- Reviews
- AI usage
- Content moderation
- Notifications
- Support tickets
- CMS
- Blogs
- FAQs
- Site settings
- Roles
- Permissions
- Audit logs
- System health
- Backups
- API monitoring
- Database monitoring
- Charts
- Tables
- CSV export
- Excel export

## AI Analytics
Show analytics for:
- Tokens used
- API cost
- Generated content
- Popular prompts
- User growth
- Book sales
- Daily active users
- Revenue
- AI requests
- Top genres
- Most read books

## Premium Plans
Build subscription experiences for:
- Monthly
- Yearly
- Student
- Creator
- Enterprise

Include:
- Feature comparison
- Stripe payment integration
- Razorpay integration
- Invoice generation
- Subscription management

## Authentication System
Implement all authentication flows:
- Signup
- Login
- Google Login
- GitHub Login
- OTP verification
- Forgot password
- Reset password
- Email verification
- JWT-based sessions
- Role-based authentication for Admin, Author, Reader, and Moderator

## Notifications
Implement real-time and contextual notifications with:
- Toast messages
- Bell icon
- Unread counters
- Email alerts
- Push-style delivery patterns

## Search Experience
Build a premium search experience with:
- Instant search
- AI suggestions
- Recent searches
- Trending searches
- Voice search support

## Security Requirements
Implement robust backend security:
- Rate limiting
- Helmet
- XSS protection
- CSRF protection where appropriate
- Input validation
- Encryption
- Secure cookies
- Password hashing
- JWT refresh handling
- Audit logs

## Performance Requirements
Optimize the app for production:
- Lazy loading
- Image optimization
- Code splitting
- Caching
- Pagination
- Virtual lists where necessary
- Memoization
- Debouncing
- Infinite scroll

## Accessibility Requirements
Ensure the app is accessible and inclusive:
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast support
- Responsive design

## Database Models
Create or complete the following models:
- User
- Profile
- Book
- Order
- Cart
- Wishlist
- Review
- Comment
- Post
- Poetry
- Shayari
- Ghazal
- Competition
- Subscription
- Notification
- AI History
- Prompt
- Transaction
- Coupon
- Role
- Permission

## API Requirements
Create REST APIs for every core feature with:
- Proper status codes
- Validation
- Pagination
- Filtering
- Sorting
- Search
- Swagger documentation

## UI and Animation Requirements
Use Framer Motion to create:
- Page transitions
- Card hover effects
- Parallax visuals
- Loading skeletons
- Micro-interactions
- Floating elements
- Gradient animations

## SEO Requirements
Add:
- Meta tags
- Structured data
- Open Graph tags
- Twitter cards
- Sitemap
- Robots.txt
- Canonical URLs

## UI State Requirements
Every page must include:
- Loading states
- Error states
- Success states
- Empty states
- Skeleton loading
- Responsive layout
- Dark and light theme support
- Accessibility support

## Final Requirement
Build the complete application so that it looks and feels like a premium AI startup worth millions of dollars.

The app must be emotionally immersive, visually stunning, highly optimized, and production-ready.

Every page, button, form, modal, dropdown, search bar, filter, API, authentication flow, AI generation flow, payment flow, marketplace feature, community interaction, and admin/user dashboard must be fully functional with no placeholder content.

Do not build a fake demo. Build a serious, scalable, beautiful, premium literary platform.
