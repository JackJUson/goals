export default function TaskList({ tasks }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task._id} className='card shadow-lg p-4 mb-4'>
          <h3 className='text-lg font-bold'>{task.title}</h3>
          <p>{task.description}</p>
          <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          <p>Status: {task.completed ? 'Completed' : 'Pending'}</p>
        </li>
      ))}
    </ul>
  );
}
