import {NavLink} from "@/components/ui/NavLink";
import {getTranslations} from "next-intl/server";


export default async function NotFound() {
    const t = await getTranslations("AppNav");
    return (
        <main className="min-h-screen bg-ground text-ink page-wrap flex flex-col justify-center">
            <p className="label text-ink-ghost mb-sm">404</p>
            <h1 className="font-display italic text-headline leading-headline text-ink mb-md">
                {t("not_found_title")}
            </h1>
            <p className="font-body text-body leading-body text-ink-secondary max-w-prose mb-lg">
                {t("not_found_message")}
            </p>
            <NavLink href="/">
                {t("return_home")}
            </NavLink>
        </main>
    );
}