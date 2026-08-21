export const featuredMovies = [
  {
    id: 'f1',
    title: 'Blade Runner 2049',
    rating: 4.8,
    classification: 'R',
    year: 2017,
    duration: '164m',
    genre: 'Sci-fi',
    genre2: 'Action',
    banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
  },
  {
    id: 'f2',
    title: 'Dune',
    rating: 4.6,
    classification: 'PG-13',
    year: 2021,
    duration: '155m',
    genre: 'Sci-fi',
    genre2: 'Adventure',
    banner: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=400&q=80',
  },
  {
    id: 'f3',
    title: 'Top Gun: Maverick',
    rating: 4.7,
    classification: 'PG-13',
    year: 2022,
    duration: '135m',
    genre: 'Action',
    genre2: 'Drama',
    banner: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    poster: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=400&q=80',
  },
];

export const nowPlaying = [
  {
    id: 'np1',
    title: 'Dune',
    poster: 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?w=400&q=80',
    times: ['11:15', '14:15', '17:15', '20:15'],
    duration: '155 minutes',
    classification: 'PG-13',
  },
  {
    id: 'np2',
    title: 'Top Gun: Maverick',
    poster: 'https://images.unsplash.com/photo-1517816428104-797678c7cf0c?w=400&q=80',
    times: ['11:15', '15:00', '19:00'],
    duration: '135 minutes',
    classification: 'PG-13',
  },
  {
    id: 'np3',
    title: 'Blade Runner 2049',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
    times: ['12:00', '16:00', '20:00'],
    duration: '164 minutes',
    classification: 'R',
  },
];

export const comingSoon = [
  {
    id: 'cs1',
    title: 'Asteroid City',
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80',
    year: 2023,
    month: 'January',
  },
  {
    id: 'cs2',
    title: 'Her',
    poster: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=400&q=80',
    year: 2023,
    month: 'January',
  },
  {
    id: 'cs3',
    title: 'The Batman',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&q=80',
    year: 2023,
    month: 'February',
  },
];

export const movieDetail = {
  id: 'md1',
  title: 'Blade Runner 2049',
  rating: 4.8,
  classification: 'R',
  year: 2017,
  duration: '164m',
  genre: 'Sci-fi',
  genre2: 'Action',
  banner: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
  poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80',
  synopsis:
    'Officer K (Ryan Gosling), a new blade runner for the Los Angeles Police Department, unearths a long-buried secret that has the potential to plunge whats left of society into chaos. His discovery leads him on a quest to find Rick Deckard (Harrison Ford)',
  director: 'Denis Villeneuve',
  cast: 'Ryan Gosling, Harrison Ford, Ana De Armas, Mackenzie Davis',
  releaseDate: 'October 6th, 2017',
  ticketPrice: 'E50.00',
  dates: [
    { id: 'd1', day: 'Oct 6', weekday: 'Friday' },
    { id: 'd2', day: 'Oct 7', weekday: 'Saturday' },
    { id: 'd3', day: 'Oct 8', weekday: 'Sunday' },
  ],
  locations: ['Gables, Ezulwini', 'Manzini City Mall', 'Mbabane Cinema'],
  glassesOptions: ['No', 'Yes'],
  times: [
    { id: 't1', time: '11:15', seats: 4 },
    { id: 't2', time: '14:15', seats: 10 },
    { id: 't3', time: '17:15', seats: 15 },
  ],
};


export const usersArray = [
  {
    name: 'Armand',
    surname: 'Default',
    email: 'armand',
    phone: '+250791449880',
    password: 'armand+2026',
  },
];
