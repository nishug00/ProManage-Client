import React, { useState, useEffect } from "react";
import styles from "./Board.module.css";
import addPeopleIcon from "../../../assets/addpeopleicon.png";
import Sidebar from "../Sidebar/sidebar";
import AddPeople from "./Modals/AddPeople";
import AddTask from "./Modals/AddTask";
import { fetchUserDetails } from "../../../services/auth";
import { getTask } from "../../../services/task";
import Avatar from "react-avatar";
import "@vscode/codicons/dist/codicon.css";
import { getAllMember } from "../../../services/member";
import toast from "react-hot-toast";
import { updateTaskStatus } from "../../../services/task";
import { fetchAssignedTasks } from "../../../services/task";
import { deleteTask } from "../../../services/task";

function Board() {
  const [username, setUsername] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [addPeopleModalOpen, setAddPeopleModalOpen] = useState(false);
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState({});
  const [tasks, setTasks] = useState([]);
  const [checklistVisible, setChecklistVisible] = useState({});
  const [assign, setAssign] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("Today");
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  useEffect(() => {
    const fetchAssign = async () => {
      try {
        const data = await getAllMember();
        setAssign(data.data); // Set full data to assign state
      } catch (error) {
        console.error("Failed to fetch assign:", error);
      }
    };
    fetchAssign();
  }, []);

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const year = today.getFullYear();

    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    const formattedDate = `${day}${getDaySuffix(day)} ${
      monthNames[today.getMonth()]
    }, ${year}`;
    setCurrentDate(formattedDate);
  }, []);

  const handleAddPeopleModal = () => {
    setAddPeopleModalOpen(true);
  };

  const handleAddTaskModal = () => {
    setAddTaskModalOpen(true);
  };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTask();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTask();
  }, []);

  useEffect(() => {
    const fetchUserDetailsFromApi = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userDetails = await fetchUserDetails(token);
          const { userid, username } = userDetails;
          setUserId(userid);
          setUsername(username);
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        console.error("Token is null");
      }
    };

    fetchUserDetailsFromApi();
  }, []);

  // Fetch assigned tasks based on userId
  useEffect(() => {
    if (userId) {
      const loadTasks = async () => {
        const tasks = await fetchAssignedTasks(userId);
        if (tasks) {
          setTasks(tasks);
        } else {
          console.log("No tasks found for userId:", userId);
        }
      };

      loadTasks();
    } else {
      console.log("userId is undefined or null, cannot load tasks"); // Log when userId is not set
    }
  }, [userId]);
  const handleEditClick = (taskId) => {
    console.log("Edit button clicked for task ID:", taskId);
    setSelectedTaskId(taskId); // Set the task ID
    setIsEditModalOpen(true); // Open the modal
  };
  const formatDueDate = (dateString) => {
    const options = { month: "short", day: "numeric" };
    const date = new Date(dateString);
    const daySuffix =
      date.getDate() % 10 === 1 && date.getDate() !== 11
        ? "st"
        : date.getDate() % 10 === 2 && date.getDate() !== 12
        ? "nd"
        : date.getDate() % 10 === 3 && date.getDate() !== 13
        ? "rd"
        : "th";

    return `${date.toLocaleDateString("en-US", options)}${daySuffix}`;
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        )
      );

      toast.success(`Task moved to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Failed to move task. Please try again.");
    }
  };

  const toggleDropdown = (taskId) => {
    console.log("Dropdown toggled for task ID:", taskId); // Log task ID to console
    setDropdownVisible((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const toggleChecklist = (taskId) => {
    setChecklistVisible((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  const handleDeleteTask = async (taskId) => {
    try {
      // Call the deleteTask function
      const response = await deleteTask(taskId);
      console.log("Response from deleteTask:", response); // Log the response from the deleteTask function

      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.filter((task) => task._id !== taskId);
        console.log("Updated tasks after deletion:", updatedTasks); // Log the updated task list
        return updatedTasks;
      });

      // Notify the user of success
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error); // Log the error for debugging
      toast.error("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.welcomeMessage}>
            Welcome! {username || "Guest"}
          </div>
          <div className={styles.currentDate}>{currentDate}</div>
        </div>

        <div className={styles.subHeader}>
          <div className={styles.titleAndButton}>
            <div className={styles.boardTitle}>Board</div>
            <button
              className={styles.addPeopleButton}
              onClick={handleAddPeopleModal}
            >
              <img src={addPeopleIcon} alt="Add People" />
              <span className={styles.addPeopleText}>Add People</span>
            </button>
          </div>

          <div className={styles.dropdownContainer}>
            <select
              className={styles.dateDropdown}
              value={selectedTimeframe}
              
            >
              <option value="Today">Today</option>
              <option value="Week">This Week</option>
              <option value="Month">This Month</option>
            </select>
          </div>

          <div className={styles.contentWrapper}>
            {filteredTasks.map((task) => (
              <div key={task._id} className={styles.taskWrapper}>
                {/* Render your task details here */}
                <h3>{task.title}</h3>
                {/* Add more task details as needed */}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.mainBoard}>
          {/* BACKLOG COLUMN */}
          <div className={styles.boardColumn}>
            <div className={styles.columnText}>Backlog</div>
            <button className={styles.addTask}>
              <span className="codicon codicon-collapse-all"></span>
            </button>
            <div className={styles.contentWrapper}>
              {tasks
                .filter((task) => task.status === "backlog")
                .map((task) => (
                  <div key={task._id} className={styles.taskWrapper}>
                    <div className={styles.taskContainer}>
                      <div className={styles.headerRow}>
                        <div
                          className={`${styles.dot} ${
                            task.priority === "high"
                              ? styles.highPriority
                              : task.priority === "moderate"
                              ? styles.moderatePriority
                              : styles.lowPriority
                          }`}
                        ></div>
                        <span className={styles.priorityLabel}>
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                        <div className={styles.assigneeAvatar}>
                          {assign.length > 0 && (
                            <Avatar
                              name={
                                assign.find(
                                  (member) => member._id === task.assignee
                                )?.email || "No Email"
                              }
                              size="20"
                              round={true}
                            />
                          )}
                        </div>
                        <button
                          className={styles.dotsButton}
                          onClick={() => toggleDropdown(task._id)}
                          aria-label="More options"
                        >
                          ...
                        </button>
                      </div>
                      <div className={styles.taskTitleWrapper}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <span className={styles.tooltip}>{task.title}</span>
                      </div>
                      <div className={styles.checklistLayout}>
                        <div className={styles.label}>
                          Checklist (
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }
                          /{task.checklist.length})
                        </div>
                        <span
                          className="codicon codicon-chevron-down"
                          onClick={() => toggleChecklist(task._id)}
                        ></span>
                      </div>

                      {checklistVisible[task._id] && (
                        <div className={styles.checklist}>
                          {task.checklist.map((checkItem) => (
                            <div
                              key={checkItem._id}
                              className={styles.checklistContainer}
                            >
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={checkItem.completed}
                                onChange={() =>
                                  handleCheckboxChange(checkItem._id)
                                }
                              />
                              <input
                                type="text"
                                className={styles.taskInput}
                                value={checkItem.name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    checkItem._id,
                                    e.target.value
                                  )
                                }
                                placeholder="Add a task"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div className={styles.footerRow}>
                        {task.dueDate ? (
                          <button
                            className={`${styles.dueDate} ${
                              task.priority === "high"
                                ? styles.highPriorityDueDate
                                : ""
                            }`}
                          >
                            {formatDueDate(task.dueDate)}
                          </button>
                        ) : (
                          <div className={styles.dueDatePlaceholder}></div>
                        )}
                        <div className={styles.statusTags}>
                          <button
                            className={styles.tag}
                            onClick={() => handleStatusChange(task._id, "toDo")}
                          >
                            TO DO
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() =>
                              handleStatusChange(task._id, "inProgress")
                            }
                          >
                            PROCESS
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() => handleStatusChange(task._id, "done")}
                          >
                            DONE
                          </button>
                        </div>
                      </div>

                      {dropdownVisible[task._id] && (
                        <div className={styles.dropdownMenu}>
                          <div
                            className={styles.menuItem}
                            onClick={handleEditClick}
                          >
                            Edit
                          </div>
                          <div className={styles.menuItem}>Share</div>
                          <div
                            className={styles.menuItem}
                            style={{ color: "#CF3636" }}
                            onClick={() => handleDeleteTask(task._id)} // Ensure task._id is passed here
                          >
                            Delete
                          </div>
                        </div>
                      )}
                      {isEditModalOpen && (
                        <div className={styles.modalOverlay}>
                          <div className={styles.editModalContainer}>
                            <AddTask
                              setAddTaskModalOpen={setIsEditModalOpen}
                              taskId={selectedTaskId} // Pass the selected task ID
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* TO-DO COLUMN */}
          <div className={styles.boardColumn}>
            <div className={styles.columnText}>To Do</div>
            <button className={styles.addTask} onClick={handleAddTaskModal}>
              <span className="codicon codicon-add"></span>
              <span className="codicon codicon-collapse-all"></span>
            </button>
            <div className={styles.contentWrapper}>
              {tasks
                .filter((task) => task.status === "toDo")
                .map((task) => (
                  <div key={task._id} className={styles.taskWrapper}>
                    <div className={styles.taskContainer}>
                      <div className={styles.headerRow}>
                        <div
                          className={`${styles.dot} ${
                            task.priority === "high"
                              ? styles.highPriority
                              : task.priority === "moderate"
                              ? styles.moderatePriority
                              : styles.lowPriority
                          }`}
                        ></div>
                        <span className={styles.priorityLabel}>
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                        <div className={styles.assigneeAvatar}>
                          {assign.length > 0 && (
                            <Avatar
                              name={
                                assign.find(
                                  (member) => member._id === task.assignee
                                )?.email || "No Email"
                              }
                              size="20"
                              round={true}
                            />
                          )}
                        </div>
                        <button
                          className={styles.dotsButton}
                          onClick={() => toggleDropdown("toDo")}
                          aria-label="More options"
                        >
                          ...
                        </button>
                      </div>
                      <div className={styles.taskTitleWrapper}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <span className={styles.tooltip}>{task.title}</span>
                      </div>
                      <div className={styles.checklistLayout}>
                        <div className={styles.label}>
                          Checklist (
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }
                          /{task.checklist.length})
                        </div>
                        <span
                          className="codicon codicon-chevron-down"
                          onClick={() => toggleChecklist(task._id)}
                        ></span>
                      </div>
                      {checklistVisible[task._id] && (
                        <div className={styles.checklist}>
                          {task.checklist.map((checkItem) => (
                            <div
                              key={checkItem._id}
                              className={styles.checklistContainer}
                            >
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={checkItem.completed}
                                onChange={() =>
                                  handleCheckboxChange(checkItem._id)
                                }
                              />
                              <input
                                type="text"
                                className={styles.taskInput}
                                value={checkItem.name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    checkItem._id,
                                    e.target.value
                                  )
                                }
                                placeholder="Add a task"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={styles.footerRow}>
                        {task.dueDate ? (
                          <button
                            className={`${styles.dueDate} ${
                              task.priority === "high"
                                ? styles.highPriorityDueDate
                                : ""
                            }`}
                          >
                            {formatDueDate(task.dueDate)}
                          </button>
                        ) : (
                          <div className={styles.dueDatePlaceholder}></div>
                        )}
                        <div className={styles.statusTags}>
                          <button
                            className={styles.tag}
                            onClick={() =>
                              handleStatusChange(task._id, "backlog")
                            }
                          >
                            BACKLOG
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() =>
                              handleStatusChange(task._id, "inProgress")
                            }
                          >
                            PROCESS
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() => handleStatusChange(task._id, "done")}
                          >
                            DONE
                          </button>
                        </div>
                      </div>
                      {/* Render dropdown only for the active task */}
                      {dropdownVisible.toDo && (
                        <div className={styles.dropdownMenu}>
                          <div
                            className={styles.menuItem}
                            onClick={handleEditClick}
                          >
                            Edit
                          </div>
                          <div className={styles.menuItem}>Share</div>
                          <div
                            className={styles.menuItem}
                            style={{ color: "#CF3636" }}
                          >
                            Delete
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* IN PROGRESS COLUMN */}
          <div className={styles.boardColumn}>
            <div className={styles.columnText}>In Progress</div>
            <button className={styles.addTask}>
              <span className="codicon codicon-collapse-all"></span>
            </button>

            <div className={styles.contentWrapper}>
              {tasks
                .filter((task) => task.status === "inProgress") // Adjust status to match your actual data
                .map((task) => (
                  <div key={task._id} className={styles.taskWrapper}>
                    <div className={styles.taskContainer}>
                      <div className={styles.headerRow}>
                        <div
                          className={`${styles.dot} ${
                            task.priority === "high"
                              ? styles.highPriority
                              : task.priority === "moderate"
                              ? styles.moderatePriority
                              : styles.lowPriority
                          }`}
                        ></div>
                        <span className={styles.priorityLabel}>
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                        <div className={styles.assigneeAvatar}>
                          {assign.length > 0 && (
                            <Avatar
                              name={
                                assign.find(
                                  (member) => member._id === task.assignee
                                )?.email || "No Email"
                              }
                              size="20"
                              round={true}
                            />
                          )}
                        </div>
                        <button
                          className={styles.dotsButton}
                          onClick={() => toggleDropdown("inProgress")}
                          aria-label="More options"
                        >
                          ...
                        </button>
                      </div>
                      <div className={styles.taskTitleWrapper}>
                        <h3 className={styles.taskTitle}>{task.title}</h3>
                        <span className={styles.tooltip}>
                          {task.title}
                        </span>{" "}
                        {/* Tooltip for full title */}
                      </div>
                      <div className={styles.checklistLayout}>
                        <div className={styles.label}>
                          Checklist (
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }
                          /{task.checklist.length})
                        </div>
                        <span
                          className="codicon codicon-chevron-down"
                          onClick={() => toggleChecklist(task._id)}
                        ></span>
                      </div>

                      {checklistVisible[task._id] && (
                        <div className={styles.checklist}>
                          {task.checklist.map((checkItem) => (
                            <div
                              key={checkItem._id}
                              className={styles.checklistContainer}
                            >
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={checkItem.completed}
                                onChange={() =>
                                  handleCheckboxChange(checkItem._id)
                                }
                              />
                              <input
                                type="text"
                                className={styles.taskInput}
                                value={checkItem.name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    checkItem._id,
                                    e.target.value
                                  )
                                }
                                placeholder="Add a task"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className={styles.footerRow}>
                        {task.dueDate ? (
                          <button
                            className={`${styles.dueDate} ${
                              task.priority === "high"
                                ? styles.highPriorityDueDate
                                : ""
                            }`}
                          >
                            {formatDueDate(task.dueDate)}
                          </button>
                        ) : (
                          <div className={styles.dueDatePlaceholder}></div>
                        )}

                        <div className={styles.statusTags}>
                          <button
                            className={styles.tag}
                            onClick={() =>
                              handleStatusChange(task._id, "backlog")
                            }
                          >
                            BACKLOG
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() => handleStatusChange(task._id, "toDo")}
                          >
                            TO DO
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() => handleStatusChange(task._id, "done")}
                          >
                            DONE
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {dropdownVisible.inProgress && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.menuItem} onClick={handleEditClick}>
                    Edit
                  </div>
                  <div className={styles.menuItem}>Share</div>
                  <div className={styles.menuItem} style={{ color: "#CF3636" }}>
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DONE COLUMN */}
          <div className={styles.boardColumn}>
            <div className={styles.columnText}>Done</div>
            <button className={styles.addTask}>
              <span className="codicon codicon-collapse-all"></span>
            </button>

            <div className={styles.contentWrapper}>
              {tasks
                .filter((task) => task.status === "done")
                .map((task) => (
                  <div key={task._id} className={styles.taskWrapper}>
                    <div className={styles.taskContainer}>
                      {/* First Line: Priority Dot, Priority Label, Assignee Avatar */}
                      <div className={styles.headerRow}>
                        <div
                          className={`${styles.dot} ${
                            task.priority === "high"
                              ? styles.highPriority
                              : task.priority === "moderate"
                              ? styles.moderatePriority
                              : styles.lowPriority
                          }`}
                        ></div>
                        <span className={styles.priorityLabel}>
                          {task.priority.toUpperCase()} PRIORITY
                        </span>
                        <div className={styles.assigneeAvatar}>
                          {assign.length > 0 && (
                            <Avatar
                              name={
                                assign.find(
                                  (member) => member._id === task.assignee
                                )?.email || "No Email"
                              }
                              size="20"
                              round={true}
                            />
                          )}
                        </div>
                        <button
                          className={styles.dotsButton}
                          onClick={() => toggleDropdown("done")}
                          aria-label="More options"
                        >
                          ...
                        </button>
                      </div>

                      {/* Task Title */}
                      <div className={styles.taskTitleWrapper}>
                        <h3 className={styles.taskTitle}>
                          {task.title}
                          <span className={styles.tooltip}>{task.title}</span>
                        </h3>
                      </div>

                      {/* Checklist Section */}
                      <div className={styles.checklistLayout}>
                        <div className={styles.label}>
                          Checklist (
                          {
                            task.checklist.filter((item) => item.completed)
                              .length
                          }
                          /{task.checklist.length})
                        </div>
                        <span
                          className="codicon codicon-chevron-down"
                          onClick={() => toggleChecklist(task._id)}
                        ></span>
                      </div>

                      {checklistVisible[task._id] && (
                        <div className={styles.checklist}>
                          {task.checklist.map((checkItem) => (
                            <div
                              key={checkItem._id}
                              className={styles.checklistContainer}
                            >
                              <input
                                type="checkbox"
                                className={styles.checkbox}
                                checked={checkItem.completed}
                                onChange={() =>
                                  handleCheckboxChange(checkItem._id)
                                }
                              />
                              <input
                                type="text"
                                className={styles.taskInput}
                                value={checkItem.name || ""}
                                onChange={(e) =>
                                  handleInputChange(
                                    checkItem._id,
                                    e.target.value
                                  )
                                }
                                placeholder="Add a task"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer Row with Due Date and Status Tags */}
                      <div className={styles.footerRow}>
                        {task.dueDate ? (
                          <button
                            className={`${styles.dueDate} ${
                              task.priority === "high"
                                ? styles.highPriorityDueDate
                                : ""
                            } ${
                              task.status === "done" ? styles.doneDueDate : ""
                            }`}
                          >
                            {formatDueDate(task.dueDate)}
                          </button>
                        ) : (
                          <div className={styles.dueDatePlaceholder}></div>
                        )}

                        <div className={styles.statusTags}>
                          <button
                            className={styles.tag}
                            onClick={() =>
                              handleStatusChange(task._id, "backlog")
                            }
                          >
                            BACKLOG
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() => handleStatusChange(task._id, "toDo")}
                          >
                            TO DO
                          </button>
                          <button
                            className={styles.tag}
                            onClick={() =>
                              handleStatusChange(task._id, "inProgress")
                            }
                          >
                            PROCESS
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              {dropdownVisible.done && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.menuItem} onClick={handleEditClick}>
                    Edit
                  </div>
                  <div className={styles.menuItem}>Share</div>
                  <div className={styles.menuItem} style={{ color: "#CF3636" }}>
                    Delete
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* Modal for Adding People */}
        {addPeopleModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
              <AddPeople setAddTaskModalOpen={setAddTaskModalOpen} />
            </div>
          </div>
        )}

        {/* Modal for Adding Task */}
        {addTaskModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.taskModalContainer}>
              <AddTask setAddTaskModalOpen={setAddTaskModalOpen} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;
