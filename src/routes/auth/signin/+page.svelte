<script lang="ts">
  import { goto } from "$app/navigation";
  import { passwordSchema, user, usernameSchema } from "$lib/features/user";
  import { addToast, Button, Input } from "$lib/ui";
  import { errorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import * as v from "valibot";

  let state: "idle" | "loading" = "idle";

  let controller: AbortController;

  let username = "";
  let usernameErrors: string[] = [];

  let password = "";
  let passwordErrors: string[] = [];

  function handleValidation(value: string, schema: typeof usernameSchema | typeof passwordSchema) {
    if (value === "") {
      return [];
    }

    const { issues } = v.safeParse(schema, value);

    return issues ? v.flatten(issues).root || [] : [];
  }

  function validateInput(id: "username" | "password") {
    if (id === "username") {
      usernameErrors = handleValidation(username, usernameSchema);
    } else {
      passwordErrors = handleValidation(password, passwordSchema);
    }
  }

  async function signIn() {
    try {
      if (usernameErrors.length > 0 || passwordErrors.length > 0) {
        addToast({
          title: "Warning",
          description: "Silahkan isi form masuk sesuai dengan ketentuan yang diberikan.",
        });

        return;
      }

      if (state === "loading") {
        controller.abort();
      }

      state = "loading";

      controller = new AbortController();

      const { data } = await axios.post(
        "/api/auth/signin",
        {
          username,
          password,
        },
        {
          signal: controller.signal,
        },
      );

      addToast({
        title: "Success",
        description: data.message,
      });

      user.set(data.data);

      goto("/");

      state = "idle";
    } catch (error) {
      errorHandler(error);

      if (!axios.isCancel(error)) {
        state = "idle";
      }
    }
  }
</script>

<div
  class="flex w-full max-w-[25rem] flex-col items-start gap-4 overflow-hidden rounded-lg border border-black/10 bg-white px-4 py-6"
>
  <div class="w-full">
    <h1 class="text-2xl leading-none">Masuk</h1>
  </div>

  <form
    on:submit|preventDefault={signIn}
    class="contents"
  >
    <Input
      bind:value={username}
      on:input={() => {
        validateInput("username");
      }}
      label="Nama"
      errorMessages={usernameErrors}
      attr={{
        type: "text",
        id: "username",
        name: "username",
        placeholder: "Nama akun",
        required: true,
      }}
    />

    <Input
      bind:value={password}
      on:input={() => {
        validateInput("password");
      }}
      label="Kata Sandi"
      errorMessages={passwordErrors}
      attr={{
        type: "password",
        id: "password",
        name: "password",
        placeholder: "Kata sandi",
        required: true,
      }}
    />

    <Button
      state={state}
      text="Masuk"
    />
  </form>

  <div class="flex w-full items-center justify-center">
    <p class="text-black/60">
      Belum punya akun ? <a
        href="/auth/signup"
        class={clsx("underline", "hover:text-black/80")}>Daftar</a
      >
    </p>
  </div>
</div>
