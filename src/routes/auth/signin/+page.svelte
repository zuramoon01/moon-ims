<script lang="ts">
  import { goto } from "$app/navigation";
  import { InputEmail, InputPassword } from "$lib/components";
  import { user } from "$lib/stores";

  let email = "";
  let password = "";

  async function signIn() {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
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
      <h1 class="text-3xl/[100%] font-semibold">Masuk</h1>
    </div>

    <div class="flex w-full flex-col items-start gap-6">
      <form
        on:submit|preventDefault={signIn}
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

          <InputPassword
            bind:value={password}
            props={{
              text: "Kata sandi",
              id: "password",
              placeholder: "Masukkan kata sandi",
            }}
          />
        </div>

        <button
          class="flex h-10 w-full items-center justify-center rounded-sm bg-black text-base/[100%] font-bold text-white"
          >Masuk</button
        >
      </form>

      <div class="flex w-full items-center justify-center">
        <span class="text-base/[100%]"
          >Belum punya akun ? <a
            href="/auth/signup"
            class="font-bold underline">Daftar</a
          ></span
        >
      </div>
    </div>
  </div>
</div>
