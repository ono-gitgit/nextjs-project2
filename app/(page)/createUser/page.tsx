"use client";

import Background from "@/app/components/Background";
import Form from "@/app/components/Form";
import TitleAndDescription from "@/app/components/TitleAndDescription";

export default function CreateUser() {
  const inputFields = [
    {
      title: "名前",
      type: "text",
      name: "userName",
      id: "userName",
      value: "",
      validation: {
        required: "名前は必須入力です",
        MaxLength: {
          value: 50,
          message: "パスワードを２０文字以内で入力して下さい",
        },
      },
    },
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
    try {
      const res = await fetch("/api/users/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });
      if (res.ok) {
        alert("登録できました");
      }
    } catch (Error) {
      console.error(Error);
    }
  };
  return (
    <Background>
      <TitleAndDescription
        title={"アカウント作成"}
        description={"アプリを利用するにはアカウントが必要です"}
      >
        <Form
          inputFields={inputFields}
          onSubmit={onSubmit}
          buttonTitle={"登録"}
        ></Form>
      </TitleAndDescription>
    </Background>
  );
}
