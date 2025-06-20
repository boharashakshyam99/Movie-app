import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Error from "./pages/Error";
import SingleMovie from "./SingleMovie";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Error />} />
          <Route path="movie/:id" element={<SingleMovie />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
