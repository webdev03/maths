import { renderToString } from "katex";

export default (commands: string) =>
  renderToString(commands, {
    output: "mathml"
  });
