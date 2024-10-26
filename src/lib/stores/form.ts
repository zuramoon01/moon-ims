import { get, writable } from "svelte/store";
import { flatten, safeParse } from "valibot";

export function createFormStore<const Schemas extends Record<string, any>>(schemas: Schemas) {
  const fields = Object.keys(schemas) as Array<keyof Schemas>;

  function createInitialStore<InitialValue>(initialValue: InitialValue) {
    return fields.reduce(
      (store, field) => {
        store[field] = initialValue;
        return store;
      },
      {} as Record<keyof Schemas, InitialValue>,
    );
  }

  const inputs = writable(createInitialStore(""));
  const errors = writable(createInitialStore<string[]>([]));

  function validateInput(id: keyof Schemas) {
    errors.update((currentErrors) => {
      const { success, issues } = safeParse(schemas[id], get(inputs)[id]);

      currentErrors[id] = success ? [] : flatten(issues).root || [];

      return currentErrors;
    });
  }

  function hasError() {
    const errorsValues = Object.values(get(errors));

    return errorsValues.some((value) => value.length > 0);
  }

  function resetForm() {
    inputs.set(createInitialStore(""));
    errors.set(createInitialStore([]));
  }

  return {
    inputs,
    errors,
    validateInput,
    hasError,
    resetForm,
  };
}
