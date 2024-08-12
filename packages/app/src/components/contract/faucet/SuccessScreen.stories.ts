import SuccessScreen from "./SuccessScreen.vue";

export default {
  title: "Contract/Faucet/SuccessScreen",
  component: SuccessScreen,
};

type Args = {
  receivingAddress: string;
};

const Template = (args: Args) => ({
  components: { SuccessScreen },
  setup() {
    return { args };
  },
  template: `<SuccessScreen v-bind="args" />`,
});

export const Default = Template.bind({}) as unknown as { args: Args };

Default.args = {
  receivingAddress: "0x0150673c86121237ac004dbd3371c03f481e4dc3",
};
