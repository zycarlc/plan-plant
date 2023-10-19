import { useState, useEffect } from "react"
import { Grid, Paper, Alert } from "@mui/material"

import fetchCollection from "../Models/FetchCollection"
import ImgMediaCard from "../components/ImgMediaCard"
import removeFromCollection from "../Models/RemoveFromCollection"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from ".."

export default function CollectionPage() {
    const [results, setResults] = useState([])
    const [user] = useAuthState(auth)
    function remove(id) {
        removeFromCollection(id, user.uid).then(res => setResults(res))
    }
    useEffect(() => {
        if (user) {
            fetchCollection(user.uid).then(res => {
                setResults(res)
            })
        }
    }, [user])
    return (
        <Paper
            sx={{
                p: 2,
                margin: "auto",
                flexGrow: 1,
                backgroundColor: theme =>
                    theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
        >
            {!user ? (
                <Alert severity="error">
                    Please log in to view your collection.
                </Alert>
            ) : (
                <Grid
                    container
                    spacing={{ xs: 2, md: 3 }}
                    columns={{ xs: 4, sm: 8, md: 12 }}
                    padding="20px"
                >
                    {results.length === 0 ? (
                        <Alert>Start collecting your first plant</Alert>
                    ) : (
                        results.map(result => {
                            return (
                                <Grid item xs={2} key={result.firebaseID}>
                                    <ImgMediaCard
                                        result={result}
                                        onDelete={() =>
                                            remove(result.firebaseID)
                                        }
                                        page="collection-page"
                                        plants={results}
                                    />
                                </Grid>
                            )
                        })
                    )}
                </Grid>
            )}
        </Paper>
    )
}
