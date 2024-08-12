<template>
  <div>
    <div class="head-block">
      <Breadcrumbs :items="breadcrumbItems" />
      <SearchForm class="search-form" />
    </div>
    <h1>{{ t("faucet.title") }}</h1>
    <p class="subtitle">{{ t("faucet.subtitle") }}</p>
    <ContentCard
      v-if="!isRequestProcessed || isRequestFailed"
      tag="form"
      class="form-container"
      autocomplete="off"
      @submit.prevent="submitForm"
    >
      <Alert type="notification" class="full-grid-width">
        <i18n-t scope="global" keypath="faucet.resources.maxdistribution" tag="span"> </i18n-t>
      </Alert>

      <Alert v-if="isRequestFailed || faucetRequestErrorMessage" class="error-alert">
        {{ faucetRequestErrorMessage ? faucetRequestErrorMessage : t("contractVerification.form.unknownError") }}
      </Alert>

      <h3 class="form-subheading">{{ t("faucet.form.receivingAddress.title") }}</h3>
      <FormItem id="receivingAddress" class="half-grid-width">
        <Input
          id="receivingAddress"
          type="text"
          :disabled="isRequestPending"
          :placeholder="t('faucet.form.receivingAddress.placeholder')"
          :error="
            v$.receivingAddress.$error
              ? v$.receivingAddress.$errors[0] && v$.receivingAddress.$errors[0].$message.toString()
              : undefined
          "
          v-model="form.receivingAddress"
        />
        <template #underline>{{ t("faucet.form.receivingAddress.underline") }}</template>
      </FormItem>

      <div class="form-divider"></div>

      <div class="form-footer half-grid-width">
        <Button type="submit" :loading="isRequestPending" :disabled="disabledSubmitButton">
          {{ isRequestPending ? t("faucet.form.buttonVerifying") : t("faucet.form.buttonVerify") }}
        </Button>
        <Button variant="outlined" :disabled="disabledClearButton" @click="clearForm">
          {{ t("faucet.form.buttonClear") }}
        </Button>
      </div>
    </ContentCard>
    <SuccessScreen v-else class="content-container" :receiving-address="(form.receivingAddress as Address)" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import { ExclamationIcon } from "@heroicons/vue/outline";
import { useVuelidate } from "@vuelidate/core";
import { createI18nMessage, required } from "@vuelidate/validators";

import ContentCard from "@/components/ContentCard.vue";
import SearchForm from "@/components/SearchForm.vue";
import Alert from "@/components/common/Alert.vue";
import Breadcrumbs from "@/components/common/Breadcrumbs.vue";
import Button from "@/components/common/Button.vue";
import Input from "@/components/common/Input.vue";
import SuccessScreen from "@/components/contract/faucet/SuccessScreen.vue";
import FormItem from "@/components/form/FormItem.vue";

import useFaucetRequest from "@/composables/useFaucetRequest";

import type { BreadcrumbItem } from "@/components/common/Breadcrumbs.vue";

import { type Address, type FaucetRequestData } from "@/types";
import { isAddress } from "@/utils/validators";

const route = useRoute();
const { t } = useI18n();
const withI18nMessage = createI18nMessage({ t });
const { isRequestPending, isRequestFailed, isRequestProcessed, faucetRequestErrorMessage, requestTokens } =
  useFaucetRequest();

const breadcrumbItems = computed((): BreadcrumbItem[] => [
  {
    text: t("breadcrumbs.home"),
    to: { name: "home" },
  },
  {
    text: `${t("faucet.title")}`,
  },
]);

const disabledSubmitButton = computed(() => {
  return isRequestPending.value;
});
const disabledClearButton = computed(() => {
  return isRequestPending.value;
});

const defaultValues = computed<FaucetRequestData>(() => {
  return {
    receivingAddress: "",
  };
});

const form = ref(
  Object.assign({}, defaultValues.value, {
    receivingAddress: route.query.address ?? defaultValues.value.receivingAddress,
  })
);

const v$ = useVuelidate(
  {
    receivingAddress: {
      required: withI18nMessage(required, {
        messagePath: () => "faucet.form.receivingAddress.validation.required",
      }),
    },
    compilerVersion: {
      isReceivingAddress: withI18nMessage(isAddress, {
        messagePath: () => "faucet.form.receivingAddress.validation.not_valid",
      }),
    },
  },
  form
);

function clearForm() {
  form.value = Object.assign({}, defaultValues.value);
}
async function submitForm() {
  const validationResult = await v$.value.$validate();
  if (!validationResult) {
    return;
  }
  const commonData = {
    receivingAddress: form.value.receivingAddress,
  };
  await requestTokens({
    ...commonData,
  });
}
</script>

<style lang="scss" scoped>
.head-block {
  @apply mb-8 flex flex-col-reverse justify-between lg:mb-10 lg:flex-row;

  .search-form {
    @apply mb-6 w-full max-w-[26rem] lg:mb-0;
  }
}
.subtitle {
  @apply mt-2 text-sm text-black;
}
.form-container {
  @apply md:grid-cols-4;

  .half-grid-width {
    @apply md:col-span-2;
  }
  .full-grid-width,
  .content-title,
  .form-subheading,
  .error-alert,
  .form-divider {
    @apply md:col-span-4;
  }

  .form-subheading {
    @apply text-xl text-neutral-700;
  }

  .form-divider {
    @apply w-full border-t;
  }
  .form-footer {
    @apply flex flex-col items-center sm:flex-row;

    .button {
      @apply w-full max-w-xs sm:w-max;
    }
    .button:nth-child(2) {
      @apply mt-2 sm:ml-4 sm:mt-0;
    }
  }
  .contract-dropdowns-container {
    @apply grid gap-4 md:grid-cols-2;
    .docs-link {
      @apply float-right rounded-md px-0.5 pt-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600;
    }
  }
}
</style>
