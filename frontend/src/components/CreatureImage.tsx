'use client';

import Image from 'next/image';
import { type TierName } from '@/lib/mock-data';

const CREATURE_IMAGES: Record<TierName, string> = {
  Kozo: '/creatures/kozo.jpg',
  Senpai: '/creatures/senpai.jpg',
  Tatsujin: '/creatures/tatsujin.jpg',
  Sensei: '/creatures/sensei.jpg',
};

const CREATURE_SIZES: Record<TierName, number> = {
  Kozo: 40,
  Senpai: 52,
  Tatsujin: 64,
  Sensei: 80,
};

interface CreatureImageProps {
  tier: TierName;
  size?: number;
  className?: string;
}

export default function CreatureImage({ tier, size, className = '' }: CreatureImageProps) {
  const s = size || CREATURE_SIZES[tier];
  return (
    <Image
      src={CREATURE_IMAGES[tier]}
      alt={`${tier} creature`}
      width={s}
      height={s}
      className={className}
      style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
    />
  );
}
