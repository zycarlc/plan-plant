import { Routes, Route } from "react-router-dom"
import "./App.css"
import SearchBar from "./components/SearchBar"
import SearchResults from "./pages/SearchResultsPage"
import CollectionPage from "./pages/CollectionPage"
import NavBar from "./components/NavBar"

function App() {
    return (
        <div className="App">
            <NavBar />
            <SearchBar />
            <Routes>
                <Route path="/search" element={<SearchResults />} />
                <Route path="/my-collection" element={<CollectionPage />} />
            </Routes>
        </div>
    )
}

export default App
