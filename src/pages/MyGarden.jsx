import React, { useEffect } from "react"
import Konva from "konva"
import { Stage, Layer, Image } from "react-konva"
import plantIcons from "../components/PlantIcons"
import useImage from "use-image"
import { v4 as uuid } from "uuid"
import { db } from ".."
import { doc, collection, updateDoc, query, getDocs } from "firebase/firestore"

async function generateItems() {
    const myGardenRef = collection(db, "my_garden")
    const q = query(myGardenRef)
    const data = await getDocs(q)
    return data.docs[0].data().data
}

const URLImage = ({ image, onDragStart, onDragEnd }) => {
    const [img] = useImage(image.src)
    return (
        <Image
            image={img}
            x={image.x}
            y={image.y}
            id={image.id}
            // I will use offset to set origin to the center of the image
            offsetX={img ? img.width / 2 : 0}
            offsetY={img ? img.height / 2 : 0}
            name={image.id}
            numPoints={5}
            innerRadius={20}
            outerRadius={40}
            draggable
            rotation={image.rotation}
            scaleX={image.isDragging ? 1.2 : 1}
            scaleY={image.isDragging ? 1.2 : 1}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />
    )
}

const plantIconsArr = Object.values(plantIcons)

export default function MyGarden() {
    const dragUrl = React.useRef()
    const stageRef = React.useRef()
    const [images, setImages] = React.useState([])

    function handleDragStart(e) {
        const id = e.target.name()
        const items = [...images]
        const item = items.find(i => i.id === id)
        const index = items.indexOf(item)
        // remove from the list:
        items.splice(index, 1)
        // add to the top
        items.push({ ...item, isDragging: images.id === id })
        setImages(items)
    }
    async function handleDragEnd(e) {
        var myGardenRef = doc(db, "my_garden", "iAyFU44jMPbCoPS7r0EV")
        const id = e.target.name()
        const items = [...images]
        const item = items.find(i => i.id === id)
        const index = items.indexOf(item)
        // update item position
        items[index] = {
            ...item,
            x: e.target.x(),
            y: e.target.y(),
            isDragging: false,
        }
        setImages(items)
        await updateDoc(myGardenRef, { data: items })
    }
    async function handleOnDrop(e) {
        e.preventDefault()
        var myGardenRef = doc(db, "my_garden", "iAyFU44jMPbCoPS7r0EV")
        // register event position
        stageRef.current.setPointersPositions(e)
        // add image
        // console.log(images)
        const newImages = [
            ...images,
            {
                ...stageRef.current.getPointerPosition(),
                src: dragUrl.current,
                id: uuid(),
            },
        ]
        setImages(newImages)
        await updateDoc(myGardenRef, { data: newImages })
    }

    useEffect(() => {
        generateItems().then(res => setImages(res))
    }, [])

    return (
        <>
            <div
                style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexWrap: "nowrap",
                    overflowY: "scroll",
                    height: "100px",
                    width: "100%",
                }}
            >
                {plantIconsArr.map((icon, i) => {
                    return (
                        <img
                            style={{ display: "inline-block" }}
                            key={i}
                            alt=""
                            src={icon}
                            draggable="true"
                            onDragStart={e => {
                                dragUrl.current = e.target.src
                            }}
                        />
                    )
                })}
            </div>
            <div onDrop={handleOnDrop} onDragOver={e => e.preventDefault()}>
                <Stage
                    width={window.innerWidth}
                    height={window.innerHeight}
                    style={{ border: "1px solid grey" }}
                    ref={stageRef}
                >
                    <Layer>
                        {images.map(image => (
                            <URLImage
                                image={image}
                                key={image.id}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                            />
                        ))}
                    </Layer>
                </Stage>
            </div>
        </>
    )
}
