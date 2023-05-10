import { useState, useEffect } from "react"
// import { styled } from "@mui/material/styles"
import Grid from "@mui/material/Grid"
import Paper from "@mui/material/Paper"
import fetchCollection from "../Models/FetchCollection"

import ImgMediaCard from "../components/ImgMediaCard"
import removeFromCollection from "../Models/RemoveFromCollection"

// const Img = styled("img")({
//     margin: "auto",
//     display: "block",
//     maxWidth: "100%",
//     maxHeight: "100%",
// })

export default function CollectionPage() {
    const [results, setResults] = useState([])
    function remove(id) {
        removeFromCollection(id).then(res => setResults(res))
    }
    useEffect(() => {
        fetchCollection().then(res => {
            setResults(res)
        })
    }, [])
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
            <Grid
                container
                spacing={{ xs: 2, md: 3 }}
                columns={{ xs: 4, sm: 8, md: 12 }}
                padding="20px"
            >
                {results?.map(result => {
                    return (
                        <Grid item xs={2} key={result.firebaseID}>
                            <ImgMediaCard
                                result={result}
                                onDelete={() => remove(result.firebaseID)}
                                page="collection-page"
                                plants={results}
                            />
                            {/* <Grid item>
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
                            </Grid> */}
                        </Grid>
                    )
                })}
            </Grid>
        </Paper>
    )
}
