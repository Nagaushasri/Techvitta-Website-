# TechVitta Blog System

A modern, responsive blog system built with React and Tailwind CSS, featuring a clean design and smooth navigation.

## Features

### Blog Home Page (`/blog`)
- **Featured Article**: Large hero section showcasing the latest post
- **Article Grid**: Responsive grid layout displaying blog posts with:
  - Thumbnail images
  - Article titles and excerpts
  - Publication dates and authors
  - Category tags
  - "Read More" links
- **Category Explorer**: Quick access to articles by category
- **Article Counter**: Shows total number of published articles

### Blog Details Page (`/blog/[slug]`)
- **Full Article Content**: Complete blog post with rich HTML formatting
- **Reading Time**: Estimated reading time calculation
- **Article Metadata**: Author, date, category, and tags
- **Interactive Elements**: Like and share buttons
- **Sidebar Features**:
  - Recent Articles list
  - Popular Articles ranking
  - Category browser
  - Newsletter signup form
- **Related Articles**: Suggested content at the bottom
- **Navigation**: Easy return to blog home

## Technical Implementation

### Components
- `BlogList.jsx`: Main blog listing page with grid layout
- `BlogDetails.jsx`: Individual article page with sidebar
- `App.jsx`: Router configuration with React Router DOM

### Data Management
- `blogData.js`: Centralized blog data with helper functions
- Mock data includes 6 sample articles with rich content
- Functions for filtering and sorting articles

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Prose Styles**: Enhanced typography for article content
- **Responsive Design**: Mobile-first approach with breakpoints
- **Modern UI**: Clean, professional design with hover effects

### Key Features
- **SEO-Friendly URLs**: Clean slug-based routing
- **Image Optimization**: Responsive images with proper aspect ratios
- **Loading States**: Smooth transitions and hover effects
- **Accessibility**: Proper semantic HTML and ARIA labels

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm start
   ```

3. **Access the Blog**:
   - Blog Home: `http://localhost:3000/blog`
   - Individual Articles: `http://localhost:3000/blog/[slug]`

## Data Structure

Each blog post contains:
```javascript
{
  id: number,
  title: string,
  slug: string,
  date: string (YYYY-MM-DD),
  author: string,
  category: string,
  excerpt: string,
  content: string (HTML),
  tags: string[],
  thumbnail: string (URL)
}
```

## Customization

### Adding New Articles
1. Add new objects to the `blogData` array in `blogData.js`
2. Ensure unique `id` and `slug` values
3. Include all required fields

### Styling Modifications
- Update `src/index.css` for custom styles
- Modify Tailwind classes in components
- Adjust responsive breakpoints as needed

### Content Formatting
- Use HTML tags in the `content` field
- Supported elements: headings, paragraphs, lists, blockquotes, links
- Custom CSS classes available for special formatting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- **Lazy Loading**: Images load as needed
- **Optimized Images**: Proper sizing and compression
- **Efficient Rendering**: React best practices
- **Minimal Bundle Size**: Tree-shaking and code splitting

## Future Enhancements

- Search functionality
- Comment system
- Social sharing integration
- Admin panel for content management
- RSS feed generation
- Dark mode toggle
- Advanced filtering and sorting
