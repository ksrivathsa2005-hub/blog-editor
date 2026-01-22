# 📝 Professional Blog Editor

A modern, feature-rich React blog editor with multi-blog support, auto-save, and localStorage persistence. Built with the `editor-structure` WYSIWYG editor package.

## ✨ Features

### Core Functionality
- 📚 **Multi-Blog Support** - Create, edit, and manage multiple blog posts
- 💾 **Auto-Save** - Automatically saves every 3 seconds to localStorage
- 🎨 **Rich Text Editing** - Full WYSIWYG editor with formatting options
- 📊 **Statistics** - Real-time word and character count
- 💾 **Persistent Storage** - All data saved to browser localStorage
- 📥 **Export as HTML** - Download blog posts as formatted HTML files
- 🎯 **Session Restoration** - Returns to last active blog on page refresh

### Editor Toolbar
- **Formatting**: Bold, Italic, Underline, Strikethrough
- **Paragraph Styles**: Headings (H1-H3), Bullet lists, Numbered lists
- **Insert Elements**: Links, Images, Tables
- **Font Awesome Icons** - Professional icon set

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Required Dependencies
- React 18+
- editor-structure (WYSIWYG editor)
- @fortawesome/fontawesome-free (icons)

## 📖 How to Use

### Creating a New Blog

1. Click the **+ button** in the sidebar header
2. Enter a blog title in the input field
3. Press Enter or click the checkmark button
4. New blog is created and set as active

### Writing Content

1. Enter your document title in the header
2. Click in the editor area to start writing
3. Use the toolbar for formatting:
   - Select text and apply styles
   - Use dropdown for headings and styles
   - Insert media using toolbar buttons
4. **Auto-saves every 3 seconds** (no manual save needed)

### Switching Between Blogs

- Click any blog in the sidebar to switch to it
- Current blog is highlighted in dark
- Content automatically loads and previous blog is saved

### Deleting a Blog

- Hover over a blog in the sidebar
- Click the trash icon
- Cannot delete the last blog (create another first)

### Exporting Content

1. Click the **Export** button in the footer
2. Blog downloads as `.html` file
3. File includes proper formatting and styling

## 💾 localStorage Structure

### Storage Keys

```javascript
// All blog posts stored as JSON array
localStorage.getItem('editor_blogs')

// Currently active blog ID
localStorage.getItem('editor_current_blog_id')
```

### Blog Object Structure

```javascript
{
  id: "1234567890",                    // Unique timestamp-based ID
  title: "My Blog Post",               // Blog title
  content: "<h1>...</h1><p>...</p>",  // HTML content
  createdAt: "1/22/2026, 4:30:15 PM", // Creation timestamp
  lastSaved: "1/22/2026, 4:35:22 PM"  // Last save timestamp
}
```

## 🔄 Auto-Save Behavior

| Action | Trigger | Delay |
|--------|---------|-------|
| Content Changes | User typing | 3 seconds |
| Title Changes | Title input blur | Immediate |
| Blog Switch | Sidebar click | Immediate save of current blog |
| Page Refresh | Browser reload | Full restoration from localStorage |

## 🎨 UI Components

### Sidebar
- Blog list with creation dates
- New blog creation form
- Delete blog buttons (hover to show)
- Active blog highlight

### Header
- Editable document title
- Save status indicator (Saved/Saving)
- Last saved timestamp

### Editor
- Full WYSIWYG editing area
- Toolbar with formatting options
- Responsive to content changes

### Footer
- Word and character count
- Export button

## 🛠️ Component Integration

### Using the App Component

```jsx
import App from './App'

export default function MyApp() {
  return <App />
}
```

### Main Component Files

- **src/App.jsx** - Main React component with all logic
- **src/BlogEditor.css** - Styling and layout

## 📋 Available Methods (Internal)

```javascript
// Create new blog
createNewBlog()

// Switch between blogs
switchBlog(blogId)

// Delete a blog
deleteBlog(blogId)

// Save content to localStorage
saveBlogs(updatedBlogs)

// Load blogs from localStorage
loadBlogs()

// Export as HTML
handleExport()

// Update word/character stats
updateStats(content)
```

## 🎯 Default Configuration

```javascript
// Auto-save interval (milliseconds)
AUTO_SAVE_INTERVAL = 3000

// Toolbar groups available
const toolbarConfig = [
  { group: 'formatting', items: [...] },    // Bold, Italic, etc.
  { group: 'paragraph', items: [...] },     // Headings, lists
  { group: 'insert', items: [...] }         // Links, images, tables
]
```

## 📱 Responsive Design

- **Desktop**: Full layout with sidebar and editor side-by-side
- **Tablet/Mobile**: Optimized touch interactions
- Scrollable blog list and editor content
- Touch-friendly buttons and inputs

## 🔒 Data Persistence

- All data saved to **browser localStorage**
- Survives browser refresh and restart
- Each browser has separate storage
- Clear browser data = blogs are deleted

## 🎨 Styling & Customization

### Color Scheme
- Primary: Black (#1a1a1a)
- Secondary: Dark gray (#333)
- Background: White (#ffffff, #fafafa)
- Accents: Green (saved), Orange (saving)

### Fonts
- System font stack for native feel

## 🚀 Performance

- Lightweight editor integration
- Efficient auto-save with debouncing
- Minimal re-renders with React hooks
- localStorage limits: ~5-10MB per domain

## 💡 Tips & Tricks

1. **Keyboard Shortcuts**: Use Ctrl+B for bold, Ctrl+I for italic
2. **Quick Export**: Export before switching browsers
3. **Backup**: Regularly export important blogs
4. **Multiple Docs**: Create separate blogs for different projects
5. **Draft Management**: Use blog titles to organize by date/topic

## ⚠️ Limitations

- localStorage is browser-specific (not synced across devices)
- Maximum storage depends on browser (~5-10MB)
- No cloud sync (local storage only)
- No image hosting (must use external URLs)

## 🐛 Troubleshooting

### Blogs not saving
- Check browser localStorage is enabled
- Verify browser hasn't run out of storage
- Check browser console for errors

### Content disappearing after switch
- Now fixed! Properly saves before switching
- Check localStorage in DevTools (F12 → Application → LocalStorage)

### Text not visible in input
- Fixed in latest version
- Clear browser cache if issue persists

## 📚 Stack

- **Framework**: React 18+
- **Editor**: editor-structure (WYSIWYG)
- **Icons**: Font Awesome Free
- **Storage**: Browser localStorage
- **Styling**: CSS3

---

**Happy Writing! ✍️**
