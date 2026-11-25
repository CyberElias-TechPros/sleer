export type Video = {
  id: string;
  url: string;
  creatorId?: string | null;
  storagePath?: string | null;
  creator: string;
  caption: string;
  category: string;
  attribution: string;
};

// Both entries intentionally use the same openly licensed sample to exercise paging.
// Replace with direct video URLs you have permission to stream.
export const videos: Video[] = [
  { id: 'bunny-1', url: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4', creator: 'Blender Studio', caption: 'A little moment from Big Buck Bunny.', category: 'Animation', attribution: 'Big Buck Bunny © Blender Foundation • CC BY 3.0' },
  { id: 'bunny-2', url: 'https://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4', creator: 'Blender Studio', caption: 'A second demo card to test swiping.', category: 'Animation', attribution: 'Big Buck Bunny © Blender Foundation • CC BY 3.0' },
];

export function shouldPlay(isActive: boolean, appActive: boolean, paused: boolean): boolean {
  return isActive && appActive && !paused;
}

export function activeIdFromViewable(items: { item: Video }[]): string | null {
  return items[0]?.item.id ?? null;
}
