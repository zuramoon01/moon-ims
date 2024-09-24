<script lang="ts">
  import * as v from "valibot";
  import { passwordSchema, usernameSchema } from "$lib/types";
  import axios, { AxiosError } from "axios";
  import { goto } from "$app/navigation";
  import { addToast, user } from "$lib/stores";
  import { Button, Input } from "$lib/components";

  let state: "idle" | "loading" = "idle";

  let controller = new AbortController();

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
          description: "Silahkan isi form masuk terlebih dahulu.",
        });

        return;
      }

      if (state === "loading") {
        controller.abort();
        controller = new AbortController();
      }

      if (state === "idle") {
        state = "loading";
      }

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
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const { data, status, headers } = error.response;

          addToast({
            title: "Error",
            description: data.message,
          });

          console.log({ data, status, headers });
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
      }
    }

    state = "idle";
  }
</script>

<div class="flex w-full flex-col items-start gap-4 rounded-xl bg-secondary px-4 py-6">
  <div class="flex w-full items-center">
    <h1 class="text-3xl text-black/80">Masuk</h1>
  </div>

  <form
    on:submit|preventDefault={signIn}
    autocomplete="off"
    class="flex w-full flex-col items-start gap-8"
  >
    <div class="flex w-full flex-col items-start gap-4">
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
        label="Kata Sandi"
        errorMessages={passwordErrors}
        attr={{
          type: "password",
          id: "password",
          name: "password",
          placeholder: "Masukkan kata sandi",
          required: true,
        }}
      />
    </div>

    <Button
      state={state}
      text={"Masuk"}
    ></Button>
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
