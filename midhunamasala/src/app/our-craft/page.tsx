import type { Metadata } from 'next';
import OurCraftPage from '@/components/our-craft/OurCraftPage';

export const metadata: Metadata = {
  title: 'The Ancient Craft — Ammikall, Aatukal & Chakki | Midhuna Masala',
  description:
    'Discover the timeless benefits of traditional stone grinding tools — Ammikall, Aatukal, and Chakki. Learn why stone-ground spices retain more nutrients, flavour, and aroma than machine-ground alternatives.',
};

export default function Page() {
  return <OurCraftPage />;
}
