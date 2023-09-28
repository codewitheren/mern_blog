import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Header from "../Header"

export default function PostPage() {
    const { id } = useParams();
    const [havePost, setHavePost] = useState(false)
    const [post, setPost] = useState({})

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then((response) => {
                if (response.status === 200) {
                    return response.json();
                }
            })
            .then((result) => {
                if (result) {
                    setHavePost(true)
                    setPost(result)
                }
            })
            .catch((error) => {
                console.log(error.message);
            });
    }, [])

    const createdAtDate = new Date(post.createdAt);
    const formattedDate = createdAtDate.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
    return (
        <>
        <Header />
        {havePost ? <div className="post-page">
            <h1>{post.title}</h1>
            <p className="post-summary">{post.summary}</p>
            <div className="post-page-info">
                <p>{post.author.username}</p>
                <p>{formattedDate}</p>
            </div>
            <div className="post-page-image">
                <img src={`http://localhost:4000/${post.image}`} alt={post.title} />
            </div>
            <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </div> : <p>Post bulunamadı</p>}
        </>
  )
}
