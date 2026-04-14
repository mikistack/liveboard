import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createBoard, getUserBoards, getBoardById, renameBoard, deleteBoard, joinBoardByCode } from '../services/boardService';
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

router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const board = await getBoardById(req.params.id, req.userId!);
    res.status(200).json(board);
  } catch (error: any) {
    res.status(error.message === 'Unauthorized access' ? 403 : 404).json({ message: error.message });
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
