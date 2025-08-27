'use client';

import Box from '@mui/joy/Box';
import { HomeWelcome } from '@/components/Home/HomeWelcome';
import { HomeFeatures } from '@/components/Home/HomeFeatures';
import { HomeOverview } from '@/components/Home/HomeOverview';

export default function Home() {
  return (
    <Box component="main">
      <HomeWelcome />
      <HomeFeatures />
      <HomeOverview />
    </Box>
  );
}