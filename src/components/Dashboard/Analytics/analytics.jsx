import React, { useEffect, useState } from "react";
import styles from "./analytics.module.css";
import Sidebar from "../Sidebar/sidebar";
import { getTask } from "../../../services/task";

function Analytics() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await getTask();
        console.log("Fetched tasks:", data); // Check the data structure and status values
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
    fetchTask();
  }, []);

  // Calculate task counts based on status
  const backlogCount = tasks.filter(
    (task) => task.status.toLowerCase() === "backlog"
  ).length;
  const toDoCount = tasks.filter(
    (task) => task.status.toLowerCase() === "todo"
  ).length;
  const inProgressCount = tasks.filter(
    (task) => task.status.toLowerCase() === "inprogress"
  ).length;
  const completedCount = tasks.filter(
    (task) => task.status.toLowerCase() === "done"
  ).length;

  // Calculate task counts based on priority
  const lowPriorityCount = tasks.filter(
    (task) => task.priority === "low"
  ).length;
  const moderatePriorityCount = tasks.filter(
    (task) => task.priority === "moderate"
  ).length;
  const highPriorityCount = tasks.filter(
    (task) => task.priority === "high"
  ).length;
  const dueDateTasksCount = tasks.filter(
    (task) => new Date(task.dueDate) < new Date()
  ).length; // Assuming tasks have a `dueDate`

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        <div className={styles.subHeader}>
          <div className={styles.analyticsTitle}>Analytics</div>
        </div>
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <ul className={styles.cardList}>
              <li className={styles.listItem}>
                <span className={styles.itemText}>Backlog Tasks</span>
                <span className={styles.number}>{backlogCount}</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.itemText}>To-do Tasks</span>
                <span className={styles.number}>{toDoCount}</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.itemText}>In-Progress Tasks</span>
                <span className={styles.number}>{inProgressCount}</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.itemText}>Completed Tasks</span>
                <span className={styles.number}>{completedCount}</span>
              </li>
            </ul>
          </div>
          <div className={styles.card}>
            <ul className={styles.cardList}>
              <li className={styles.listItem}>
                <span className={styles.itemText}>Low Priority</span>
                <span className={styles.number}>{lowPriorityCount}</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.itemText}>Moderate Priority</span>
                <span className={styles.number}>{moderatePriorityCount}</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.itemText}>High Priority</span>
                <span className={styles.number}>{highPriorityCount}</span>
              </li>
              <li className={styles.listItem}>
                <span className={styles.itemText}>Due Date Tasks</span>
                <span className={styles.number}>{dueDateTasksCount}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
