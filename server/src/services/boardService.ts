import crypto from 'crypto';
import prisma from '../config/db';

export const createBoard = async (ownerId: string, title: string) => {
  const shareCode = crypto.randomBytes(5).toString('hex'); // 10 char hex string

  const board = await prisma.board.create({
    data: {
      title,
      ownerId,
      shareCode,
    },
  });

  // Add owner as a member automatically
  await prisma.boardMember.create({
    data: {
      boardId: board.id,
      userId: ownerId,
      role: 'OWNER',
    },
  });

  return board;
};

export const getUserBoards = async (userId: string) => {
  return await prisma.board.findMany({
    where: {
      members: {
        some: {
          userId,
        },
      },
    },
    include: {
      _count: {
        select: { members: true },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
};

export const getBoardById = async (boardId: string, userId: string) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!board) {
    throw new Error('Board not found');
  }

  const isMember = board.members.some((m) => m.userId === userId);
  
  if (!isMember && !board.isPublic) {
    throw new Error('Unauthorized access');
  }

  return board;
};

export const renameBoard = async (boardId: string, ownerId: string, title: string) => {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  
  if (!board || board.ownerId !== ownerId) {
    throw new Error('Unauthorized or board not found');
  }

  return await prisma.board.update({
    where: { id: boardId },
    data: { title },
  });
};

export const deleteBoard = async (boardId: string, ownerId: string) => {
  const board = await prisma.board.findUnique({ where: { id: boardId } });
  
  if (!board || board.ownerId !== ownerId) {
    throw new Error('Unauthorized or board not found');
  }

  return await prisma.board.delete({
    where: { id: boardId },
  });
};

export const joinBoardByCode = async (shareCode: string, userId: string) => {
  const board = await prisma.board.findUnique({
    where: { shareCode },
  });

  if (!board) {
    throw new Error('Invalid share code');
  }

  const existingMember = await prisma.boardMember.findUnique({
    where: {
      boardId_userId: { boardId: board.id, userId },
    },
  });

  if (!existingMember) {
    await prisma.boardMember.create({
      data: {
        boardId: board.id,
        userId,
        role: 'EDITOR', // Default to editor for link joins
      },
    });
  }

  return board;
};

export const saveElements = async (boardId: string, elementsData: any[]) => {
  // Clear and recreate for the demo's simplicity (standard for early-stage whiteboards)
  await prisma.element.deleteMany({ where: { boardId } });
  
  const created = await Promise.all(
    elementsData.map((el) => {
      // Map frontend type to database enum
      let enumType = 'FREEHAND';
      if (el.type === 'rectangle') enumType = 'RECT';
      else if (el.type === 'circle') enumType = 'CIRCLE';
      else if (el.type === 'arrow') enumType = 'ARROW';
      else if (el.type === 'line') enumType = 'LINE';

      return prisma.element.create({
        data: {
          id: el.id,
          boardId,
          type: enumType as any,
          data: el,
          createdBy: 'system',
        }
      });
    })
  );
  return created;
};

export const getElements = async (boardId: string) => {
  const elements = await prisma.element.findMany({
    where: { boardId },
    orderBy: { createdAt: 'asc' },
  });
  return elements.map(e => e.data);
};
