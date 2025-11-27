import { getMenuByStoreId, getCategoryByStoreId } from "../service/store.service.js";

export async function getStoreMenuController(req, res) {
    try {
        const { storeId } = req.params;

        const parsedStoreId = Number(storeId);
        if (Number.isNaN(parsedStoreId)) {
            return res.status(400).json({ message: "Invalid storeId" });
        }

        const menu = await getMenuByStoreId(parsedStoreId);

        return res.json({
            storeId: parsedStoreId,
            menu,
        });

    } catch (err) {
        console.error("Error fetching menu:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getStoreCategoryController(req, res) {
    try {
        const { storeId } = req.params;

        const parsedStoreId = Number(storeId);
        if (Number.isNaN(parsedStoreId)) {
            return res.status(400).json({ message: "Invalid storeId" });
        }

        const category = await getCategoryByStoreId(parsedStoreId);
        console.log("category", category);

        return res.json({
            storeId: parsedStoreId,
            category,
        });
    } catch (err) {
        console.error("Error fetching category:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
