import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [loginStatus, setLoginStatus] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      fetch("http://localhost:4000/profile", {
      method: "GET",
      credentials: "include"
      })
      .then((response) => {
        if(response.status === 200) {
          setLoginStatus(true);
        }
      })
      .catch((error) => {
        console.log(error.message);
      });
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  function logout() {
    fetch("http://localhost:4000/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(() => {
        setLoginStatus(false);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
  return (
    <header>
        <div>
          <Link to="/" className="logo">Yazılım Haberleri</Link>
        </div>
        {loginStatus &&
          <nav>
            <Link to="/create">Yeni Post Oluştur</Link>
            <p className="logout" onClick={logout}>Çıkış Yap</p>
          </nav>
        }
        {!loginStatus && 
          <nav>
          <Link to="/login">Giriş Yap</Link>
          <Link to="/register">Kayıt Ol</Link>
          </nav>
        }
      </header>
  )
}
