export default function getServerHostName() {
    return (process.env.VERCEL_URL ? process.env.VERCEL_URL : (
        process.env.SERVER_NEXT_PUBLIC_SITE_URL ? process.env.SERVER_NEXT_PUBLIC_SITE_URL : window.location.origin
    )).replace(/\/$/, "");
}