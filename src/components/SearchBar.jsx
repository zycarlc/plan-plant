import {
    TextField,
    Button,
    ToggleButton,
    ToggleButtonGroup,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
} from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function SearchBar() {
    const navigate = useNavigate()

    const [searchInput, setSearchInput] = useState({})
    const [filters, setFilters] = useState([])

    const handleFilter = (event, newFormats) => {
        setFilters(newFormats)
    }

    const handleKeyword = ({ target }) => {
        if (target.value === "") {
            let newSearchInput = { ...searchInput }
            delete newSearchInput[target.name]
            setSearchInput(newSearchInput)
        } else {
            setSearchInput({ ...searchInput, [target.name]: target.value })
        }
    }
    const handleList = ({ target }) => {
        if (target.value === "") {
            let newSearchInput = { ...searchInput }
            delete newSearchInput[target.name]
            setSearchInput(newSearchInput)
        } else {
            setSearchInput({ ...searchInput, [target.name]: target.value })
        }
    }

    function submitSearch(e) {
        e.preventDefault()
        let query = Object.entries(searchInput).map(
            ([key, value]) => `${key}=${value}`
        )
        filters.forEach(filter => query.push(`${filter}=1`))
        const queryString = "/search?" + query.join("&")
        navigate(queryString)
    }

    return (
        <>
            <h1>Plan Plants</h1>
            <form action="/" method="get" onSubmit={submitSearch}>
                <TextField
                    id="standard-search"
                    label="Search field"
                    type="search"
                    variant="standard"
                    onChange={handleKeyword}
                    name="q"
                >
                    {searchInput?.q}
                </TextField>
                <Button onClick={submitSearch}>Search</Button>
                <ToggleButtonGroup
                    value={filters}
                    onChange={handleFilter}
                    aria-label="text formatting"
                >
                    <ToggleButton value="indoor" aria-label="indoor">
                        indoor
                    </ToggleButton>
                    <ToggleButton value="poisonous" aria-label="poisonous">
                        Poisonous
                    </ToggleButton>
                    <ToggleButton value="edible" aria-label="edible">
                        edible
                    </ToggleButton>
                </ToggleButtonGroup>

                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="Watering">Watering</InputLabel>
                    <Select
                        labelId="Watering"
                        name="watering"
                        value={searchInput.watering || ""}
                        onChange={handleList}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"frequent"}>frequent</MenuItem>
                        <MenuItem value={"average"}>average</MenuItem>
                        <MenuItem value={"minimum"}>minimum</MenuItem>
                        <MenuItem value={"none"}>never</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="Sunlight">Sunlight</InputLabel>
                    <Select
                        labelId="Sunlight"
                        name="sunlight"
                        value={searchInput.sunlight || ""}
                        onChange={handleList}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"full_shade"}>Full Shade</MenuItem>
                        <MenuItem value={"part_shade"}>Part Shade</MenuItem>
                        <MenuItem value={"sun-part_shade"}>
                            Sun - Part Shade
                        </MenuItem>
                        <MenuItem value={"full_sun"}>Full Sun</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="Cycle">Cycle</InputLabel>
                    <Select
                        labelId="Cycle"
                        name="cycle"
                        value={searchInput.cycle || ""}
                        onChange={handleList}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={"perennial"}>perennial</MenuItem>
                        <MenuItem value={"annual"}>annual</MenuItem>
                        <MenuItem value={"biennial"}>biennial</MenuItem>
                        <MenuItem value={"biannual"}>biannual</MenuItem>
                    </Select>
                </FormControl>
            </form>
        </>
    )
}
