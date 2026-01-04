import { useState, useEffect } from 'react';
import { useSearch, useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { searchProfiles } from '../services/profile.service';
import StarRating from '../components/StarRating';
import { Search as SearchIcon, User, Star, Briefcase } from 'lucide-react';

export default function Search() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false });
  const [searchQuery, setSearchQuery] = useState(searchParams?.q || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = searchParams?.q || '';
    setSearchQuery(query);
    if (query.trim()) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [searchParams?.q]);

  const performSearch = async (query) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await searchProfiles(query);
      setResults(response.data || []);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search profiles. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: '/search', search: { q: searchQuery.trim() } });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Search Skills & People</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by skill name, category, name, or bio... (e.g., React, JavaScript, Python, Design)"
                className="w-full pl-12 pr-4 py-4 rounded-lg border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary text-lg"
              />
            </div>
          </form>

          {searchQuery && (
            <p className="mt-2 text-sm text-muted-foreground">
              {loading ? 'Searching...' : results.length > 0 ? `Found ${results.length} result(s)` : 'No results found'}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive">
            {error}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Searching...</p>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((profile) => (
              <Link
                key={profile._id}
                to="/user/$userId"
                params={{ userId: profile.auth?._id || profile._id }}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  {/* Profile Image */}
                  <div className="w-16 h-16 rounded-full bg-secondary border-2 border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {profile.imageUrl ? (
                      <img
                        src={profile.imageUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-foreground truncate">{profile.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Briefcase className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground capitalize">
                        {profile.role?.replace('_', ' ')}
                      </span>
                    </div>
                    {profile.averageRating > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium text-foreground">
                          {profile.averageRating.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({profile.totalRatings} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {profile.bio}
                  </p>
                )}

                {/* Matching Skills */}
                {profile.skills && profile.skills.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                      Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.slice(0, 5).map((skill, idx) => (
                        <div
                          key={idx}
                          className="inline-flex flex-col items-start px-3 py-1.5 rounded-md bg-primary/10 border border-primary/20"
                        >
                          <span className="text-xs font-semibold text-foreground">{skill.name}</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="text-xs text-muted-foreground capitalize">
                              {skill.category}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground capitalize">
                              {skill.proficiency}
                            </span>
                          </div>
                        </div>
                      ))}
                      {profile.skills.length > 5 && (
                        <span className="text-xs text-muted-foreground self-center">
                          +{profile.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : searchQuery && !loading ? (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-foreground mb-2">No profiles found</p>
            <p className="text-muted-foreground">
              Try searching with different keywords or check your spelling
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <SearchIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-foreground mb-2">Start searching</p>
            <p className="text-muted-foreground">
              Search for skills, categories, names, or browse profiles
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                React
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                JavaScript
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                Python
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                Design
              </span>
              <span className="text-xs px-3 py-1.5 rounded-full bg-secondary text-muted-foreground">
                Marketing
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
