import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/authentication-components/ProtectedRoute";
import LoginPage from "./components/authentication-components/LoginPage";
import SignUpPage from "./components/authentication-components/SignUpPage";
import Navbar from "./components/global-components/Navbar";
import EntryTable from "./components/movie-entry-components/EntryTable";
import EntryForm from "./components/movie-entry-components/EntryForm";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Login page route */}
        <Route path="/" element={<>
          <Navbar hiddenOptions={true} />
          <LoginPage />
        </>} />
        
        {/* Signup page route */}
        <Route path="/signup" element={<>
          <Navbar hiddenOptions={true} />
          <SignUpPage />
        </>} />

        {/* Movie entry form route with Navbar */}
        <Route
          path="/entry-form"
          element={
            <ProtectedRoute>
              <Navbar navRoute={'/entry-table'} />
              <EntryForm />
            </ProtectedRoute>
          }
        />

        {/*  Movie data table route with Navbar */}
        <Route
          path="/entry-table"
          element={
            <ProtectedRoute>
              <Navbar navRoute={'/entry-form'} />
              <EntryTable />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
