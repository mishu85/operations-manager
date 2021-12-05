import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { createBrowserHistory } from "history";
import Home from "./components/Home";
import Login from "./components/Login";

//react-router-dom v6 comes with some new features
//https://reactrouter.com/docs/en/v6/upgrading/v5

// const history = createBrowserHistory();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
