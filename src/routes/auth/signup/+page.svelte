<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores";
  import { Button, Input } from "$lib/components";

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

<div
  class="bg-secondary flex w-full flex-col items-start gap-4 rounded-xl px-4 py-6"
>
  <div class="flex w-full items-center">
    <h1 class="text-3xl text-black/80">Daftar</h1>
  </div>

  <form
    on:submit|preventDefault={signUp}
    class="flex w-full flex-col items-start gap-8"
  >
    <div class="flex w-full flex-col items-start gap-4">
      <Input
        bind:value={username}
        props={{
          type: "text",
          label: "Nama",
          id: "username",
          name: "username",
          placeholder: "Masukkan nama",
          required: true,
        }}
      />

      <Input
        bind:value={password}
        props={{
          type: "password",
          label: "Kata sandi",
          id: "password",
          name: "password",
          placeholder: "Masukkan kata sandi",
          required: true,
        }}
      />

      <Input
        bind:value={confirmPassword}
        props={{
          type: "password",
          label: "Konfirmasi kata sandi",
          id: "confirmPassword",
          name: "confirmPassword",
          placeholder: "Masukkan konfirmasi kata sandi",
          required: true,
        }}
      />
    </div>

    <Button
      props={{
        text: "Daftar",
      }}
    />
  </form>

  <div class="flex w-full items-center justify-center">
    <p class="text-black/80">
      Sudah punya akun ? <a
        href="/auth/signin"
        class="underline">Masuk</a
      >
    </p>
  </div>
</div>
