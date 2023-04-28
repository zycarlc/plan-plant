import { useState, useEffect } from "react"
import { styled } from "@mui/material/styles"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import Typography from "@mui/material/Typography"
import ButtonBase from "@mui/material/ButtonBase"
import fetchCollection from "../Models/FetchCollection"

import { db } from ".."
import { deleteDoc, doc } from "firebase/firestore"

const Img = styled("img")({
    margin: "auto",
    display: "block",
    maxWidth: "100%",
    maxHeight: "100%",
})

export default function CollectionPage() {
    const [results, setResults] = useState([])
    async function removeFromCollection(id) {
        try {
            const plantDoc = doc(db, "plant_collection", id)
            await deleteDoc(plantDoc)
            fetchCollection().then(res => setResults(res))
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        fetchCollection().then(res => setResults(res))
    }, [])
    return (
        <Paper
            sx={{
                p: 2,
                margin: "auto",
                maxWidth: 900,
                flexGrow: 1,
                backgroundColor: theme =>
                    theme.palette.mode === "dark" ? "#1A2027" : "#fff",
            }}
        >
            <Grid container spacing={2}>
                {results?.map(result => {
                    return (
                        <Grid item key={result.firebaseID}>
                            <Grid item>
                                <ButtonBase sx={{ width: 128, height: 128 }}>
                                    <Img
                                        alt="complex"
                                        src={result.default_image.regular_url}
                                    />
                                </ButtonBase>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid
                                    item
                                    xs
                                    container
                                    direction="column"
                                    spacing={2}
                                >
                                    <Grid item xs>
                                        <Typography
                                            gutterBottom
                                            variant="subtitle1"
                                            component="div"
                                        >
                                            {result.common_name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            gutterBottom
                                        >
                                            {result.scientific_name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Watering: {result.watering}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Sunlight:{" "}
                                            {result.sunlight.join(", ")}
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography
                                            sx={{ cursor: "pointer" }}
                                            variant="body2"
                                            onClick={() =>
                                                removeFromCollection(
                                                    result.firebaseID
                                                )
                                            }
                                        >
                                            Remove
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )
}
