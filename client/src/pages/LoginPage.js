import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import Header from "../Header"

function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageClass, setMessageClass] = useState("")
  const navigate = useNavigate();

  async function login(e) {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password }),
        credentials: "include"
      });
      if(response.status === 400) {
        setMessage("Kullanıcı adı veya şifre hatalı.");
        setMessageClass("error_message");
      }
      else if(response.status === 200) {
        setMessage("Giriş başarılı. Ana sayfaya yönlendiriliyorsunuz.");
        setMessageClass("success_message");
        navigate("/");
      }
    }
    catch (error) {
      console.log(error.message);
      setMessage("Giriş yapılırken bir hata oluştu.");
      setMessageClass("error_message");
    }
  }
  return (
    <main>
        <Header />
        <div className="form-container">
            <h2 id="form-title">Giriş Yap</h2>
            <form onSubmit={login}>
              <input  type="text"
                      required
                      placeholder="Kullanıcı Adınız"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
              />
              <input  type="password"
                      required
                      placeholder="Şifreniz"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
              />
              <button type="submit">Üye Giriş Yap</button>
              <p className={messageClass}>{message}</p>
            </form>
        </div>
    </main>
  )
}

export default LoginPage