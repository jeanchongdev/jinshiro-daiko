import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase/config"

const COLLECTION_NAME = "sadBlogPosts"

// Obtener posts en tiempo real
export const subscribeToBlogs = (callback) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"))

  return onSnapshot(q, (snapshot) => {
    const posts = []
    snapshot.forEach((doc) => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      })
    })
    callback(posts)
  })
}

// Agregar nuevo post
export const addBlogPost = async (postData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding blog post:", error)
    throw error
  }
}

// Actualizar post existente
export const updateBlogPost = async (postId, postData) => {
  try {
    const postRef = doc(db, COLLECTION_NAME, postId)
    await updateDoc(postRef, {
      ...postData,
      updatedAt: serverTimestamp(),
    })
  } catch (error) {
    console.error("Error updating blog post:", error)
    throw error
  }
}

// Eliminar post
export const deleteBlogPost = async (postId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, postId))
  } catch (error) {
    console.error("Error deleting blog post:", error)
    throw error
  }
}
