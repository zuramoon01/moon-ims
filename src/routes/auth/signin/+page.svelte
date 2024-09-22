<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button, Input } from "$lib/components";
  import { user } from "$lib/stores";

  let username = "";
  let password = "";

  async function signIn() {
    const response = await fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
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

<div
  class="bg-secondary flex w-full flex-col items-start gap-4 rounded-xl px-4 py-6"
>
  <div class="flex w-full items-center">
    <h1 class="text-3xl text-black/80">Masuk</h1>
  </div>

  <form
    on:submit|preventDefault={signIn}
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
    </div>

    <Button
      props={{
        text: "Masuk",
      }}
    />
  </form>

  <div class="flex w-full items-center justify-center">
    <p class="text-black/80">
      Belum punya akun ? <a
        href="/auth/signup"
        class="underline">Daftar</a
      >
    </p>
  </div>
</div>
