import {
  BrowserRouter,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";
// import { createBrowserHistory } from "history";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Admin from "./components/Admin";
import { RequireAuthAndAdmin, RequireNoAuth } from "./RoutesWithRequirement";
import MediaCard from "./components/apiComponents/operationsComp";

//react-router-dom v6 comes with some new features
//https://reactrouter.com/docs/en/v6/upgrading/v5

// const history = createBrowserHistory();

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Home />} />
        <Route element={<RequireNoAuth />}>
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
        </Route>
        <Route element={<RequireAuthAndAdmin />}>
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="/testcard" element={<MediaCard />} />
        <Route path="/:calledPage" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

//How to implement Routes in React JS | React Router DOM v6 | Public vs Private Routes:
//https://www.youtube.com/watch?v=Qls47-8zOg0&ab_channel=CodeWithAamir

function PageNotFound() {
  const navigate = useNavigate();
  const params = useParams();
  const handleReturnHome = () => {
    navigate("/");
  };
  return (
    <div>
      <h1>Error 404</h1>
      <p> Page "{params.calledPage}" not found</p>
      <button onClick={handleReturnHome}> Return home </button>
    </div>
  );
}
