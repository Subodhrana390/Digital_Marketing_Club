import { notFound } from "next/navigation";

export default function MembersPage() {
    // This page is no longer used directly.
    // We are redirecting to the core team page as a default.
    // In a real-world scenario, you might want a different landing page
    // or simply remove this and adjust links. For now, we'll use notFound.
    notFound();
}
