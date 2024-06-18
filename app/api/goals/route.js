// app/api/goals/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@lib/database';
import Goal from '@models/Goal';

export const POST = async (req) => {
  try {
    await connectToDatabase();
    const { title, description, dueDate } = await req.json();
    const newGoal = new Goal({ title, description, timeframe: '12-weeks', dueDate });
    await newGoal.save();
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const GET = async () => {
  try {
    await connectToDatabase();
    const goals = await Goal.find({});
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req) => {
  try {
    await connectToDatabase();
    const { id, title, description, dueDate, status } = await req.json();
    const updatedGoal = await Goal.findByIdAndUpdate(
      id,
      { title, description, timeframe: '12-weeks', dueDate, status },
      { new: true }
    );
    return NextResponse.json(updatedGoal, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req) => {
  try {
    await connectToDatabase();
    const { id } = await req.json();
    await Goal.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Goal deleted' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
