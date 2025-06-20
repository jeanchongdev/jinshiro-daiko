"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa"
import "./Blog.css"

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [isWriting, setIsWriting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    const savedPosts = localStorage.getItem("sadBlogPosts")
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }, [])

  const savePosts = (updatedPosts) => {
    localStorage.setItem("sadBlogPosts", JSON.stringify(updatedPosts))
    setPosts(updatedPosts)
  }

  const handleCloseEditor = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsWriting(false)
      setIsClosing(false)
      setNewPost({ title: "", content: "" })
      setEditingId(null)
    }, 300)
  }

  const handleSavePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      date: new Date().toLocaleDateString("es-ES"),
      time: new Date().toLocaleTimeString("es-ES"),
    }

    const updatedPosts = [post, ...posts]
    savePosts(updatedPosts)
    setNewPost({ title: "", content: "" })
    handleCloseEditor()
  }

  const handleEditPost = (id) => {
    const post = posts.find((p) => p.id === id)
    setNewPost({ title: post.title, content: post.content })
    setEditingId(id)
    setIsWriting(true)
  }

  const handleUpdatePost = () => {
    const updatedPosts = posts.map((post) =>
      post.id === editingId ? { ...post, title: newPost.title, content: newPost.content } : post,
    )
    savePosts(updatedPosts)
    setNewPost({ title: "", content: "" })
    handleCloseEditor()
    setEditingId(null)
  }

  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id)
    savePosts(updatedPosts)
  }

  return (
    <div className="blog-container animate-fadeIn">
      <div className="blog-header">
        <h2 className="blog-title animate-slideIn">Mi Diario Sad</h2>
        <button className="new-post-btn animate-pulse" onClick={() => setIsWriting(true)}>
          <FaPlus /> Nuevo Post
        </button>
      </div>

      {isWriting && (
        <div className={`post-editor ${isClosing ? "closing" : ""} animate-fadeIn`}>
          <div className="editor-header">
            <h3>{editingId ? "Editando Post" : "Nuevo Post"}</h3>
            <button className="close-editor" onClick={handleCloseEditor}>
              <FaTimes />
            </button>
          </div>

          <input
            type="text"
            placeholder="Título de tu pensamiento sad..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="post-title-input"
          />

          <textarea
            placeholder="Escribe tus pensamientos más profundos aquí..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="post-content-input"
            rows="10"
          />

          <div className="editor-actions">
            <button className="save-btn" onClick={editingId ? handleUpdatePost : handleSavePost}>
              <FaSave /> {editingId ? "Actualizar" : "Guardar"}
            </button>
            <button className="cancel-btn" onClick={handleCloseEditor}>
              <FaTimes /> Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="no-posts animate-fadeIn">
            <p>Aún no has escrito ningún pensamiento...</p>
            <p>Comparte tu melancolía aquí</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="blog-post animate-fadeIn">
              <div className="post-header">
                <h3 className="post-title">{post.title}</h3>
                <div className="post-actions">
                  <button className="edit-btn" onClick={() => handleEditPost(post.id)}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeletePost(post.id)}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="post-meta">
                <span>{post.date}</span> - <span>{post.time}</span>
              </div>
              <div className="post-content">{post.content}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Blog
