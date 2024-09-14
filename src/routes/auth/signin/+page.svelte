<script lang="ts">
  import { goto } from "$app/navigation";
  import { user } from "$lib/store";

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
    class="flex w-[30rem] flex-col items-start gap-10 rounded-md border border-black bg-white px-6 py-8"
  >
    <div class="w-full">
      <h1 class="text-3xl/[100%] font-semibold">Masuk</h1>
    </div>

    <form
      on:submit|preventDefault={signIn}
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
      </div>

      <button
        class="flex h-10 w-full items-center justify-center rounded-sm bg-black text-base/[100%] font-bold text-white"
        >Masuk</button
      >
    </form>
  </div>
</div>
