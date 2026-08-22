import { PosterCard } from '@/components/ui/posterCard'
import { ArrowRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Container, ScrollRow, Section, SectionHeader, SectionTitle, SeeMore } from '@/styles/home'
import { apiUrl, imageUrl, tmdbApiKey } from '../../utils'
import type { Media, TrendingMovies } from '@/constants/types'

//export const apiUrl = import.meta.env.VITE_API_URL;

export const Trends = () => {
  const [isLoadingTrends, setIsLoadingTrends] = useState(false)
  const [trends, setTrends] = useState<TrendingMovies | null>(null)
  const [timeWindow, setTimeWindow] = useState<'day' | 'week'>('day')
  const [error, setError] = useState<Error | null>(null)

  const getTrendingMovies = async () => {
    try {
      setIsLoadingTrends(true)
      setError(null)

      const fetchTrendings = await fetch(`${apiUrl}trending/movie/${timeWindow}?api_key=${tmdbApiKey}`)
      const result = (await fetchTrendings.json()) as TrendingMovies
      setTrends(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setIsLoadingTrends(false)
    }
  }

  useEffect(() => {
    getTrendingMovies()
  }, [timeWindow])

  const mediaList: Media[] =
    trends?.results?.map((movie) => ({
      id: String(movie.id),
      title: movie.title,
      category: movie.media_type,
      genre: movie.original_language,
      rating: movie.vote_average / 2,
      poster: `${imageUrl}original${movie.poster_path}`,
    })) ?? []

  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle>Trends</SectionTitle>
          <SeeMore href="#movies">
            See More <ArrowRight size={14} />
          </SeeMore>
        </SectionHeader>
        <ScrollRow>
          {isLoadingTrends ? (
            [1, 2, 3, 4, 5, 6].map((i) => <div className="skeleton" key={i} />)
          ) : error ? (
            <p>Failed to load trends: {error.message}</p>
          ) : (
            mediaList.map((media) => <PosterCard key={media.id} media={media} />)
          )}
        </ScrollRow>
      </Container>
    </Section>
  )
}




_______________________________________________