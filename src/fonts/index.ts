import localFont from "next/font/local";

export const font_GMonoTrustDisplay = localFont({
    src: "../../public/fonts/momofont.ttf", // ← Correct relative path
    display: "swap",
    variable: "--font-gmono-trust", // Optional: for CSS variable usage
});