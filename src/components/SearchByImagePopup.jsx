import { Box, Modal, Card, CardMedia } from "@mui/material"

import Typography from "@mui/material/Typography"
import axios from "axios"
import { useEffect, useState } from "react"
import result from "./Demo"
import ImgMediaCard from "./ImgMediaCard"
import fetchCollection from "../Models/FetchCollection"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from ".."

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflow: "scroll",
}

export default function SearchByImagePopUp({ open, setOpen }) {
    const [image, setImage] = useState(null)
    const [isSearchFinished, setIsSearchFinished] = useState(true)
    const [imageSearchResult, setImageSearchResult] = useState(null)
    const [plantsCollection, setPlantsCollection] = useState({})
    const [possibility, setPossibility] = useState(0)
    const [user, loading, error] = useAuthState(auth)

    const handleClose = () => {
        setOpen(false)
    }
    const handleSubmit = async e => {
        e.preventDefault()
        setIsSearchFinished(false)
        updateCollection()
        // production phase
        const base64file = [image.imageURI]
        const data = {
            api_key: process.env.REACT_APP_FIREBASE_PLANT_ID_API,
            images: base64file,
            // modifiers docs: https://github.com/flowerchecker/Plant-id-API/wiki/Modifiers
            modifiers: ["crops_fast", "similar_images"],
            plant_language: "en",
            // plant details docs: https://github.com/flowerchecker/Plant-id-API/wiki/Plant-details
            plant_details: [
                "common_names",
                "url",
                "name_authority",
                "wiki_description",
                "taxonomy",
                "synonyms",
            ],
        }
        axios
            .post("https://api.plant.id/v2/identify", data)
            .then(res => {
                const searchResult = res.data.suggestions[0]
                console.log(searchResult)
                const newImageSearchResult = {
                    id: searchResult.id,
                    default_image: {
                        regular_url: searchResult.similar_images[0].url,
                    },
                    common_name: searchResult.plant_details.common_names
                        ? searchResult.plant_details.common_names[0]
                        : searchResult.plant_details.plant_name,
                    scientific_name: searchResult.plant_details.scientific_name,
                }
                // console.log(Number(result.plant_details.probability))
                setPossibility(Number(result.plant_details.probability))
                setImageSearchResult(newImageSearchResult)
                setIsSearchFinished(true)
            })
            .catch(err => {
                console.error("Error", err)
            })
    }
    async function updateCollection() {
        const data = await fetchCollection(user.uid)
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
    function handleImage(event) {
        readURI(event)
    }
    function readURI(e) {
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader()
            reader.onload = function (ev) {
                const res = ev.target.result
                setImage({ imageURI: res })
            }
            reader.readAsDataURL(e.target.files[0])
        }
    }
    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Search by Image
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    What does your plant look like?
                </Typography>
                <form>
                    <input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/png, image/jpeg"
                        onChange={handleImage}
                    />
                    {image && (
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="auto"
                                image={image.imageURI}
                            />
                        </Card>
                    )}
                    <button onClick={handleSubmit} type="button">
                        Search
                    </button>
                </form>
                {isSearchFinished && possibility !== 0 && (
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {`Accuracy ${(possibility * 100).toFixed(1)} %`}
                    </Typography>
                )}
                {isSearchFinished && imageSearchResult && (
                    <ImgMediaCard
                        result={imageSearchResult}
                        page={"search-by-image-popup"}
                        plants={plantsCollection}
                    />
                )}
            </Box>
        </Modal>
    )
}
