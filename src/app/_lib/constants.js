/**
 * @typedef {Object} NavLink
 * @property {string} label The text or name displayed for the navigation link.
 * @property {string} path The destination URL or route for the link.
 * @property {string} icon The relative file path to an image or icon.
 */

/** @type {NavLink[]} */
export const navLinks = [
    {
        label: "Summary",
        path: "/",
        icon: "/assets/icons/summary-icon.svg",
    },
    {
        label: "Statements",
        path: "/",
        icon: "/assets/icons/statements-icon.svg",
    },
    {
        label: "Performance",
        path: "/",
        icon: "/assets/icons/performance-icon.svg",
    },
    {
        label: "Calendar",
        path: "/",
        icon: "/assets/icons/calendar-icon.svg",
    },
    {
        label: "Maintenance",
        path: "/",
        icon: "/assets/icons/maintenance-icon.svg",
    },
];
