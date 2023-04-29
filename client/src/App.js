import io from "socket.io-client";
import { useEffect, useState } from "react";
import shortid from "shortid";

const App = () => {
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const socket = io("http://localhost:8000");
    setSocket(socket);
    socket.on("updateData", (tasks) => {
      updateTasks(tasks);
    });

    socket.on("removeTask", (id) => {
      removeTask(id);
    });
    socket.on("addTask", (task) => {
      addTask(task);
    });
  }, []);

  const addTask = (task) => {
    setTasks((tasks) => [...tasks, task]);
    setNewTask("");
  };

  const updateTasks = (tasksData) => {
    setTasks(tasksData);
  };

  const removeTask = (taskId, isLocal) => {
    setTasks((tasks) => tasks.filter((task) => task.id !== taskId));
    if (isLocal) {
      socket.emit("removeTask", taskId);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    const task = { name: newTask, id: shortid.generate() };
    addTask(task);
    socket.emit("addTask", task);
  };
  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>
      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>
        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task">
              <span>{task.name}</span>
              <button
                className="btn btn--red"
                onClick={() => removeTask(task.id, true)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <form id="add-task-form" onSubmit={(e) => submitForm(e)}>
          <input
            className="text-input"
            autoComplete="off"
            type="text"
            placeholder="Type your description"
            id="task-name"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button className="btn" type="submit">
            Add
          </button>
        </form>
      </section>
    </div>
  );
};

export default App;
