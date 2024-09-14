<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores";
  import { InputEmail, InputPassword, InputText } from "$lib/components";

  let email = "";
  let username = "";
  let password = "";
  let confirmPassword = "";

  async function signUp() {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        username,
        password,
        confirmPassword,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      user.set(result.data);

      goto("/");
    }
  }
</script>

<div class="flex min-h-dvh w-full items-center justify-center">
  <div
    class="flex w-[25rem] flex-col items-start gap-10 rounded-md border border-black bg-white px-6 py-8"
  >
    <div class="w-full">
      <h1 class="text-3xl/[100%] font-semibold">Daftar</h1>
    </div>

    <div class="flex w-full flex-col items-start gap-6">
      <form
        on:submit|preventDefault={signUp}
        class="flex w-full flex-col items-start gap-8"
      >
        <div class="flex w-full flex-col items-start gap-6">
          <InputEmail
            bind:value={email}
            props={{
              text: "Email",
              id: "email",
              placeholder: "Masukkan email",
            }}
          />

          <InputText
            bind:value={username}
            props={{
              text: "Nama",
              id: "nama",
              placeholder: "Masukkan nama",
            }}
          />

          <InputPassword
            bind:value={password}
            props={{
              text: "Kata sandi",
              id: "password",
              placeholder: "Masukkan kata sandi",
            }}
          />

          <InputPassword
            bind:value={confirmPassword}
            props={{
              text: "Konfirmasi kata sandi",
              id: "confirmPassword",
              placeholder: "Masukkan konfirmasi kata sandi",
            }}
          />
        </div>

        <button
          class="flex h-10 w-full items-center justify-center rounded-sm bg-black text-base/[100%] font-bold text-white"
          >Daftar</button
        >
      </form>

      <div class="flex w-full items-center justify-center">
        <span class="text-base/[100%]"
          >Sudah punya akun ? <a
            href="/auth/signin"
            class="font-bold underline">Masuk</a
          ></span
        >
      </div>
    </div>
  </div>
</div>
