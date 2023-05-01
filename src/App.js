import { Routes, Route, useLocation } from "react-router-dom"
import "./App.css"
import SearchBar from "./components/SearchBar"
import SearchResults from "./pages/SearchResultsPage"
import CollectionPage from "./pages/CollectionPage"
import NavBar from "./components/NavBar"
import MyGarden from "./pages/MyGarden"
import { useState } from "react"

function App() {
    const location = useLocation()

    return (
        <div className="App">
            {location.pathname !== "/" && <NavBar />}
            {/* <SearchBar /> */}
            <Routes>
                <Route path="/search" element={<SearchResults />} />
                <Route path="/my-collection" element={<CollectionPage />} />
                <Route path="/my-garden" element={<MyGarden />} />
            </Routes>
        </div>
    )
}

export default App
