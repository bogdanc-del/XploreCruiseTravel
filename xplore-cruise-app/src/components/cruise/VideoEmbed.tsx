'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'

interface VideoEmbedProps {
  videoId: string
  title?: string
  className?: string
}

/**
 * Lazy-loaded YouTube embed — shows a thumbnail with play button,
 * only loads the iframe when clicked (saves bandwidth & improves LCP).
 */
export default function VideoEmbed({ videoId, title = 'Video', className = '' }: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = useCallback(() => {
    setIsPlaying(true)
  }, [])

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const fallbackUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-navy-900 ${className}`}
      style={{ aspectRatio: '16/9' }}
    >
      {isPlaying ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button
          onClick={handlePlay}
          className="absolute inset-0 w-full h-full group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 rounded-xl"
          aria-label={`Play video: ${title}`}
        >
          {/* Thumbnail */}
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            onError={(e) => {
              // Fallback to lower quality if maxresdefault doesn't exist
              const target = e.target as HTMLImageElement
              if (target.src.includes('maxresdefault')) {
                target.src = fallbackUrl
              }
            }}
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-navy-950/30 group-hover:bg-navy-950/20 transition-colors duration-300" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 group-hover:bg-red-500 transition-all duration-300 flex items-center justify-center shadow-2xl group-hover:scale-110">
              <svg
                className="w-7 h-7 md:w-9 md:h-9 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Video title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-navy-950/80 to-transparent">
            <p className="text-white text-sm font-medium truncate">{title}</p>
          </div>
        </button>
      )}
    </div>
  )
}
