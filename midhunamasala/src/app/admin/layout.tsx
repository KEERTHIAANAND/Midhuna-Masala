import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Dashboard | Midhuna Masala",
    description: "Midhuna Masala Administration Dashboard - Manage products, orders, and customers.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
}
