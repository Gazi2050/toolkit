import type { Component } from 'svelte';

/**
 * Represents a tool in the toolkit
 */
export interface Tool {
	/** Display title of the tool */
	title: string;
	/** Brief description of what the tool does */
	description: string;
	/** Lucide icon component */
	icon: Component;
	/** Route path to the tool */
	href: string;
}

/**
 * Represents a menu item in the sidebar
 */
export interface MenuItem {
	/** Display title of the menu item */
	title: string;
	/** Route path */
	href: string;
	/** Lucide icon component */
	icon: Component;
}
