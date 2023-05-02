import { Routes, Route, useLocation } from "react-router-dom"
import { auth } from "."
import { useAuthState } from "react-firebase-hooks/auth"
import "./App.css"
import SearchBar from "./components/SearchBar"
import SearchResults from "./pages/SearchResultsPage"
import CollectionPage from "./pages/CollectionPage"
import NavBar from "./components/NavBar"
import MyGarden from "./pages/MyGarden"
import { useState } from "react"
import Homepage from "./pages/HomePage"

function App() {
    const location = useLocation()
    const [user, loading, error] = useAuthState(auth)

    return (
        <div className="App">
            {location.pathname !== "/" && (
                <NavBar user={user} loading={loading} />
            )}
            {/* <SearchBar /> */}
            <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/my-collection" element={<CollectionPage />} />
                <Route path="/my-garden" element={<MyGarden />} />
            </Routes>
        </div>
    )
}

export default App
