import DefaultTheme from "vitepress/theme";
import Cite from "./Cite.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component("Cite", Cite);
  },
};
