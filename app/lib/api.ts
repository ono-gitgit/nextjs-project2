"use server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcrypt";

const sql = neon(`${process.env.DATABASE_URL}`);

//ログインしようとしているユーザー情報の取得
export async function fetchUser(email: string, password: string) {
  const user =
    await sql`SELECT user_id, user_name, password_hash, daily_sutudy_time, is_deleted FROM users 
      WHERE email=${email}`;
  if (user.length > 0) {
    const match = await bcrypt.compare(password, user[0].password_hash);
    if (match) {
      // 認証成功
      return user;
    }
  }
}

//ユーザー登録処理
export async function createUser(
  userName: string,
  email: string,
  passwordHash: string
) {
  await sql`INSERT INTO users(user_name, email, password_hash, is_deleted) VALUES (${userName}, ${email}, ${passwordHash}, ${false})`;
}

// //学習目標の追加（目標のみ）
export async function createStudyGoal(
  goal: string,
  year: number,
  month: number,
  day: number,
  userId: string
) {
  const userIdTypeNumber = Number(userId);
  try {
    if (year === 0) {
      await sql`INSERT INTO study_goals(study_goal, user_id) VALUES (${goal}, ${userIdTypeNumber})`;
    } else {
      const deadline =
        year +
        "-" +
        String(month).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0");
      console.log(userIdTypeNumber);
      await sql`INSERT INTO study_goals(study_goal, deadline, user_id) VALUES (${goal},${deadline}, ${userIdTypeNumber})`;
    }
    const data =
      await sql`SELECT study_goal_id AS "studyGoalId" FROM study_goals 
          WHERE study_goal_id = (SELECT MAX(study_goal_id) FROM study_goals)`;
    return data[0];
  } catch (error) {
    console.error(error);
    throw new Error("failed to create study goal");
  }
}

//学習目標情報の取得
export async function fetchStudyGoals(userId: string) {
  try {
    const userIdTypeNumber = Number(userId);
    const data =
      await sql`SELECT study_goal_id AS "studyGoalId", study_goal AS "studyGoal", 
          memo, deadline FROM study_goals WHERE user_id = ${userIdTypeNumber}`;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("failed to fetch study goal");
  }
}

//タスクの取得
export async function fetchTasks(userId: string) {
  try {
    const userIdTypeNumber = Number(userId);
    const data = await sql`SELECT 
        s.study_goal_id AS "studyGoalId",t.task AS task, 
        t.field AS field, t.priority AS priority, 
        t.deadline AS "tsakDealline", t.progress AS progress, 
        t.start_date AS "taskStartDate", t.end_date AS "tsakEndDate", 
        t.memo AS "taskMemo" 
        FROM tasks t
        INNER JOIN study_goals s ON t.study_goal_id = s.study_goal_id
        WHERE s.user_id = ${userIdTypeNumber} ORDER BY t.priority, t.deadline DESC`;
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("failed to fetch tasks");
  }
}

//タスクの登録
export async function createTask(
  studyGoalId: number,
  task: string,
  field: string | null,
  priority: number,
  startDate: string | null,
  deadline: string | null,
  userId: string,
  memo: string | null
) {
  try {
    await sql`INSERT INTO tasks(task, field, priority, start_date, deadline, user_id, study_goal_id, memo) 
     VALUES (${task}, ${field}, ${priority}, ${startDate}, ${deadline}, ${userId}, ${studyGoalId}, ${memo})`;
  } catch (error) {
    console.error(error);
    throw new Error("failed to insert the task");
  }
}
