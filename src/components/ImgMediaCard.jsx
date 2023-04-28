import { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { db } from ".."
import { addDoc, collection, query } from "firebase/firestore"
import fetchCollection from "../Models/FetchCollection"

export default function ImgMediaCard({ result }) {
    const plantCollectionsRef = collection(db, "plant_collection")

    const [plantsCollection, setPlantsCollection] = useState([])

    async function updateCollection() {
        const data = await fetchCollection()
        const plantIds = data.map(plant => plant.id)
        setPlantsCollection(plantIds)
    }
    async function AddToCollection(result) {
        try {
            await addDoc(plantCollectionsRef, result)
            fetchCollection()
                .then(data => data.map(plant => plant.id))
                .then(res => setPlantsCollection(res))
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        updateCollection()
    }, [])

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                alt="green iguana"
                height="140"
                image={result.default_image.regular_url}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {result.common_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {result.scientific_name}
                </Typography>
            </CardContent>
            <CardActions>
                {plantsCollection.includes(result.id) ? (
                    <Button disabled={true} size="small">
                        added to collection
                    </Button>
                ) : (
                    <Button
                        onClick={() => AddToCollection(result)}
                        size="small"
                    >
                        + Collection
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}
