"use client";

type StrudyGoalAndTasksProp = {
  goal: string;
  handleClick: () => void;
  deadline: string | null;
  tasks: Array<string>;
};
export default function StrudyGoalAndTasks({
  goal,
  handleClick,
  deadline,
  tasks,
}: StrudyGoalAndTasksProp) {
  return (
    <div className="y-3 border w-full relative">
      <div className="flex flex-row">
        <h2 className="ml-2 max-w-xs text-2xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
          {goal}
        </h2>
        {deadline && <p className="ml-2">期日：{deadline}</p>}
        <button
          onClick={handleClick}
          className="absolute right-5 p-1 m-1 bg-gray-300 rounded-2xl hover:bg-gray-400"
        >
          タスクを追加する
        </button>
      </div>
      <ul>
        {tasks.map((task, index) => (
          <li key={index} className="m-2 p-2 border">
            {task}
          </li>
        ))}
      </ul>
    </div>
  );
}
