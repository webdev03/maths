import Root from './header.svelte';

type HeaderSize = 'h1' | 'h2' | 'h3' | 'h4';

type Props = {
	size: HeaderSize;
};

export { Root, type Props, Root as Header, type Props as HeaderProps };
