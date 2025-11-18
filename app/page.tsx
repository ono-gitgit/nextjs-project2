"use client";
import { useRouter } from "next/navigation";
import Background from "./components/Background";
import Form from "./components/Form";
import { useState } from "react";
import TitleAndDescription from "./components/TitleAndDescription";

export default function Home() {
  const router = useRouter();
  const [authFaildMessage, setAuthFaildMessage] = useState("");
  const [buttonTitle, setButtonTitle] = useState("ログイン");
  const inputFields = [
    {
      title: "メールアドレス",
      type: "text",
      name: "email",
      id: "email",
      value: "",
      validation: {
        required: "メールアドレスは必須入力です",
        pattern: {
          value: /^\S+[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "メールアドレスを正しく入力してください",
        },
      },
    },
    {
      title: "パスワード",
      type: "text",
      name: "password",
      id: "password",
      value: "",
      validation: {
        required: "パスワードは必須入力です",
        maxLength: {
          value: 20,
          message: "パスワードを２０文字以内で入力して下さい",
        },
      },
    },
  ];

  const onSubmit = async (value: Record<string, string | number>) => {
    setButtonTitle("少々お待ちください...");
    const res = await fetch("/api/users/fetchUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    const user = await res.json();
    if (user.length > 0) {
      const { user_id, daily_study_time } = user[0];
      sessionStorage.setItem("userId", user_id);
      sessionStorage.setItem("dailyStudyTime", daily_study_time);
      router.push("/home");
    } else {
      setAuthFaildMessage("メールアドレス、またはパスワードが間違っています");
      setButtonTitle("ログイン");
    }
  };
  return (
    <Background>
      <TitleAndDescription
        title={"ログイン"}
        description={"アプリを利用するにはログインが必要です"}
      >
        <Form
          message={authFaildMessage}
          inputFields={inputFields}
          onSubmit={onSubmit}
          buttonTitle={buttonTitle}
        >
          <a
            className="mt-5 mx-auto text-blue-600 underline text-[15px] text-center"
            onClick={() => {
              router.push("/createUser");
            }}
          >
            アカウントをお持ちでない方はこちら
          </a>
        </Form>
      </TitleAndDescription>
    </Background>
  );
}
