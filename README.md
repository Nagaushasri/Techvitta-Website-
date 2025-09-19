# TechVitta Blog - React + Tailwind CSS

A modern, responsive blog application built with React, Tailwind CSS, and React Router. Features a clean blog layout with dynamic content loading, sidebar navigation, and mobile-first responsive design.

## Features

- **Blog Home Page**: Grid layout displaying blog posts with thumbnails, categories, dates, and excerpts
- **Blog Details Page**: Full article view with sidebar showing recent and popular articles
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Navigation**: React Router for seamless page transitions
- **Static Content**: No database required - uses JavaScript arrays for blog data
- **Modern UI**: Clean, professional design with hover effects and smooth transitions

## Project Structure

```
├── App.jsx                 # Main app component with routing
├── BlogList.jsx           # Blog home page component
├── BlogDetails.jsx        # Individual blog post component
├── blogData.js            # Mock data for blog posts
├── index.css              # Global styles and Tailwind imports
├── tailwind.config.js     # Tailwind CSS configuration
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project files**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Tailwind CSS and dependencies:**
   ```bash
   npm install -D tailwindcss postcss autoprefixer @tailwindcss/typography
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

5. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Usage

### Blog Home Page (`/blog`)
- Displays all blog posts in a responsive grid
- Each post shows thumbnail, category, date, author, excerpt, and tags
- "Read More" button navigates to individual blog post
- Newsletter signup section
- Professional footer with links

### Blog Details Page (`/blog/:slug`)
- Full article content with proper typography
- Right sidebar with:
  - Recent articles (clickable links)
  - Popular articles (clickable links)
  - Newsletter signup
  - Category links
- Social sharing buttons
- Back navigation
- Responsive layout (2/3 main content, 1/3 sidebar)

### Data Management

Blog posts are stored in `blogData.js` with the following structure:

```javascript
{
  id: 1,
  title: "Blog Post Title",
  slug: "blog-post-slug",
  date: "2025-01-15",
  author: "Author Name",
  category: "Category",
  excerpt: "Short description...",
  content: "<p>Full HTML content...</p>",
  tags: ["tag1", "tag2", "tag3"],
  thumbnail: "https://image-url.com/image.jpg"
}
```

### Adding New Blog Posts

1. Open `blogData.js`
2. Add a new object to the `blogData` array
3. Ensure all required fields are included
4. The new post will automatically appear on the blog home page

### Customization

#### Styling
- Modify `tailwind.config.js` for theme customization
- Update `index.css` for custom styles
- Colors, fonts, and spacing can be adjusted in the Tailwind config

#### Content
- Update `blogData.js` to add/remove blog posts
- Modify the `getRecentBlogs` and `getPopularBlogs` functions for different sorting logic

#### Layout
- Adjust grid layouts in `BlogList.jsx` and `BlogDetails.jsx`
- Modify sidebar content and structure
- Update navigation and footer components

## Dependencies

### Core Dependencies
- **React**: ^18.2.0
- **React DOM**: ^18.2.0
- **React Router DOM**: ^6.8.0

### Development Dependencies
- **Tailwind CSS**: ^3.2.0
- **PostCSS**: ^8.4.21
- **Autoprefixer**: ^10.4.13
- **@tailwindcss/typography**: For enhanced prose styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Breakpoints

- **Mobile**: < 768px (stacked layout)
- **Tablet**: 768px - 1024px (2-column grid)
- **Desktop**: > 1024px (3-column grid, sidebar layout)

## Future Enhancements

- Search functionality
- Category filtering
- Pagination
- Comments system
- Admin panel for content management
- SEO optimization
- Dark mode toggle
- Social media integration

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions or support, please contact the TechVitta team or create an issue in the project repository.
