<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/stores";

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
    class="flex w-[30rem] flex-col items-start gap-10 rounded-md border border-black bg-white px-6 py-8"
  >
    <div class="w-full">
      <h1 class="text-3xl/[100%] font-semibold">Daftar</h1>
    </div>

    <form
      on:submit|preventDefault={signUp}
      class="flex w-full flex-col items-start gap-8"
    >
      <div class="flex w-full flex-col items-start gap-6">
        <div class="relative w-full">
          <label
            for="email"
            class="absolute -top-[calc(theme(fontSize.sm)_/_2)] left-2 bg-white px-2 text-sm/[100%] font-bold"
            >Email</label
          >

          <input
            type="email"
            id="email"
            name="email"
            bind:value={email}
            placeholder="Masukkan email"
            class="h-10 w-full rounded-sm border border-black px-4 text-base/[100%]"
          />
        </div>

        <div class="relative w-full">
          <label
            for="nama"
            class="absolute -top-[calc(theme(fontSize.sm)_/_2)] left-2 bg-white px-2 text-sm/[100%] font-bold"
            >Nama</label
          >

          <input
            type="text"
            id="nama"
            name="nama"
            bind:value={username}
            placeholder="Masukkan nama"
            class="h-10 w-full rounded-sm border border-black px-4 text-base/[100%]"
          />
        </div>

        <div class="relative w-full">
          <label
            for="password"
            class="absolute -top-[calc(theme(fontSize.sm)_/_2)] left-2 bg-white px-2 text-sm/[100%] font-bold"
            >Kata sandi</label
          >

          <input
            type="password"
            id="password"
            name="password"
            bind:value={password}
            placeholder="Masukkan kata sandi"
            class="h-10 w-full rounded-sm border border-black px-4 text-base/[100%]"
          />
        </div>

        <div class="relative w-full">
          <label
            for="confirmPassword"
            class="absolute -top-[calc(theme(fontSize.sm)_/_2)] left-2 bg-white px-2 text-sm/[100%] font-bold"
            >Konfirmasi kata sandi</label
          >

          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            bind:value={confirmPassword}
            placeholder="Masukkan konfirmasi kata sandi"
            class="h-10 w-full rounded-sm border border-black px-4 text-base/[100%]"
          />
        </div>
      </div>

      <button
        class="flex h-10 w-full items-center justify-center rounded-sm bg-black text-base/[100%] font-bold text-white"
        >Daftar</button
      >
    </form>
  </div>
</div>
