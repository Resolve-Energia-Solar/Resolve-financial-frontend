export async function register() {
    if (process.env.NEXT_PUBLIC_RUNTIME === "nodejs") {
        await import("./sentry.server.config");
    }
    if (process.env.NEXT_PUBLIC_RUNTIME === "edge") {
        await import("./sentry.edge.config");
    }
}