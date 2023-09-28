import Header from "../Header"
import { useState } from "react"

function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageClass, setMessageClass] = useState("")

  async function register(e) {
    e.preventDefault();
    if(username.length < 4 || password.length < 6) {
      setMessage("Kullanıcı adı en az 4, şifre en az 6 karakter olmalıdır.");
      setMessageClass("error_message");
      return;
    }
    try {
      const response = await fetch("http://localhost:4000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      if (response.status === 200) {
        setMessage("Başarıyla kayıt oldunuz.");
        setMessageClass("success_message");
      } 
      else {
        const errorText = await response.text();
        if (errorText.includes("duplicate ")) {
          setMessage("Bu kullanıcı adı zaten alınmış.");
        } else {
          setMessage("Üyelik oluşturulurken bir hata oluştu.");
        }
        setMessageClass("error_message");
      }
    } 
    catch (error) {
      console.log(error.message);
      setMessage("Üyelik oluşturulurken bir hata oluştu.");
      setMessageClass("error_message");
    }  
  }

  return (
    <main>
        <Header />
        <div className="form-container">
            <h2 id="form-title">Kayıt Ol</h2>
            <form onSubmit={register}>
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
              <button type="submit">Hesap Oluştur</button>
              <p className={messageClass}>{message}</p>
            </form>
        </div>
    </main>
  )
}

export default RegisterPage
