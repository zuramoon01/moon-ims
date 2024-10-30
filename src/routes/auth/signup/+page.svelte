<script lang="ts">
  import { goto } from "$app/navigation";
  import { AuthForm } from "$lib/components";
  import {
    ConfirmPasswordSchema,
    getAuthResponseData,
    PasswordSchema,
    UsernameSchema,
  } from "$lib/features/user";
  import { addToasts, createFormStore, Route, user } from "$lib/stores";
  import type { Status } from "$lib/types";
  import { Button, Input } from "$lib/ui";
  import { clientErrorHandler } from "$lib/utils";
  import axios from "axios";
  import clsx from "clsx";

  let status: Status = $state("idle");

  let controller: AbortController;

  const { inputs, errors, validateInput, hasError } = createFormStore({
    username: UsernameSchema,
    password: PasswordSchema,
    confirmPassword: ConfirmPasswordSchema,
  });

  async function signUp(
    e: SubmitEvent & {
      currentTarget: EventTarget & HTMLFormElement;
    },
  ) {
    try {
      e.preventDefault();

      if (hasError()) {
        return addToasts({
          type: "warning",
          title: "Form Daftar Gagal",
          description: "Silahkan isi data pada form daftar sesuai dengan ketentuan yang diberikan.",
        });
      }

      if (status === "loading" && controller) {
        controller.abort();
      }

      status = "loading";

      controller = new AbortController();

      const response = await axios.post(Route.Api.Auth.SignUp, $inputs, {
        signal: controller.signal,
      });

      const { message, data: userData } = getAuthResponseData(response.data);

      user.set(userData);

      addToasts({
        type: "success",
        title: "Berhasil",
        description: message,
      });

      goto(Route.Dashboard);
    } catch (error) {
      if (axios.isCancel(error)) {
        return;
      }

      clientErrorHandler(error);
    }

    status = "idle";
  }
</script>

<svelte:head>
  <title>Moon IMS | Daftar</title>
</svelte:head>

<AuthForm title="Daftar">
  <form
    onsubmit={signUp}
    class="contents"
  >
    <Input
      bind:value={$inputs.username}
      label="Nama"
      errorMessages={$errors.username}
      attr={{
        type: "text",
        id: "username",
        name: "username",
        placeholder: "Nama akun",
        required: true,
        oninput: () => {
          validateInput("username");
        },
      }}
    />

    <Input
      bind:value={$inputs.password}
      label="Kata Sandi"
      errorMessages={$errors.password}
      attr={{
        type: "password",
        id: "password",
        name: "password",
        placeholder: "Kata sandi",
        required: true,
        oninput: () => {
          validateInput("password");
        },
      }}
    />

    <Input
      bind:value={$inputs.confirmPassword}
      label="Konfirmasi Kata Sandi"
      errorMessages={$errors.confirmPassword}
      attr={{
        type: "password",
        id: "confirmPassword",
        name: "confirmPassword",
        placeholder: "Konfirmasi Kata sandi",
        required: true,
        oninput: () => {
          validateInput("confirmPassword");
        },
      }}
    />

    <Button
      text="Daftar"
      {status}
    />
  </form>

  {#snippet footer()}
    <p class="text-black/60">
      Sudah punya akun ? <a
        href="/auth/signin"
        class={clsx("underline", "hover:text-black/80")}>Masuk</a
      >
    </p>
  {/snippet}
</AuthForm>
