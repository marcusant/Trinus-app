import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Trinus Marcus — Personal Training',
    short_name: 'Trinus',
    description: 'Corpo forte. Mente clara. Essência desperta.',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#010101',
    theme_color: '#9e57c8',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
