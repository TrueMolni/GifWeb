# GIF Web - React + TypeScript

A beautiful, production-ready web application for discovering, searching, and collecting GIFs using the Giphy API. Built with React, TypeScript, and modern web development best practices.

![GIF Web Screenshot](https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&h=600&fit=crop)

## ✨ Features

### Core Functionality
- **🔍 Advanced Search**: Debounced search with URL persistence and shareable links
- **🎯 Infinite Scroll**: Seamless loading with masonry-style responsive grid
- **📱 Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **⚡ Performance**: Lazy loading, image optimization, and smooth animations

### GIF Management
- **❤️ Favorites System**: Save GIFs locally with persistent storage
- **📋 Copy & Share**: Copy direct links or markdown format to clipboard
- **💾 Download**: Save GIFs locally with smart filename generation
- **🔗 Deep Linking**: Direct links to individual GIFs with full metadata

### User Experience
- **♿ Accessibility**: Full ARIA support, keyboard navigation, and screen reader friendly
- **🎨 Modern UI**: Clean design with hover effects and micro-interactions
- **🚨 Error Handling**: Graceful error states with retry functionality
- **📢 Toast Notifications**: User-friendly feedback for all actions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Giphy API key (free at [developers.giphy.com](https://developers.giphy.com/dashboard/))

### Installation

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd gif-web
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your API key:
   ```
   VITE_GIPHY_API_KEY=your_giphy_api_key_here
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
npm run format   # Format code with Prettier
```

## 🏗️ Project Structure

```
src/
├── api/
│   └── giphy.ts           # API layer with type safety
├── components/
│   ├── SearchBar.tsx      # Search input with debouncing
│   ├── GifGrid.tsx        # Responsive grid layout
│   ├── GifCard.tsx        # Individual GIF cards
│   ├── CopyButton.tsx     # Copy functionality
│   ├── DownloadButton.tsx # Download functionality
│   ├── FavoriteToggle.tsx # Favorites management
│   ├── Toast.tsx          # Notification system
│   └── ToastContainer.tsx # Toast provider
├── hooks/
│   ├── useDebouncedValue.ts # Input debouncing
│   └── useInfiniteScroll.ts # Infinite scroll logic
├── pages/
│   ├── HomePage.tsx       # Main search page
│   ├── GifDetailsPage.tsx # Detailed GIF view
│   └── FavoritesPage.tsx  # Favorites collection
├── types/
│   └── giphy.ts          # TypeScript definitions
├── utils/
│   ├── clipboard.ts      # Clipboard operations
│   ├── files.ts          # File operations
│   ├── format.ts         # Formatting helpers
│   └── favorites.ts      # Local storage management
└── App.tsx               # Main application component
```

## 🎨 Design System

### Colors
- **Primary**: Blue (#3B82F6) for main actions and links
- **Secondary**: Teal (#14B8A6) for secondary elements
- **Accent**: Pink (#EC4899) for favorites and special actions
- **Status**: Green/Red/Yellow for success/error/warning states

### Typography
- Clean, readable fonts with proper hierarchy
- Responsive sizing across breakpoints
- Optimal line spacing for readability

### Spacing
- Consistent 8px grid system
- Proper visual hierarchy
- Generous whitespace for clarity

## 🔌 API Integration

### Giphy API
The app integrates with the [Giphy API](https://developers.giphy.com/) for:
- **Search**: `/v1/gifs/search` with pagination support
- **Details**: `/v1/gifs/{id}` for individual GIF metadata

### Rate Limiting
- Respectful API usage with request debouncing
- Error handling for rate limit scenarios
- Graceful degradation when API is unavailable

### Data Privacy
- API keys stored in environment variables only
- No user data sent to external services
- Local storage used only for favorites

## ♿ Accessibility Features

- **Keyboard Navigation**: Full keyboard support throughout the app
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color combinations
- **Alternative Text**: Descriptive alt text for all images
- **Semantic HTML**: Proper HTML structure and landmarks

## 📱 Mobile Optimization

- **Touch-Friendly**: Appropriately sized touch targets
- **Responsive Images**: Optimized loading for different screen sizes
- **Performance**: Minimal bundle size and lazy loading
- **Gestures**: Natural touch interactions

## 🧪 Testing

The project includes comprehensive testing setup with:
- **Unit Tests**: For utilities and pure functions
- **Component Tests**: For UI component behavior
- **Integration Tests**: For user workflows
- **API Tests**: For data layer functionality

```bash
npm run test        # Run all tests
npm run test:watch  # Run tests in watch mode
npm run test:ui     # Run tests with UI
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_GIPHY_API_KEY`
3. Deploy automatically on push

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variable in Netlify dashboard

### Manual Deployment
```bash
npm run build       # Creates dist/ folder
# Upload dist/ contents to your hosting provider
```

## 📋 Requirements Checklist

- ✅ **Search**: Debounced input with URL persistence
- ✅ **Results**: Responsive grid with infinite scroll
- ✅ **Details**: Modal/page view with full metadata
- ✅ **Copy & Download**: Clipboard and file operations
- ✅ **Favorites**: Local storage with persistence
- ✅ **Error Handling**: Graceful degradation and retry logic
- ✅ **Accessibility**: Full ARIA support and keyboard navigation
- ✅ **TypeScript**: Complete type safety
- ✅ **Testing**: Unit and component tests
- ✅ **Performance**: Optimized loading and rendering
- ✅ **Mobile**: Responsive design for all devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Giphy](https://giphy.com/) for providing the amazing GIF API
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Vite](https://vitejs.dev/) for lightning-fast development experience

---

Built with ❤️ using React + TypeScript