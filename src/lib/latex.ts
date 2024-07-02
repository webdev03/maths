import * as katex from 'katex';
// @ts-ignore
const { renderToString } = katex.default;

export default (commands: string) =>
	renderToString(commands, {
		output: 'mathml'
	});
