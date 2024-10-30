import { get, writable } from "svelte/store";
import { flatten, safeParse } from "valibot";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createFormStore<const Schemas extends Record<string, any>>(
  schemas: Schemas,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialValue?: Record<keyof Schemas, any>,
) {
  const fields = Object.keys(schemas) as (keyof Schemas)[];

  function createInitialStore<InitialValue>(initialValue: InitialValue) {
    return fields.reduce(
      (store, field) => {
        store[field] = initialValue;
        return store;
      },
      {} as Record<keyof Schemas, InitialValue>,
    );
  }

  const inputs = writable(initialValue ?? createInitialStore(""));
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
