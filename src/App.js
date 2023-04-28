import { Routes, Route } from "react-router-dom"
import "./App.css"
import SearchBar from "./components/SearchBar"
import SearchResults from "./pages/SearchResultsPage"
import CollectionPage from "./pages/CollectionPage"

function App() {
    return (
        <div className="App">
            <SearchBar />
            <Routes>
                <Route path="/search" element={<SearchResults />} />
                <Route path="/my-collection" element={<CollectionPage />} />
            </Routes>
        </div>
    )
}

export default App
