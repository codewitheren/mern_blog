import Post from "../Post"
import Header from "../Header"
import { useEffect, useState} from "react"

function IndexPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("http://localhost:4000/post", {
      method: "GET",
      credentials: "include"
    })
      .then((response) => {
        if(response.status === 200) {
          return response.json();
        }
      })
      .then((result) => {
        if (result) {
          setPosts(result);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <main>
        <Header />
        <div className="posts">
          {posts.length > 0 ? posts.map((post) => {
            return <Post key={post._id} post={post} />
          }) : <p>Post Bulunamadı</p>}
        </div>
    </main>
  )
}

export default IndexPage