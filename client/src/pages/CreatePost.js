import Header from "../Header"
import "react-quill/dist/quill.snow.css"
import { useState } from "react";
import ReactQuill from "react-quill";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
    const [title , setTitle] = useState("")
    const [summary , setSummary] = useState("")
    const [content , setContent] = useState("")
    const [file , setFile] = useState("")
    const [message , setMessage] = useState("")
    const [messageClass , setMessageClass] = useState("")

    const navigate = useNavigate();

    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ]
    }
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ]

    async function createNewPost(e) {
        e.preventDefault()
        const data = new FormData()
        data.set('title', title)
        data.set('summary', summary)
        data.set('content', content)
        data.set('file', file[0])
        await fetch('http://localhost:4000/post', {
        method: 'POST',
        body: data,
        credentials: 'include'
        })
        .then(res => {
            if(res.status === 200){
                setMessage("Yeni yazı başarıyla oluşturuldu.")
                setMessageClass("success_message")
                navigate("/");
            }
            else{
                setMessage("Bir hata oluştu.")
                setMessageClass("error_message")
            }
        })
        .catch(err => {
            setMessage("Bir hata oluştu.")
            setMessageClass("error_message")
        })
    }

  return (
    <main>
        <Header />
        <div className="form-container">
        <form className="editor" onSubmit={createNewPost}>
            <input  type="text"
                    placeholder="Başlık"
                    required 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
            />
            <input  type="text" 
                    placeholder="Özet"
                    required
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
            />
            <input  type="file"
                    name="file" 
                    required
                    onChange={e => setFile(e.target.files)}
            />
            <ReactQuill value={content} 
                        modules={modules}
                        formats={formats} 
                        className="quill-editor" 
                        onChange={newValue => setContent(newValue)}
            />
            <button type="submit">Yayınla</button>
            <p className={messageClass}>{message}</p>
        </form>
        </div>
    </main>
  )
}
