import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import ImgMediaCard from "../components/ImgMediaCard"
import { Box, Stack, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"
import fetchCollection from "../Models/FetchCollection"

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
    async function updateCollection() {
        const data = await fetchCollection()
        let newPlantsCollection = {}
        data.forEach(plant => {
            newPlantsCollection = {
                ...newPlantsCollection,
                [plant.id]: plant.firebaseID,
            }
        })
        // console.log(Object.keys(newPlantsCollection))
        setPlantsCollection(newPlantsCollection)
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
                setLoading(false)
                setResults(results)
            })
    }, [params])

    return (
        <Box sx={{ width: "100%" }}>
            <Stack>
                {loading ? (
                    <Item>Loading</Item>
                ) : results.length === 0 ? (
                    <Item>No Result</Item>
                ) : (
                    results.map(result => {
                        return (
                            <Item key={result.id}>
                                <ImgMediaCard
                                    result={result}
                                    page={"search-result-page"}
                                    plants={plantsCollection}
                                />
                            </Item>
                        )
                    })
                )}
            </Stack>
        </Box>
    )
}