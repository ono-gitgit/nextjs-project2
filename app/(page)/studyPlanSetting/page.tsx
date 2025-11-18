"use client";

import AddTaskDialog from "@/app/components/AddTaskDialog";
import Background from "@/app/components/Background";
import StrudyGoalAndTasks from "@/app/components/StrudyGoalAndTasks";
import TitleAndDescription from "@/app/components/TitleAndDescription";
import { formatDateToString } from "@/app/lib/utils";
import { AlterTask, GroupedTask, StudyGoal, Task } from "@/app/type/types";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const today = new Date();
export default function StudyPlanSetting() {
  const [yearList, setYearList] = useState<Array<number>>([]);
  const [monthList] = useState<Array<number>>([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  ]);
  const [dayList, setDayList] = useState<Array<number>>([]);
  const [userId, setUserId] = useState<string>("");
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([]);
  const [tasks, setTasks] = useState<GroupedTask[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [theStudyGoal, setTheStudyGoal] = useState("");
  const [studyGoalId, setStudyGoalId] = useState<number>(0);
  const [deadline, setDeadline] = useState<Record<string, string | null>[]>([]);
  const [buttonTitle, setButtonTitle] = useState("目標を追加");
  const defaultValues = { goal: "", year: 0, month: -1, day: 0 };
  const {
    register,
    reset,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const fetchGoals = useCallback(async () => {
    const res = await fetch("/api/studyGoals/fetchStudyGoals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const studyGoals = await res.json();
    console.log(studyGoals);
    if (studyGoals.length !== 0) {
      setStudyGoals(() => studyGoals);
    }
  }, [userId]);

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/tasks/fetchTasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data: Task[] = await res.json();
    const groupedTasks: Record<number, AlterTask[]> = {};

    // studyGoalIdごとにグループ化
    data.forEach((task) => {
      const taskData: AlterTask = {
        task: task.task,
        field: task.field,
        priority: task.priority,
        startDate: task.taskStartDate || null,
        deadline: task.tsakDealline || null,
      };

      if (groupedTasks[task.studyGoalId]) {
        groupedTasks[task.studyGoalId].push(taskData);
      } else {
        groupedTasks[task.studyGoalId] = [taskData];
      }
    });

    // 配列形式に変換 [{studyGoalId1: [...]}, {studyGoalId2: [...]}]
    const alterData: GroupedTask[] = Object.keys(groupedTasks).map(
      (studyGoalId) => ({
        [Number(studyGoalId)]: groupedTasks[Number(studyGoalId)],
      })
    );
    setTasks(() => alterData);
  }, [userId]);

  const onSubmit = async (studyGoal: Record<string, string | number>) => {
    setButtonTitle(() => "少々お待ちください");
    const goal = studyGoal.goal as string;
    const year = studyGoal.year as number;
    const month = studyGoal.month as number;
    const day = studyGoal.day as number;
    const res = await fetch("/api/studyGoals/createStudyGoal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal, year, month, day, userId }),
    });
    const data = await res.json();
    if (data.message == "Goal created successfully") {
      setStudyGoals([
        ...studyGoals,
        {
          studyGoalId: data.data.studyGoalId,
          studyGoal: goal,
          memo: null,
          deadline: formatDateToString(new Date(year, month, day)),
        },
      ]);
      setDeadline({ ...deadline, [goal]: year + "/" + month + "/" + day });
      reset();
    }
    setButtonTitle(() => "目標を追加");
  };

  useEffect(() => {
    for (let i = 0; i <= 20; i++) {
      setYearList((prev) => [...prev, today.getFullYear() + i]);
    }
    for (let i = 1; i <= 31; i++) {
      setDayList((prev) => [...prev, i]);
    }
  }, []);

  useEffect(() => {
    const storedId = sessionStorage.getItem("userId") ?? "";
    setUserId(storedId);
  }, [userId]);

  useEffect(() => {
    fetchGoals();
    fetchTasks();
  }, [fetchGoals, fetchTasks, userId]);

  return (
    <Background>
      <TitleAndDescription
        title={"学習プラン"}
        description={
          "達成したい目標やその目標を達成するための学習プランを設定できます"
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="w-full my-5">
          <div className="w-[80%]">
            <input
              type="text"
              id="goal"
              {...register("goal", {
                required: "目標は必須入力です",
                maxLength: {
                  value: 50,
                  message: "目標は５０文字以内で入力してください",
                },
                validate: (value) => {
                  if (
                    studyGoals.some((studyGoalAndtask) => {
                      return Object.keys(studyGoalAndtask)[0] === value.trim();
                    })
                  ) {
                    return "その目標は既に登録済みです";
                  }
                  return true;
                },
              })}
              placeholder={`\t目標を入力してください`}
              className="border rounded-[5px] w-full"
            />
            <div className="text-red-500">{errors.goal?.message}</div>
            <div className="flex flex-row mt-3">
              <p className="flex items-center font-bold text-[14.5px]">
                期日を設定できます
              </p>
              <select
                id="year"
                {...register("year", {
                  validate: (value) => {
                    if (
                      value !== 0 &&
                      (watch("month") === 0 || watch("day") === 0)
                    ) {
                      return "月と日を選択してください";
                    }
                    return true;
                  },
                })}
                className="border rounded-2xl ml-1 p-1"
              >
                <option value={0}>--年--</option>
                {yearList.map((year, index) => (
                  <option key={index} value={year}>
                    {year}年
                  </option>
                ))}
              </select>
              <select
                id="month"
                {...register("month", {
                  validate: (value) => {
                    if (
                      value !== 0 &&
                      (watch("year") === 0 || watch("day") === 0)
                    ) {
                      return "年と日を選択してださい";
                    }
                    return true;
                  },
                })}
                className="border rounded-2xl ml-1 p-1"
              >
                <option value={-1}>--月--</option>
                {monthList.map((month, index) => (
                  <option key={index} value={month}>
                    {month + 1}月
                  </option>
                ))}
              </select>
              <select
                id="day"
                {...register("day", {
                  validate: {
                    requiredField: (value) => {
                      if (
                        value !== 0 &&
                        (watch("year") === 0 || watch("month") === 0)
                      ) {
                        return "年と月を選択してださい";
                      }
                      return true;
                    },
                    ngDate: (value) => {
                      const endOfMonth = new Date(
                        watch("year"),
                        watch("month"),
                        0
                      );
                      if (value > endOfMonth.getDate()) {
                        return "その日は存在しません";
                      }
                      return true;
                    },
                  },
                })}
                className="border rounded-2xl ml-1 p-1"
              >
                <option value={0}>--日--</option>
                {dayList.map((day, index) => (
                  <option key={index} value={day}>
                    {day}日
                  </option>
                ))}
              </select>
              <input
                type="submit"
                value={buttonTitle}
                className="ml-10 p-2 bg-green-600 rounded-2xl text-white hover:bg-green-700"
              />
            </div>
            <div className="text-red-500">{errors.year?.message}</div>
            <div className="text-red-500">{errors.month?.message}</div>
            <div className="text-red-500">{errors.day?.message}</div>
          </div>
        </form>
        {studyGoals.length === 0 ? (
          <p className="text-3xl mx-auto mt-10">目標を追加してください</p>
        ) : (
          studyGoals.map((studyGoal, index) => (
            <StrudyGoalAndTasks
              key={index}
              goal={studyGoal.studyGoal as string}
              addTask={() => {
                setIsDialogOpen(true);
                setTheStudyGoal(studyGoal.studyGoal as string);
                setStudyGoalId(Number(studyGoal.studyGoalId));
              }}
              tasks={
                tasks.find(
                  (task) =>
                    Number(Object.keys(task)[0]) ===
                    Number(studyGoal.studyGoalId)
                ) ?? { [studyGoal.studyGoalId]: [] }
              }
              deadline={
                studyGoal.deadline
                  ? formatDateToString(new Date(studyGoal.deadline as string))
                  : ""
              }
            ></StrudyGoalAndTasks>
          ))
        )}
      </TitleAndDescription>
      {studyGoalId != 0 && (
        <AddTaskDialog
          setIsDialogOpen={setIsDialogOpen}
          isDialogOpen={isDialogOpen}
          studyGoalId={studyGoalId}
          theStudyGoal={theStudyGoal}
          yearList={yearList}
          monthList={monthList}
          dayList={dayList}
          onSubmitButtonClick={() => {
            fetchGoals();
            fetchTasks();
          }}
        />
      )}
    </Background>
  );
}
