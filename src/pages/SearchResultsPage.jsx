import { useSearchParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import ImgMediaCard from "../components/ImgMediaCard"
import { Box, Stack, Paper } from "@mui/material"
import { styled } from "@mui/material/styles"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
}))

export default function SearchResults() {
    const [results, setResults] = useState([])

    const [params] = useSearchParams()

    useEffect(() => {
        const queryString = [...params].reduce((query, [key, value]) => {
            return query + `&${key}=${value}`
        }, "")
        axios
            .get(
                `https://perenual.com/api/species-list?page=1&key=${process.env.REACT_APP_PERENUAL_API_KEY}${queryString}`
            )
            .then(res => res.data.data)
            .then(results => {
                console.log(results)
                setResults(results)
            })
    }, [params])

    return (
        <Box sx={{ width: "100%" }}>
            <Stack>
                {results.length !== 0 ? (
                    results.map((result, index) => {
                        return (
                            <Item key={index}>
                                <ImgMediaCard result={result} />
                            </Item>
                        )
                    })
                ) : (
                    <Item>No Result</Item>
                )}
            </Stack>
        </Box>
    )
}
