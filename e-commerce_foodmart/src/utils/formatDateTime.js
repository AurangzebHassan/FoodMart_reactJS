export function formatDateTime(isoString, { withTime = false } = {}) {
    const date = new Date(isoString);

    const datePart = date.toLocaleDateString("en-US", {
        weekday: "long",     // Tuesday
        year: "numeric",     // 2025
        month: "long",       // December
        day: "2-digit"       // 02
    });

    if (!withTime) return datePart;

    const timePart = date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    return `${datePart}, ${timePart}`;
}