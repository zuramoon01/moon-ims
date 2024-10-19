<script lang="ts">
  import { goto } from "$app/navigation";
  import { getAuthResponseData, passwordSchema, user, usernameSchema } from "$lib/features/user";
  import { addToast, Button, Input } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";
  import { flatten, safeParse } from "valibot";

  let state: "idle" | "loading" = "idle";

  let controller: AbortController;

  const inputs = {
    username: "",
    password: "",
  };
  const validations = {
    username: usernameSchema,
    password: passwordSchema,
  } as const;
  const errors: {
    username: string[];
    password: string[];
  } = {
    username: [],
    password: [],
  };

  function validateInput(id: keyof typeof inputs) {
    const { issues } = safeParse(validations[id], inputs[id]);

    errors[id] = issues ? flatten(issues).root || [] : [];
  }

  async function signIn() {
    try {
      if (errors.username.length > 0 || errors.password.length > 0) {
        return addToast({
          title: "Warning",
          description: "Silahkan isi form masuk sesuai dengan ketentuan yang diberikan.",
        });
      }

      if (state === "loading" && controller) {
        controller.abort();
      }

      state = "loading";

      controller = new AbortController();

      const response = await axios.post("/api/auth/signin", inputs, {
        signal: controller.signal,
      });

      const data = getAuthResponseData(response.data);

      if (!data) {
        return addToast({
          title: "Warning",
          description: "Payload tidak sesuai.",
        });
      }

      user.set(data.data);

      addToast({
        title: "Success",
        description: data.message,
      });

      state = "idle";

      goto("/");
    } catch (error) {
      clientErrorHandler(error);

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
      bind:value={inputs.username}
      on:input={() => {
        validateInput("username");
      }}
      label="Nama"
      errorMessages={errors.username}
      attr={{
        type: "text",
        id: "username",
        name: "username",
        placeholder: "Nama akun",
        required: true,
      }}
    />

    <Input
      bind:value={inputs.password}
      on:input={() => {
        validateInput("password");
      }}
      label="Kata Sandi"
      errorMessages={errors.password}
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
