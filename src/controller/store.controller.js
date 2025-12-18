import {
  getMenuByStoreId,
  getCategoryByStoreId,
  storeService,
} from '../service/store.service.js';

export async function getStoreMenuController(req, res) {
  try {
    const { storeId } = req.params;

    const parsedStoreId = Number(storeId);
    if (Number.isNaN(parsedStoreId)) {
      return res.status(400).json({ message: 'Invalid storeId' });
    }

    const menu = await getMenuByStoreId(parsedStoreId);

    return res.json({
      storeId: parsedStoreId,
      menu,
    });
  } catch (err) {
    console.error('Error fetching menu:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getStoreCategoryController(req, res) {
  try {
    const { storeId } = req.params;

    const parsedStoreId = Number(storeId);
    if (Number.isNaN(parsedStoreId)) {
      return res.status(400).json({ message: 'Invalid storeId' });
    }

    const category = await getCategoryByStoreId(parsedStoreId);
    console.log('category', category);

    return res.json({
      storeId: parsedStoreId,
      category,
    });
  } catch (err) {
    console.error('Error fetching category:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//getStore
const storeController = {};

storeController.getStoreById = async (req, res, next) => {
  try {
    const id = Number(req.params.storeId); // <-- แก้จาก id เป็น storeId

    if (isNaN(id))
      return res.status(400).json({ message: 'Invalid ID format' });

    const { store } = await storeService.getStoreById(id);

    if (!store) {
      return res.status(404).json({ message: `Store ${id} not found` });
    }

    res.status(200).json({
      store,
    });
  } catch (error) {
    next(error);
  }
};

storeController.createStore = async (req, res, next) => {
  try {
    const payload = req.body;
    const { store } = await storeService.createStore(payload);

    return res.status(201).json({
      message: 'Store created successfully',
      store,
    });
  } catch (error) {
    next(error);
  }
};

storeController.updatedStore = async (req, res, next) => {
  try {
    const id = Number(req.params.storeId);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid storeId format' });
    }

    const payload = req.body;
    const { store } = await storeService.updateStoreById(id, payload);
    if (!store) {
      return res.status(404).json({ message: `Store ${id} not found` });
    }

    return res.status(200).json({
      message: 'Store updated successfully',
      // store,
    });
  } catch (error) {
    next(error);
  }
};
storeController.deleteStore = async (req, res, next) => {
  try {
    const id = Number(req.params.storeId);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid storeId format' });
    }

    const { store } = await storeService.deleteStoreById(id);

    if (!store) {
      return res.status(404).json({ message: `Store ${id} not found` });
    }

    return res.status(200).json({
      message: `Store ${id} deleted successfully`,
      store,
    });
  } catch (error) {
    next(error);
  }
};

export { storeController };
