import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/database';
import Goal from '@models/Goal';

export const GET = async (req, { params }) => {
  try {
    await connectToDatabase();
    const goal = await Goal.findById(params.id);
    if (!goal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }
    return NextResponse.json(goal, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
