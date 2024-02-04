import { Routes, Route } from "react-router-dom";
import { HomePage, LoginPage } from "./pages";
import { Header } from "./components";
import "./App.css";

function App() {
  return (
    <div className="container-app">
      <div className="game-head">
        <Header header={"FixTitle"} />
      </div>
      <div className="game-shell">
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<LoginPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
