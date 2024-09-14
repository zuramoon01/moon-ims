<script>
  import { goto } from "$app/navigation";
  import { user } from "$lib/store";

  async function signout() {
    const response = await fetch("/api/auth/signout", {
      method: "POST",
    });

    if (response.ok) {
      user.set(null);

      goto("/");
    }
  }
</script>

<a href="/auth/signin">masuk</a>
<a href="/auth/signup">daftar</a>
<button on:click={signout}>keluar</button>
