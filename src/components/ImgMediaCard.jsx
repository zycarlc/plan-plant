import { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import CardActions from "@mui/material/CardActions"
import CardContent from "@mui/material/CardContent"
import CardMedia from "@mui/material/CardMedia"
import Button from "@mui/material/Button"
import Typography from "@mui/material/Typography"
import { db } from ".."
import { addDoc, collection } from "firebase/firestore"
import fetchCollection from "../Models/FetchCollection"
import removeFromCollection from "../Models/RemoveFromCollection"

export default function ImgMediaCard({ result, onDelete, page, plants }) {
    const plantCollectionsRef = collection(db, "plant_collection")

    const [plantInCollection, setPlantInCollection] = useState(false)
    const [plantsCollection, setPlantsCollection] = useState(plants)

    async function updateCollection() {
        const data = await fetchCollection()
        let newPlantsCollection = {}
        data.forEach(plant => {
            newPlantsCollection = {
                ...newPlantsCollection,
                [plant.id]: plant.firebaseID,
            }
        })
        return newPlantsCollection
    }
    async function AddToCollection(result) {
        try {
            await addDoc(plantCollectionsRef, result)
            let newPlantsCollection = await updateCollection()
            let isPlantInCollection = Object.keys(newPlantsCollection).includes(
                String(result.id)
            )
            setPlantInCollection(isPlantInCollection)
            setPlantsCollection(newPlantsCollection)
        } catch (err) {
            console.log(err)
        }
    }
    async function remove(id) {
        console.log(plantsCollection)
        removeFromCollection(plantsCollection[String(id)]).then(res =>
            setPlantInCollection(false)
        )
    }
    useEffect(() => {
        let isPlantInCollection = Object.keys(plantsCollection).includes(
            String(result.id)
        )
        // console.log(isPlantInCollection)
        setPlantInCollection(isPlantInCollection)
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
                {page === "collection-page" ? (
                    <Button onClick={onDelete} size="small">
                        remove
                    </Button>
                ) : plantInCollection ? (
                    <>
                        <Button disabled={true} size="small" onClick={onDelete}>
                            added to collection
                        </Button>
                        <Button onClick={() => remove(result.id)} size="small">
                            remove
                        </Button>
                    </>
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
