<template>
  <ContentCard class="success-screen">
    <div class="icon-container">
      <CheckIcon class="h-6 w-6 text-white" />
    </div>
    <h2 class="content-title">{{ t("faucet.success.title") }}</h2>
    <a target="_self" :href="`/faucet`">
      <Button class="back-button">
        {{ t("faucet.success.back") }}
      </Button>
    </a>
  </ContentCard>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";

import { CheckIcon } from "@heroicons/vue/outline";

import AddressLink from "@/components/AddressLink.vue";
import ContentCard from "@/components/ContentCard.vue";
import Button from "@/components/common/Button.vue";

import type { Address } from "@/types";
import type { PropType } from "vue";
defineProps({
  receivingAddress: {
    type: String as PropType<Address>,
    required: true,
  },
});
const { t } = useI18n();
</script>

<style lang="scss" scoped>
.success-screen {
  @apply justify-center py-14 text-center;
  .icon-container {
    @apply mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-600;
  }
  .block-explorer-link {
    @apply decoration-dashed;
  }
  .back-button {
    @apply mx-auto w-max;
  }
  .back-button-link {
    @apply no-underline;
  }
}
</style>
