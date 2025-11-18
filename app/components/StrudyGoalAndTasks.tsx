"use client";

import React from "react";
import { formatDateToString } from "../lib/utils";
import { GroupedTask } from "../type/types";

type StrudyGoalAndTasksProp = {
  goal: string;
  addTask: () => void;
  deadline: string | null;
  tasks: GroupedTask;
};
export default function StrudyGoalAndTasks({
  goal,
  addTask,
  deadline,
  tasks,
}: StrudyGoalAndTasksProp) {
  const tableCellsStyle = "w-32 text-center";
  return (
    <div className="my-3 border w-full relative">
      <div className="flex flex-row">
        <h2 className="ml-2 max-w-[300px] text-2xl wrap-anywhere font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          {goal}
        </h2>
        {deadline && <p className="absolute right-44">期日：{deadline}</p>}
        <button
          onClick={addTask}
          className="absolute right-5 p-1 m-1 bg-gray-300 rounded-2xl hover:bg-gray-400"
        >
          タスクを追加する
        </button>
      </div>
      <table className="my-3">
        {Object.values(tasks)[0].map((task, index) => (
          <React.Fragment key={index}>
            {index == 0 && (
              <thead>
                <tr>
                  <th className={tableCellsStyle}>やること</th>
                  <th className={tableCellsStyle}>分野</th>
                  <th className={tableCellsStyle}>優先順位</th>
                  <th className={tableCellsStyle}>開始予定日</th>
                  <th className={tableCellsStyle}>期日</th>
                </tr>
              </thead>
            )}
            <tbody>
              <tr>
                <td className={tableCellsStyle}>{task.task}</td>
                <td className={tableCellsStyle}>{task.field ?? ""}</td>
                <td className={tableCellsStyle}>
                  {task.priority == 1 && "高"}
                  {task.priority == 2 && "中"}
                  {task.priority == 3 && "低"}
                </td>
                <td className={tableCellsStyle}>
                  {task.startDate
                    ? formatDateToString(new Date(task.startDate))
                    : ""}
                </td>
                <td className={tableCellsStyle}>
                  {task.deadline
                    ? formatDateToString(new Date(task.deadline))
                    : ""}
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </div>
  );
}
