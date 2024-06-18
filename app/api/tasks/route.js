import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/database';
import Task from '@models/Task';

export const POST = async (req) => {
  try {
    await connectToDatabase();

    const { goalId, weekNumber, name, frequency, dueDate, days } = await req.json();

    const newTask = new Task({
      goalId: goalId || null,
      weekNumber: weekNumber || null,
      name: name || 'Unnamed Task',
      frequency: frequency || 'daily',
      dueDate: dueDate || null,
      days: days || {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
    });

    await newTask.save();

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async (req) => {
  try {
    await connectToDatabase();
    const goalId = req.nextUrl.searchParams.get('goalId');
    const weekNumber = parseInt(req.nextUrl.searchParams.get('weekNumber'), 10);
    const query = { goalId: { $in: goalId.split(',') }, weekNumber };
    const tasks = await Task.find(query);
    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
