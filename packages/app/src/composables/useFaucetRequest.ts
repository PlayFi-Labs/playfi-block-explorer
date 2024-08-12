import { ref } from "vue";

import { $fetch, FetchError } from "ohmyfetch";

import useContext from "@/composables/useContext";

import type { FaucetRequestData } from "@/types";

type FaucetRequestStatusResponse = {
  error?: string;
};

class FaucetRequestError extends Error {
  constructor(message: string, public readonly response: FaucetRequestStatusResponse) {
    super(message);

    Object.setPrototypeOf(this, FaucetRequestError.prototype);
  }
}

export default (context = useContext()) => {
  const isRequestPending = ref(false);
  const isRequestFailed = ref(false);
  const isRequestProcessed = ref(false);
  const faucetRequestErrorMessage = ref<string | null>(null);

  const requestTokens = async (data: FaucetRequestData) => {
    isRequestPending.value = true;
    isRequestFailed.value = false;
    isRequestProcessed.value = false;
    faucetRequestErrorMessage.value = null;
    try {
      const { ...payload } = data;
      const response = await $fetch(`${context.currentNetwork.value.faucetApiUrl}/faucet_request`, {
        method: "POST",
        body: {
          receivingAddress: payload.receivingAddress,
        },
      });
      if (response.success === "false") {
        isRequestFailed.value = true;
        faucetRequestErrorMessage.value = response.error;
      }
    } catch (error: unknown) {
      isRequestFailed.value = true;
      if (error instanceof FetchError) {
        faucetRequestErrorMessage.value = error.data ?? error.message;
      } else if (error instanceof FaucetRequestError) {
        faucetRequestErrorMessage.value = error.message;
      }
    } finally {
      isRequestPending.value = false;
      isRequestProcessed.value = true;
    }
  };

  return {
    isRequestPending,
    isRequestFailed,
    isRequestProcessed,
    faucetRequestErrorMessage,
    requestTokens,
  };
};
