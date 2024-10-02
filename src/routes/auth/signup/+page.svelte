<script lang="ts">
  import * as v from "valibot";
  import { confirmPasswordSchema, passwordSchema, usernameSchema } from "$lib/types";
  import axios from "axios";
  import { goto } from "$app/navigation";
  import { addToast, user } from "$lib/stores";
  import { errorHandler } from "$lib/utils";
  import { Button, Input } from "$lib/components";
  import { clsx } from "clsx";

  let state: "idle" | "loading" = "idle";

  let controller: AbortController;

  let username = "";
  let usernameErrors: string[] = [];

  let password = "";
  let passwordErrors: string[] = [];

  let confirmPassword = "";
  let confirmPasswordErrors: string[] = [];

  function handleValidation(
    value: string,
    schema: typeof usernameSchema | typeof passwordSchema | typeof confirmPasswordSchema,
  ) {
    if (value === "") {
      return [];
    }

    const { issues } = v.safeParse(schema, value);

    return issues ? v.flatten(issues).root || [] : [];
  }

  function validateInput(id: "username" | "password" | "confirmPassword") {
    if (id === "username") {
      usernameErrors = handleValidation(username, usernameSchema);
    } else if (id === "password") {
      passwordErrors = handleValidation(password, passwordSchema);
    } else {
      confirmPasswordErrors = handleValidation(confirmPassword, confirmPasswordSchema);
    }
  }

  async function signUp() {
    try {
      if (
        usernameErrors.length > 0 ||
        passwordErrors.length > 0 ||
        confirmPasswordErrors.length > 0
      ) {
        addToast({
          title: "Warning",
          description: "Silahkan isi form daftar sesuai dengan ketentuan yang diberikan.",
        });

        return;
      }

      if (state === "loading") {
        controller.abort();
      }

      state = "loading";

      controller = new AbortController();

      const { data } = await axios.post(
        "/api/auth/signup",
        {
          username,
          password,
          confirmPassword,
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
    <h1 class="text-2xl leading-none">Daftar</h1>
  </div>

  <form
    on:submit|preventDefault={signUp}
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
        placeholder: "Masukkan nama",
        required: true,
      }}
    />

    <Input
      bind:value={password}
      on:input={() => {
        validateInput("password");
      }}
      label="Kata sandi"
      errorMessages={passwordErrors}
      attr={{
        type: "password",
        id: "password",
        name: "password",
        placeholder: "Masukkan kata sandi",
        required: true,
      }}
    />

    <Input
      bind:value={confirmPassword}
      on:input={() => {
        validateInput("confirmPassword");
      }}
      label="Konfirmasi kata sandi"
      errorMessages={confirmPasswordErrors}
      attr={{
        type: "password",
        id: "confirmPassword",
        name: "confirmPassword",
        placeholder: "Masukkan konfirmasi kata sandi",
        required: true,
      }}
    />

    <Button
      state={state}
      text={"Daftar"}
    />
  </form>

  <div class="flex w-full items-center justify-center">
    <p class="text-black/60">
      Sudah punya akun ? <a
        href="/auth/signin"
        class={clsx("underline", "hover:text-black/80")}>Masuk</a
      >
    </p>
  </div>
</div>
