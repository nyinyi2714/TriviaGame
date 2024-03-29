import { useEffect, useState } from "react"
import { useAuth } from "../../hooks"
import { Header } from "../../components"
import { useNavigate } from "react-router-dom"
import "./LoginPage.css"

const LoginPage = () => {
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  const handleLogin = async () => {
    const res = await login(username, password)
    console.log(res)
    if(res) navigate('/')
  }

  const handleRegistration = async () => {
    if (passwordsMatch) {
      const res = await register(username, password)
      if(res) navigate('/')
    } else {
      // Handle password mismatch error
      console.error("Passwords do not match")
    }
  }

  const toggleLogin = () => {
    setIsLogin((prev) => !prev)
  }

  const checkPasswordMatch = () => {
    console.log({ password, confirmPassword })
    setPasswordsMatch(password === confirmPassword)
  }

  useEffect(() => {
    if (password.length <= 0) return

    // if password field is entered
    checkPasswordMatch()
  }, [confirmPassword])

  return (
    <>
    <Header header={isLogin ? "Login" : "Register"} />
      <div className="login">
        <h2>{isLogin ? "Login" : "Register"}</h2>
        <div className="login-input-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div className="login-input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            placeholder="Password"
          />
        </div>
        {!isLogin && (
          <div className="login-input-group">
            <label htmlFor="confirm-password">Confirm Password:</label>
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
              }}
              placeholder="Confirm your password"
            />
          </div>
        )}
        {!passwordsMatch && (
          <p style={{ color: "red" }}>Passwords do not match</p>
        )}
        <button onClick={isLogin ? handleLogin : handleRegistration}>
          {isLogin ? "Login" : "Register"}
        </button>
        <button onClick={toggleLogin}>
          {isLogin ? " Register Here" : "Login Here"}
        </button>
      </div>
    </>
  )
}

export default LoginPage
