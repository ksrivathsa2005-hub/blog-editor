import { useEffect, useRef, useState } from 'react'
import { RTE } from 'editor-structure/rte-package/src/editor.js'
import '@fortawesome/fontawesome-free/css/all.css'
import 'editor-structure/rte-package/src/styles/main.css'
import 'editor-structure/rte-package/src/styles/components.css'
import 'editor-structure/rte-package/src/components/modal.css'
import './App.css'
import './BlogEditor.css'

const STORAGE_KEYS = {
  BLOGS: 'editor_blogs',
  CURRENT_BLOG_ID: 'editor_current_blog_id',
}

const AUTO_SAVE_INTERVAL = 3000 // 3 seconds


export default function App() {
  const editorRef = useRef(null)
  const rteInstance = useRef(null)
  const autoSaveTimerRef = useRef(null)

  const [blogs, setBlogs] = useState([])
  const [currentBlogId, setCurrentBlogId] = useState(null)
  const [title, setTitle] = useState('Untitled Document')
  const [isSaved, setIsSaved] = useState(true)
  const [lastSaved, setLastSaved] = useState(null)
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [showNewBlogForm, setShowNewBlogForm] = useState(false)
  const [newBlogTitle, setNewBlogTitle] = useState('')

  // Load all blogs from localStorage
  const loadBlogs = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOGS)
      const blogId = localStorage.getItem(STORAGE_KEYS.CURRENT_BLOG_ID)

      if (saved) {
        const blogsList = JSON.parse(saved)
        setBlogs(blogsList)

        // Set current blog
        if (blogId && blogsList.find(b => b.id === blogId)) {
          setCurrentBlogId(blogId)
          return blogsList.find(b => b.id === blogId)
        } else if (blogsList.length > 0) {
          setCurrentBlogId(blogsList[0].id)
          return blogsList[0]
        }
      }

      return null
    } catch (error) {
      console.error('Failed to load blogs:', error)
      return null
    }
  }

  // Save all blogs to localStorage
  const saveBlogs = (updatedBlogs) => {
    try {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(updatedBlogs))
    } catch (error) {
      console.error('Failed to save blogs:', error)
    }
  }

  // Create new blog
  const createNewBlog = () => {
    if (!newBlogTitle.trim()) return

    const newBlog = {
      id: Date.now().toString(),
      title: newBlogTitle,
      content: '<h1>' + newBlogTitle + '</h1><p>Start writing...</p>',
      createdAt: new Date().toLocaleString(),
      lastSaved: new Date().toLocaleString(),
      wordCount: 0,
      charCount: 0,
    }

    const updatedBlogs = [newBlog, ...blogs]
    setBlogs(updatedBlogs)
    setCurrentBlogId(newBlog.id)
    setTitle(newBlog.title)
    saveBlogs(updatedBlogs)
    setNewBlogTitle('')
    setShowNewBlogForm(false)
  }

  // Switch blog - save current first, then load new one
  const switchBlog = (blogId) => {
    // Save current blog before switching
    if (currentBlogId && rteInstance.current) {
      const content = rteInstance.current.getContent()
      const updatedBlogs = blogs.map(b => {
        if (b.id === currentBlogId) {
          return {
            ...b,
            content: content,
            lastSaved: new Date().toLocaleString(),
          }
        }
        return b
      })
      saveBlogs(updatedBlogs)
    }

    // Now switch to new blog
    const blog = blogs.find(b => b.id === blogId)
    if (blog && rteInstance.current) {
      setCurrentBlogId(blogId)
      localStorage.setItem(STORAGE_KEYS.CURRENT_BLOG_ID, blogId)
      setTitle(blog.title)
      rteInstance.current.setContent(blog.content)
      setLastSaved(blog.lastSaved)
      updateStats(blog.content)
      setIsSaved(true)
      console.log('Switched to blog:', blog.title, 'Content:', blog.content.substring(0, 50))
    }
  }

  // Delete blog
  const deleteBlog = (blogId) => {
    if (blogs.length === 1) {
      alert('You cannot delete the last blog. Create a new one first.')
      return
    }

    if (window.confirm('Are you sure you want to delete this blog?')) {
      const updatedBlogs = blogs.filter(b => b.id !== blogId)
      setBlogs(updatedBlogs)
      saveBlogs(updatedBlogs)

      if (currentBlogId === blogId) {
        const nextBlog = updatedBlogs[0]
        switchBlog(nextBlog.id)
      }
    }
  }

  // Update word and character count
  const updateStats = (content) => {
    const plainText = content.replace(/<[^>]*>/g, '').trim()
    const words = plainText.length > 0 ? plainText.split(/\s+/).length : 0
    const chars = plainText.length
    setWordCount(words)
    setCharCount(chars)
  }

  // Save current blog
  const saveCurrentBlog = (content, blogTitle) => {
    if (!currentBlogId) return

    try {
      const updatedBlogs = blogs.map(b => {
        if (b.id === currentBlogId) {
          const now = new Date().toLocaleString()
          return {
            ...b,
            title: blogTitle || b.title,
            content: content,
            lastSaved: now,
          }
        }
        return b
      })

      setBlogs(updatedBlogs)
      saveBlogs(updatedBlogs)
      setLastSaved(new Date().toLocaleTimeString())
      setIsSaved(true)
    } catch (error) {
      console.error('Failed to save blog:', error)
    }
  }

  // Initialize editor
  useEffect(() => {
    const currentBlog = loadBlogs()

    if (editorRef.current && !rteInstance.current) {
      rteInstance.current = new RTE(editorRef.current, {
        // Using default configuration
      })

      if (currentBlog) {
        setTitle(currentBlog.title)
        rteInstance.current.setContent(currentBlog.content)
        setLastSaved(currentBlog.lastSaved)
        updateStats(currentBlog.content)
      } else {
        // Create first blog if none exists
        const firstBlog = {
          id: Date.now().toString(),
          title: 'Welcome',
          content: '<h1>Welcome to Your Professional Blog Editor</h1><p>Start writing your amazing content here...</p>',
          createdAt: new Date().toLocaleString(),
          lastSaved: new Date().toLocaleString(),
        }
        setBlogs([firstBlog])
        setCurrentBlogId(firstBlog.id)
        setTitle(firstBlog.title)
        rteInstance.current.setContent(firstBlog.content)
        saveBlogs([firstBlog])
      }

      // Setup auto-save
      const handleContentChange = () => {
        setIsSaved(false)

        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current)
        }

        autoSaveTimerRef.current = setTimeout(() => {
          const content = rteInstance.current.getContent()
          const currentId = currentBlogId || blogs[0]?.id

          if (currentId) {
            const updatedBlogs = blogs.map(b => {
              if (b.id === currentId) {
                const now = new Date().toLocaleString()
                console.log('Auto-saving blog:', b.title, 'Content length:', content.length)
                return {
                  ...b,
                  content: content,
                  lastSaved: now,
                }
              }
              return b
            })
            setBlogs(updatedBlogs)
            saveBlogs(updatedBlogs)
            setLastSaved(new Date().toLocaleTimeString())
            setIsSaved(true)
            updateStats(content)
          }
        }, AUTO_SAVE_INTERVAL)
      }

      editorRef.current.addEventListener('input', handleContentChange)
      editorRef.current.addEventListener('change', handleContentChange)

      return () => {
        editorRef.current?.removeEventListener('input', handleContentChange)
        editorRef.current?.removeEventListener('change', handleContentChange)
        if (autoSaveTimerRef.current) {
          clearTimeout(autoSaveTimerRef.current)
        }
      }
    }
  }, [])

  // Save on title change
  useEffect(() => {
    if (rteInstance.current && currentBlogId) {
      const content = rteInstance.current.getContent()
      const updatedBlogs = blogs.map(b => {
        if (b.id === currentBlogId) {
          return {
            ...b,
            title: title,
            content: content,
            lastSaved: new Date().toLocaleString(),
          }
        }
        return b
      })
      setBlogs(updatedBlogs)
      saveBlogs(updatedBlogs)
      setLastSaved(new Date().toLocaleTimeString())
    }
  }, [title, currentBlogId, blogs])

  // Handle export
  const handleExport = () => {
    if (rteInstance.current) {
      const content = rteInstance.current.getContent()
      const element = document.createElement('a')
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; color: #333; }
    h1, h2, h3 { color: #222; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`
      element.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent))
      element.setAttribute('download', `${title || 'document'}.html`)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }

  const currentBlog = blogs.find(b => b.id === currentBlogId)

  return (
    <div className="blog-editor-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-file-alt"></i> My Blogs</h2>
          <button
            className="btn-new-blog"
            onClick={() => setShowNewBlogForm(!showNewBlogForm)}
            title="Create new blog"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>

        {showNewBlogForm && (
          <div className="new-blog-form">
            <input
              type="text"
              placeholder="Blog title..."
              value={newBlogTitle}
              onChange={(e) => setNewBlogTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && createNewBlog()}
              autoFocus
            />
            <button onClick={createNewBlog} className="btn-create">
              <i className="fas fa-check"></i> Create
            </button>
          </div>
        )}

        <div className="blogs-list">
          {blogs.map(blog => (
            <div
              key={blog.id}
              className={`blog-item ${currentBlogId === blog.id ? 'active' : ''}`}
              onClick={() => switchBlog(blog.id)}
            >
              <div className="blog-item-content">
                <div className="blog-title">{blog.title}</div>
                <div className="blog-date">{blog.createdAt}</div>
              </div>
              <button
                className="btn-delete-blog"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteBlog(blog.id)
                }}
                title="Delete blog"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Editor */}
      <div className="editor-main">
        <header className="blog-header">
          <div className="header-content">
            <div className="title-section">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="document-title"
                placeholder="Document Title"
              />
            </div>
            <div className="header-status">
              <div className="save-indicator">
                {isSaved ? (
                  <span className="status saved">
                    <i className="fas fa-check-circle"></i> Saved
                  </span>
                ) : (
                  <span className="status saving">
                    <i className="fas fa-circle-notch fa-spin"></i> Saving...
                  </span>
                )}
              </div>
              {lastSaved && (
                <span className="last-saved">Last saved: {lastSaved}</span>
              )}
            </div>
          </div>
        </header>

        <div ref={editorRef} className="editor-wrapper" />

        <footer className="editor-footer">
          <div className="stats">
            <span><i className="fas fa-file-word"></i> {wordCount} words</span>
            <span><i className="fas fa-keyboard"></i> {charCount} characters</span>
          </div>
          <div className="actions">
            <button onClick={handleExport} className="btn btn-primary" title="Export as HTML">
              <i className="fas fa-download"></i> Export
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
