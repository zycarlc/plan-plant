import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import ImgMediaCard from "../components/ImgMediaCard"
import { Box, Paper, Grid } from "@mui/material"
import { styled } from "@mui/material/styles"
import fetchCollection from "../Models/FetchCollection"
import SearchBar from "../components/SearchBar"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from ".."

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}))

export default function SearchResults() {
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [plantsCollection, setPlantsCollection] = useState({})
    const [params] = useSearchParams()
    const [user, authLoading, error] = useAuthState(auth)

    const q = [...params].reduce((query, [key, value]) => {
        if (key === "q") {
            return query + value
        } else {
            return query
        }
    }, "")
    async function updateCollection() {
        if (!user) {
            setPlantsCollection({})
            return
        }
        try {
            const data = await fetchCollection(user.uid)
            let newPlantsCollection = {}
            data.forEach(plant => {
                newPlantsCollection = {
                    ...newPlantsCollection,
                    [plant.id]: plant.firebaseID,
                }
            })
            setPlantsCollection(newPlantsCollection)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        setLoading(true)
        updateCollection()
        const queryString = [...params].reduce((query, [key, value]) => {
            return query + `&${key}=${value}`
        }, "")
        axios
            .get(
                `https://perenual.com/api/species-list?page=1&key=${process.env.REACT_APP_PERENUAL_API_KEY}${queryString}`
            )
            .then(res => res.data.data)
            .then(results => {
                setResults(results)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }, [params, user])

    return (
        <>
            <SearchBar q={q} />
            <Box sx={{ width: "100%" }}>
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    padding="20px"
                >
                    {loading ? (
                        <Item>Loading</Item>
                    ) : results.length === 0 ? (
                        <Item>No Result</Item>
                    ) : (
                        results.map(result => {
                            return (
                                <Grid item xs={2} key={result.id}>
                                    <ImgMediaCard
                                        result={result}
                                        page={"search-result-page"}
                                        plants={plantsCollection}
                                        updateCollection={updateCollection}
                                    />
                                </Grid>
                            )
                        })
                    )}
                </Grid>
            </Box>
        </>
    )
}
