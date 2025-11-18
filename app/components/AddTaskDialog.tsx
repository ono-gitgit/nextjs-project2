"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type AddTaskDialogProp = {
  setIsDialogOpen: (data: boolean) => void;
  isDialogOpen: boolean;
  studyGoalId: number;
  theStudyGoal: string;
  yearList: Array<number>;
  monthList: Array<number>;
  dayList: Array<number>;
  onSubmitButtonClick: () => void;
};

export default function AddTaskDialog({
  setIsDialogOpen,
  isDialogOpen,
  studyGoalId,
  theStudyGoal,
  yearList,
  monthList,
  dayList,
  onSubmitButtonClick,
}: AddTaskDialogProp) {
  const inputFieldStyle = "border rounded-[5px] w-full mb-5";
  const errorMessageStyle = "text-red-500 -mt-4 mb-5";
  const [userId, setUserId] = useState<string | null>(null);
  // 🟦 ブラウザ環境でのみ sessionStorage を読み込む
  useEffect(() => {
    const storedUserId = sessionStorage.getItem("userId");
    setUserId(storedUserId);
  }, []);
  const defaultValues = {
    studyGoalId,
    task: "",
    field: null,
    priority: 3,
    startDateYear: 0,
    startDateMonth: -1,
    startDateDay: 0,
    deadlineYear: 0,
    deadlineMonth: -1,
    deadlineDay: 0,
    memo: null,
    userId,
  };
  const {
    register,
    reset,
    setValue,
    watch,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  const onSubmit = async (values: Record<string, string | number | null>) => {
    console.log(values);
    const res = await fetch("/api/tasks/createTasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await res.json();
    console.log(result.ok);
    if (result.message === "Task created successfully") {
      alert("タスクを追加しました");
      onSubmitButtonClick();
      reset();
    }
  };

  useEffect(() => {
    setValue("studyGoalId", studyGoalId);
  }, [setValue, studyGoalId]);

  return (
    <Dialog
      open={isDialogOpen}
      onClose={() => {
        setIsDialogOpen(false);
      }}
    >
      <DialogTitle>{theStudyGoal}</DialogTitle>
      <DialogContent>
        <form id="task-add-form" onSubmit={handleSubmit(onSubmit)}>
          タスク
          <textarea
            {...register("task", { required: "タスクは必須入力です" })}
            rows={2}
            className={inputFieldStyle}
          />
          <div className={errorMessageStyle}>{errors.task?.message}</div>
          分野（任意）
          <input
            type="text"
            {...register("field")}
            className={inputFieldStyle}
          />
          優先度：
          <select
            {...register("priority")}
            defaultValue={1}
            className="border rounded-[5px] ml-3 w-16 text-center mb-5"
          >
            <option value={1}>高</option>
            <option value={2}>中</option>
            <option value={3}>低</option>
          </select>
          <br />
          <div className="mb-10">
            開始予定日（任意）
            <br />
            <select
              id="startDateYear"
              {...register("startDateYear", {
                validate: (value) => {
                  if (
                    value != 0 &&
                    // eslint-disable-next-line react-hooks/incompatible-library
                    (watch("startDateYear") === 0 ||
                      watch("startDateDay") === 0)
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
              id="startDateMonth"
              {...register("startDateMonth", {
                validate: (value) => {
                  if (
                    value != -1 &&
                    (watch("startDateYear") === 0 ||
                      watch("startDateDay") === 0)
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
              id="startDateDay"
              {...register("startDateDay", {
                validate: {
                  requiredField: (value) => {
                    if (
                      value != 0 &&
                      (watch("startDateYear") === 0 ||
                        watch("startDateMonth") === 0)
                    ) {
                      return "年と月を選択してださい";
                    }
                    return true;
                  },
                  ngDate: (value) => {
                    const endOfMonth = new Date(
                      watch("startDateYear"),
                      watch("startDateMonth"),
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
          </div>
          <div className={errorMessageStyle}>
            {errors.startDateYear?.message}
          </div>
          <div className={errorMessageStyle}>
            {errors.startDateMonth?.message}
          </div>
          <div className={errorMessageStyle}>
            {errors.startDateDay?.message}
          </div>
          <div className="mb-10">
            期日（任意）
            <br />
            <select
              id="deadlineYear"
              {...register("deadlineYear", {
                validate: (value) => {
                  if (
                    value != 0 &&
                    (watch("deadlineMonth") === 0 || watch("deadlineDay") === 0)
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
              id="deadlineMonth"
              {...register("deadlineMonth", {
                validate: (value) => {
                  if (
                    value != -1 &&
                    (watch("deadlineYear") === 0 || watch("deadlineDay") === 0)
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
              id="deadlineDay"
              {...register("deadlineDay", {
                validate: {
                  requiredField: (value) => {
                    if (
                      value != 0 &&
                      (watch("deadlineYear") === 0 ||
                        watch("deadlineMonth") === 0)
                    ) {
                      return "年と月を選択してださい";
                    }
                    return true;
                  },
                  ngDate: (value) => {
                    const endOfMonth = new Date(
                      watch("deadlineYear"),
                      watch("deadlineMonth"),
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
          </div>
          <div className={errorMessageStyle}>
            {errors.deadlineYear?.message}
          </div>
          <div className={errorMessageStyle}>
            {errors.deadlineMonth?.message}
          </div>
          <div className={errorMessageStyle}>{errors.deadlineDay?.message}</div>
          メモ（任意）
          <textarea
            {...register("memo")}
            rows={3}
            className="border rounded-[5px] w-full"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <button
          type="submit"
          form="task-add-form"
          className="text-blue-500 bg-gray-100 p-2 rounded-[10px] hover:bg-gray-200"
        >
          追加
        </button>
        <button
          onClick={() => {
            setIsDialogOpen(false);
            reset();
          }}
          className="text-pink-500 bg-gray-100 p-2 rounded-[10px] hover:bg-gray-200"
        >
          閉じる
        </button>
      </DialogActions>
    </Dialog>
  );
}
