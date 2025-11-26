import { getMenuByStoreId } from "../service/store.service.js";

export async function getStoreMenuController(req, res) {
    try {
        const { storeId } = req.params;
        console.log("STOREID", storeId)

        const parsedStoreId = Number(storeId);
        if (Number.isNaN(parsedStoreId)) {
            return res.status(400).json({ message: "Invalid storeId" });
        }

        const menu = await getMenuByStoreId(parsedStoreId);
        console.log("MENU", menu)

        return res.json({
            storeId: parsedStoreId,
            items: menu,
        });
    } catch (err) {
        console.error("Error fetching menu:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
