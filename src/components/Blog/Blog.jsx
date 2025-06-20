"use client"

import { useState, useEffect } from "react"
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSpinner, FaCloud } from "react-icons/fa"
import { subscribeToBlogs, addBlogPost, updateBlogPost, deleteBlogPost } from "../../services/blogService"
import "./Blog.css"

const Blog = () => {
  const [posts, setPosts] = useState([])
  const [isWriting, setIsWriting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [newPost, setNewPost] = useState({ title: "", content: "" })
  const [isClosing, setIsClosing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  useEffect(() => {
    // Suscribirse a los posts en tiempo real
    const unsubscribe = subscribeToBlogs((postsData) => {
      setPosts(postsData)
      setLoading(false)
    })

    // Detectar estado de conexión
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      unsubscribe()
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleCloseEditor = () => {
    setIsClosing(true)
    setTimeout(() => {
      setIsWriting(false)
      setIsClosing(false)
      setNewPost({ title: "", content: "" })
      setEditingId(null)
    }, 300)
  }

  const handleSavePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    try {
      setSaving(true)

      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
        date: new Date().toLocaleDateString("es-ES"),
        time: new Date().toLocaleTimeString("es-ES"),
      }

      await addBlogPost(postData)

      setNewPost({ title: "", content: "" })
      handleCloseEditor()
    } catch (error) {
      console.error("Error saving post:", error)
      alert("Error al guardar el post. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const handleEditPost = (post) => {
    setNewPost({ title: post.title, content: post.content })
    setEditingId(post.id)
    setIsWriting(true)
  }

  const handleUpdatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    try {
      setSaving(true)

      const postData = {
        title: newPost.title.trim(),
        content: newPost.content.trim(),
      }

      await updateBlogPost(editingId, postData)

      setNewPost({ title: "", content: "" })
      handleCloseEditor()
      setEditingId(null)
    } catch (error) {
      console.error("Error updating post:", error)
      alert("Error al actualizar el post. Inténtalo de nuevo.")
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePost = async (postId) => {
    try {
      await deleteBlogPost(postId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("Error al eliminar el post. Inténtalo de nuevo.")
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString("es-ES")
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleTimeString("es-ES")
  }

  return (
    <div className="blog-container animate-fadeIn">
      <div className="blog-header">
        <h2 className="blog-title animate-slideIn">Mi Diario Sad</h2>
        <div className="blog-controls">
          <div className="connection-status">
            <FaCloud className={`cloud-icon ${isOnline ? "online" : "offline"}`} />
            <span className="status-text">{isOnline ? "En línea" : "Sin conexión"}</span>
          </div>
          <button className="new-post-btn animate-pulse" onClick={() => setIsWriting(true)} disabled={!isOnline}>
            <FaPlus /> Nuevo Post
          </button>
        </div>
      </div>

      {isWriting && (
        <div className={`post-editor ${isClosing ? "closing" : ""} animate-fadeIn`}>
          <div className="editor-header">
            <h3>{editingId ? "Editando Post" : "Nuevo Post"}</h3>
            <button className="close-editor" onClick={handleCloseEditor} disabled={saving}>
              <FaTimes />
            </button>
          </div>

          <input
            type="text"
            placeholder="Título de tu pensamiento sad..."
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="post-title-input"
            disabled={saving}
          />

          <textarea
            placeholder="Escribe tus pensamientos más profundos aquí..."
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            className="post-content-input"
            rows="10"
            disabled={saving}
          />

          <div className="editor-actions">
            <button
              className="save-btn"
              onClick={editingId ? handleUpdatePost : handleSavePost}
              disabled={saving || !isOnline}
            >
              {saving ? <FaSpinner className="spinning" /> : <FaSave />}
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Guardar"}
            </button>
            <button className="cancel-btn" onClick={handleCloseEditor} disabled={saving}>
              <FaTimes /> Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && (
        <div className="delete-modal-overlay">
          <div className="delete-modal animate-fadeIn">
            <div className="modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="modal-content">
              <p>¿Estás seguro de que quieres eliminar este post?</p>
              <p className="warning-text">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-actions">
              <button className="confirm-delete-btn" onClick={() => handleDeletePost(showDeleteConfirm)}>
                <FaTrash /> Eliminar
              </button>
              <button className="cancel-delete-btn" onClick={() => setShowDeleteConfirm(null)}>
                <FaTimes /> Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="posts-container">
        {loading ? (
          <div className="loading-posts animate-fadeIn">
            <FaSpinner className="spinning" />
            <p>Cargando pensamientos...</p>
          </div>
        ) : posts.length === 0 ? (
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
                  <button className="edit-btn" onClick={() => handleEditPost(post)} disabled={!isOnline}>
                    <FaEdit />
                  </button>
                  <button className="delete-btn" onClick={() => setShowDeleteConfirm(post.id)} disabled={!isOnline}>
                    <FaTrash />
                  </button>
                </div>
              </div>
              <div className="post-meta">
                <span>{post.date || formatDate(post.createdAt)}</span> -{" "}
                <span>{post.time || formatTime(post.createdAt)}</span>
                {post.updatedAt && post.updatedAt !== post.createdAt && (
                  <span className="updated-indicator"> (editado)</span>
                )}
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
