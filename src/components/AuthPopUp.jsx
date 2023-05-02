import {
    Box,
    Button,
    Modal,
    TextField,
    ToggleButtonGroup,
    ToggleButton,
    Alert,
} from "@mui/material"
import { useState } from "react"
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth"
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
}

const inputStyle = {
    display: "block",
    margin: "10px",
}

export default function Auth({ open, setOpen }) {
    const [loginInfo, setLoginInfo] = useState({})
    const [alignment, setAlignment] = useState("log in")
    const [error, setError] = useState("")

    function updateLoginInfo(e) {
        setError("")
        setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value })
    }

    function changeMethod(e) {
        setAlignment(e.target.value)
    }

    async function signUp(e) {
        e.preventDefault()
        if (loginInfo.password !== loginInfo.confirmedPassword) {
            setError("check your password")
            return
        }
        createUserWithEmailAndPassword(
            auth,
            loginInfo.email,
            loginInfo.password
        )
            .then(userCredential => console.log(userCredential))
            .catch(err => {
                setError(err.message)
                console.log(err)
            })
    }
    async function login(e) {
        e.preventDefault()
        signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password)
            .then(userCredential => console.log(userCredential))
            .catch(err => {
                setError(err.message)
                console.log(err)
            })
    }

    return (
        <Modal open={open} onClose={setOpen}>
            <Box sx={style} onChange={updateLoginInfo}>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={changeMethod}
                    aria-label="Platform"
                >
                    <ToggleButton value="sign up">Sign Up</ToggleButton>
                    <ToggleButton value="log in">Login</ToggleButton>
                </ToggleButtonGroup>
                {alignment === "sign up" && (
                    <form action="" onSubmit={signUp}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            name="email"
                            sx={inputStyle}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            name="password"
                            sx={inputStyle}
                            required
                        />
                        <TextField
                            id="confirm-password"
                            label="Confirm Password"
                            type="confirm password"
                            name="confirmedPassword"
                            sx={inputStyle}
                            required
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                            disabled={!loginInfo.email || !loginInfo.password}
                            type="submit"
                        >
                            Sign Up
                        </Button>
                    </form>
                )}
                {alignment === "log in" && (
                    <form action="" onSubmit={login}>
                        <TextField
                            required
                            id="outlined-required"
                            label="Email"
                            name="email"
                            sx={inputStyle}
                        />
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            name="password"
                            sx={inputStyle}
                            required
                        />
                        {error && <Alert severity="error">{error}</Alert>}
                        <Button
                            disabled={!loginInfo.email || !loginInfo.password}
                            type="submit"
                        >
                            Log in
                        </Button>
                    </form>
                )}
            </Box>
        </Modal>
    )
}
