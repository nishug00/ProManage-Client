import React, { useState, useEffect } from "react";
import styles from "./AddTask.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { fetchRegisteredUsers } from "../../../../services/auth";
import { addTask, getTaskById } from "../../../../services/task"; 
import trashIcon from "../../../../assets/trashicon.png";
import toast from "react-hot-toast";

function AddTask({ setAddTaskModalOpen, taskId }) {
  const [title, setTitle] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [dueDate, setDueDate] = useState(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [assign, setAssign] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchRegisteredUsers();
        const emails = data.data.map((person) => person.email);
        setAssign(data.data); // Set full data to assign state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    // Fetch and prefill task data if in edit mode
    const fetchTaskData = async () => {
      if (taskId) { // Only fetch if taskId is provided (indicating edit mode)
        console.log("Fetching task data for taskId:", taskId);
        try {
          console.log("Fetching task with ID:", taskId); // Add this line
          const task = await getTaskById(taskId);
          
          setTitle(task.title);
          setAssignedTo(task.assignedTo);
          setDueDate(new Date(task.dueDate));
          setSelectedPriority(task.selectedPriority);
          setTasks(task.checklist || []); // Prefill checklist tasks
        } catch (error) {
          console.error("Error fetching task data:", error);
        }
      }
    };
    fetchTaskData();
  }, [taskId]);

  const handleAddTask = () => {
    const newTask = { id: Date.now(), name: "", completed: false };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleAssign = (personId) => {
    setAssignedTo(personId);
    setDropdownOpen(false); // Close dropdown after selecting
  };

  const handleInputChange = (id, value) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, name: value } : task
      )
    );
  };

  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
  };

  const handleDeleteTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleCalendar = () => {
    setCalendarOpen((prev) => !prev);
  };

  const handleCancel = () => {
    setAddTaskModalOpen(false);
  };

  const handleCheckboxChange = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        completed: task.id === id ? !task.completed : task.completed,
      }))
    );
  };

  const handleSubmit = async () => {
    try {
      const taskData = {
        title,
        selectedPriority,
        assignedTo,
        dueDate,
        checklist: tasks.map((task) => ({
          name: task.name,
          completed: task.completed,
        })),
      };

      const result = await addTask(taskData);
      if (result?.message === "Task added successfully") {
        toast.success("Task added successfully");
        window.location.reload();
        setAddTaskModalOpen(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Error adding task:", error);
    }
  };

  return (
    <div className={styles.addTaskContent}>
      <div className={styles.contentWrapper}>
        <div className={styles.inputWrapper}>
          Title<span className={styles.required}>*</span>
          <input
            type="text"
            className={styles.inputField}
            placeholder="Enter Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className={styles.priorityWrapper}>
          <div className={styles.label}>
            Select Priority<span className={styles.required}>*</span>
          </div>
          <button
            className={`${styles.priorityButton} ${styles.highPriority} ${
              selectedPriority === "high" ? styles.selected : ""
            }`}
            onClick={() => handlePriorityClick("high")}
          >
            <span className={styles.dot}></span> HIGH PRIORITY
          </button>
          <button
            className={`${styles.priorityButton} ${styles.moderatePriority} ${
              selectedPriority === "moderate" ? styles.selected : ""
            }`}
            onClick={() => handlePriorityClick("moderate")}
          >
            <span className={styles.dot}></span> MODERATE PRIORITY
          </button>
          <button
            className={`${styles.priorityButton} ${styles.lowPriority} ${
              selectedPriority === "low" ? styles.selected : ""
            }`}
            onClick={() => handlePriorityClick("low")}
          >
            <span className={styles.dot}></span> LOW PRIORITY
          </button>
        </div>

        <div className={styles.assignRow}>
          <div className={styles.label}>Assign to</div>
          <div className={styles.customDropdown}>
            <div
              className={styles.selectedOption}
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {assignedTo
                ? assign.find((person) => person._id === assignedTo)?.email
                : "Add an assignee"}
            </div>

            {dropdownOpen && (
              <div className={styles.optionsList}>
                {assign.map((person) => (
                  <div key={person._id} className={styles.optionItem}>
                    <span className={styles.email}>{person.email}</span>
                    <button
                      className={styles.assignButton}
                      onClick={() => handleAssign(person._id)}
                    >
                      Assign
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.label}>
          Checklist ({tasks.filter((task) => task.completed).length}/
          {tasks.length})<span className={styles.required}>*</span>
        </div>

        {tasks.map((task) => (
          <div key={task.id} className={styles.taskContainer}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={task.completed}
              onChange={() => handleCheckboxChange(task.id)}
            />
            <input
              type="text"
              className={styles.taskInput}
              value={task.name || ""}
              onChange={(e) => handleInputChange(task.id, e.target.value)}
              placeholder="Add a task"
            />
            <img
              src={trashIcon}
              alt="delete"
              className={styles.trashIcon}
              onClick={() => handleDeleteTask(task.id)}
            />
          </div>
        ))}

        <div className={styles.addNewButton} onClick={handleAddTask}>
          + Add New
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.datePickerContainer}>
          <button
            className={styles.selectDueDateButton}
            onClick={toggleCalendar}
          >
            {dueDate ? format(dueDate, "dd/MM/yyyy") : "Select Due Date"}
          </button>
          {calendarOpen && (
            <div className={styles.calendarWrapper}>
              <DatePicker
                selected={dueDate}
                onChange={(date) => {
                  setDueDate(date);
                  setCalendarOpen(false);
                }}
                inline
              />
            </div>
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddTask;
