import { authenticate, AuthRequest } from '../middleware/auth';
import { createBoard, getUserBoards, getBoardById, renameBoard, deleteBoard, joinBoardByCode, saveElements, getElements } from '../services/boardService';
import { z } from 'zod';

const router = Router();
router.use(authenticate); // Require authentication for all board routes

const createBoardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { title } = createBoardSchema.parse(req.body);
    const board = await createBoard(req.userId!, title);
    res.status(201).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req: AuthRequest, res) => {
  try {
    const boards = await getUserBoards(req.userId!);
    res.status(200).json(boards);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch boards' });
  }
});

router.get('/:id/elements', async (req: AuthRequest, res) => {
  try {
    const elements = await getElements(req.params.id);
    res.status(200).json(elements);
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to fetch elements' });
  }
});

router.post('/:id/elements', async (req: AuthRequest, res) => {
  try {
    const elements = req.body.elements; // Assuming simple array for now
    await saveElements(req.params.id, elements);
    res.status(200).json({ message: 'Elements saved' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req: AuthRequest, res) => {
  try {
    const { title } = createBoardSchema.parse(req.body);
    const board = await renameBoard(req.params.id, req.userId!, title);
    res.status(200).json(board);
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    await deleteBoard(req.params.id, req.userId!);
    res.status(204).send();
  } catch (error: any) {
    res.status(403).json({ message: error.message });
  }
});

router.post('/join/:code', async (req: AuthRequest, res) => {
  try {
    const board = await joinBoardByCode(req.params.code, req.userId!);
    res.status(200).json(board);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
