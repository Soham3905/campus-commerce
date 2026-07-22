import express from "express";
import cors from "cors";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// demo state
let serverState = {
    cartCount: 3,
    wishlistCount: 2,
    favouritesCount: 1
}

app.get("/api/state", (req, res) => {
    res.json(serverState);
})

app.post("/api/action", (req, res) => {
    const { actionName, payload } = req.body;
    const quantity = Number(payload?.quantity) || 1;
    if (actionName === "ADD_TO_CART") {
        serverState.cartCount += quantity;
    }
    if (actionName === "ADD_TO_WISHLIST") {
        serverState.wishlistCount += quantity;
    }
    if (actionName === "ADD_TO_FAVOURITE") {
        serverState.favouritesCount += quantity;
    }
    return res.json({
        ok: true,
        actionName,
        payload,
        state: serverState,
    })
})

app.listen(PORT,()=>{
    console.log(`server running at http://localhost:${PORT}`);
})