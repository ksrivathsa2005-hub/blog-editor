# Professional Blog Editor with editor-structure Package

A modern React blog editor built with the **editor-structure** WYSIWYG package - a professional vanilla JavaScript Rich Text Editor.

## 📚 Understanding editor-structure Package

### What is editor-structure?

The `editor-structure` package (v1.9.0) is a **lightweight, configuration-driven WYSIWYG Rich Text Editor** built in vanilla JavaScript with no framework dependencies. It's designed to be:

- **Reusable** - Works as a standalone NPM package
- **Configurable** - Controlled entirely via config objects
- **Performant** - ~30KB minified, loads in under 2 seconds
- **Accessible** - WCAG AA compliant with full keyboard support
- **Secure** - Built-in HTML sanitization and XSS protection

### Package Architecture

```
editor-structure/
├── src/
│   ├── index.js                 # Main entry point (exports RTE class)
│   ├── editor.js                # Core RTE class with all features
│   ├── toolbar.js               # Dynamic toolbar builder
│   ├── components/
│   │   └── builder.js           # UI component builders (buttons, selects, pickers)
│   ├── commands/
│   │   └── handler.js           # Command execution & history management
│   ├── state/
│   │   └── manager.js           # Real-time button state tracking
│   ├── utils/
│   │   └── sanitizer.js         # HTML sanitization & XSS protection
│   └── styles/
│       ├── main.css             # Core editor styling
│       └── components.css       # Component states (BEM methodology)
└── package.json
```

### How It Works

#### 1. **Initialization**
```javascript
import { RTE } from 'editor-structure'

// Creates editor in DOM element with default or custom config
const editor = new RTE('editor-container', {
  toolbar: [/* toolbar config */]
})
```

The RTE class constructor:
- Finds the DOM element
- Builds toolbar from config
- Creates editable contenteditable div
- Initializes command handler and state manager
- Attaches event listeners

#### 2. **Configuration-Driven Design**
Everything is controlled via configuration objects - no hardcoded content:

```javascript
const config = {
  toolbar: [
    {
      group: 'formatting',
      items: [
        { 
          type: 'button',
          label: 'Bold',
          command: 'bold',
          icon: '<b>B</b>' 
        },
        { 
          type: 'select',
          label: 'Headings',
          command: 'formatBlock',
          options: [
            { label: 'Paragraph', value: 'p' },
            { label: 'H1', value: 'h1' }
          ]
        }
      ]
    }
  ]
}
```

#### 3. **Command Handler System**
Centralized command processing with 50+ built-in commands:

```javascript
// When toolbar button clicked, command handler executes:
// 1. Validates command exists
// 2. Executes using document.execCommand()
// 3. Adds to undo/redo history (50-entry stack)
// 4. Sanitizes HTML output
// 5. Updates state manager for button states
// 6. Triggers content change events
```

**50+ Commands Available:**
- **Formatting** (8): bold, italic, underline, strikethrough, superscript, subscript, code, clearFormatting
- **Paragraph** (9): formatBlock (headings), lists, alignment, indent, blockquote, horizontal rule
- **Clipboard** (6): undo, redo, cut, copy, paste, pasteAsPlainText
- **Typography** (5): fontName, fontSize, lineHeight, foreColor, backColor
- **Insert** (8): link, image, audio, video, table, codeBlock, emoji, specialChar
- **Text Case** (3): uppercase, lowercase, sentenceCase
- **View** (2): toggleSource (HTML), toggleFullscreen

#### 4. **State Manager**
Real-time tracking of active formatting on selected text:

```javascript
// Monitors which buttons should be "active" (pressed)
// For example, if text is bold, Bold button shows as active
// Updates ARIA attributes for accessibility
// Toggles CSS classes for visual feedback
```

State updates when:
- User selects text
- Formatting is applied
- Selection changes
- Button is hovered/focused

#### 5. **Component System**
Dynamic UI builders using BEM CSS methodology:

```javascript
// Button component
createButton({
  label: 'Bold',
  icon: '<b>B</b>',
  command: 'bold',
  onclick: handler
})
// States: inactive, hover, focus, active, disabled

// Select dropdown
createSelect({
  label: 'Heading',
  options: [{ label: 'H1', value: 'h1' }]
})

// Color picker
createColorPicker({
  label: 'Text Color',
  command: 'foreColor'
})

// Range slider
createRangeSlider({
  label: 'Line Height',
  min: '0.8',
  max: '2.0'
})
```

Each component:
- Renders as semantic HTML
- Includes ARIA labels for accessibility
- Has visual states (hover, focus, active, disabled)
- Triggers command when interacted with

#### 6. **HTML Sanitization**
Security-focused input cleaning:

```javascript
// Removes dangerous content:
// - <script> tags
// - on* event attributes (onclick, onerror, etc.)
// - Unsafe iframe/embed tags
// - Malicious attributes

// Smart Word Detection:
// - Detects MS Word content automatically
// - Preserves all Word formatting (headings, alignment, styles)
// - Bypasses filtering for Word content
// - Cleans filtering for other pasted content

// Configurable filtering:
pasteCleanup: {
  formatOption: 'cleanFormat',      // or 'plainText', 'keepFormat', 'prompt'
  deniedTags: ['script', 'style'],
  deniedAttributes: ['id', 'title'],
  allowedStyleProperties: ['color', 'margin']
}
```

### Key Design Patterns

#### **ES6 Modules**
Prevents global scope pollution:
```javascript
import { RTE } from './editor.js'
import { CommandHandler } from './commands/handler.js'
import { StateManager } from './state/manager.js'
```

#### **BEM CSS Methodology**
Predictable, maintainable styling:
```css
.rte { }              /* Block */
.rte__btn { }         /* Element */
.rte__btn--active { } /* Modifier */
.rte__toolbar-group { }
```

#### **Event-Driven Architecture**
- User interacts with toolbar
- Event listener triggers
- Command handler executes
- State manager updates
- DOM reflects changes
- Content change event fires

### Integration with React

In this project, the editor-structure package is integrated via direct import:

#### **Import Path**
```jsx
import { RTE } from 'editor-structure/rte-package/src/editor.js'
```

This imports the **RTE class** directly from the source. The RTE class is the core editor component that:
- Takes a DOM element reference as first parameter
- Takes a configuration object as second parameter
- Exposes methods: `getContent()`, `setContent()`, `destroy()`

#### **React Integration Pattern**
```jsx
import { useEffect, useRef } from 'react'
import { RTE } from 'editor-structure/rte-package/src/editor.js'

export default function App() {
  // Store RTE instance in ref (persists across renders, doesn't trigger re-render)
  const rteInstance = useRef(null)
  const editorRef = useRef(null)  // Reference to DOM container
  
  // Initialize editor on component mount
  useEffect(() => {
    if (editorRef.current && !rteInstance.current) {
      // Create new RTE instance in the DOM element
      rteInstance.current = new RTE(editorRef.current, {
        toolbar: toolbarConfig  // Pass configuration
      })
      
      // Set initial content
      rteInstance.current.setContent('<h1>Welcome</h1>')
      
      // Listen for content changes
      editorRef.current.addEventListener('input', handleContentChange)
      editorRef.current.addEventListener('change', handleContentChange)
      
      // Cleanup
      return () => {
        editorRef.current?.removeEventListener('input', handleContentChange)
        editorRef.current?.removeEventListener('change', handleContentChange)
        rteInstance.current?.destroy?.()
      }
    }
  }, [])  // Only run once on mount
  
  // Get content from editor
  const getEditorContent = () => {
    return rteInstance.current.getContent()  // Returns HTML string
  }
  
  // Set content in editor
  const setEditorContent = (html) => {
    rteInstance.current.setContent(html)  // Sets HTML content
  }
  
  // Render editor container
  return (
    <div ref={editorRef} className="editor-wrapper" />
  )
}
```

#### **How It Works in This App**

1. **Initialization** - When component mounts:
   - RTE instance created in `editorRef` container
   - Toolbar configured with buttons and options
   - Content listeners attached for auto-save

2. **Getting Content** - When switching blogs or saving:
   ```javascript
   const content = rteInstance.current.getContent()  // Returns HTML
   ```

3. **Setting Content** - When loading a blog:
   ```javascript
   rteInstance.current.setContent(blog.content)  // Loads HTML into editor
   ```

4. **Auto-Save** - Every 3 seconds:
   ```javascript
   editorRef.current.addEventListener('input', handleContentChange)
   // Triggers save to localStorage via saveCurrentBlog()
   ```

5. **Cleanup** - When component unmounts:
   ```javascript
   rteInstance.current?.destroy?.()  // Clean up editor instance
   ```

#### **Key Differences from React Components**

The RTE is **not a React component** - it's a vanilla JavaScript class that:
- ✅ Manages its own DOM
- ✅ Handles its own events
- ✅ Doesn't use React state
- ✅ Must be stored in `useRef` to persist across renders
- ✅ Must be manually destroyed to prevent memory leaks

This is why we use `useRef` instead of `useState` - React state would trigger re-renders unnecessarily.

### Performance Characteristics

- **Bundle Size**: ~30KB minified
- **Load Time**: < 2 seconds
- **No Dependencies**: Pure vanilla JavaScript
- **Memory**: Efficient with only 50-entry history stack
- **Sanitization**: Real-time without heavy libraries
- **Browser Support**: Chrome, Firefox, Safari, Mobile (all latest)

### Accessibility Features

- ✅ Semantic HTML with `<header>` and `<main>`
- ✅ ARIA labels on all controls (`aria-label`, `aria-pressed`)
- ✅ Keyboard navigation (Tab, Ctrl+B/I/U/Z/Y)
- ✅ Focus-visible states for keyboard users
- ✅ Color contrast 4.5:1 minimum ratio
- ✅ Escape key closes dialogs
- ✅ WCAG AA compliant

### Security Features

- ✅ HTML sanitization removes `<script>` tags
- ✅ Event attributes (`on*`) stripped
- ✅ Safe iframe/media handling
- ✅ XSS protection built-in
- ✅ Content validation on paste
- ✅ Word detection bypasses filters safely

## 🚀 Blog Editor Features

This React implementation extends editor-structure with:

- **Multi-Blog Support** - Create, manage, and switch between multiple documents
- **Auto-Save** - Saves every 3 seconds to localStorage
- **Persistence** - All blogs restored on page refresh
- **Export** - Download blogs as formatted HTML files
- **Statistics** - Real-time word and character count
- **Professional UI** - Modern white monochrome design with sidebar navigation

See [README_BLOG_EDITOR.md](README_BLOG_EDITOR.md) for complete usage guide.
# blog-editor
