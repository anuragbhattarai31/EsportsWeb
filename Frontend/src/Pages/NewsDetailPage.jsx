import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { format } from 'date-fns';

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/news/${id}`);
        if (!response.ok) {
          throw new Error('News article not found');
        }
        const data = await response.json();
        setNewsItem(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-semored border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200 flex items-center justify-center">
        <div className="text-semored text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200">
      <Header />
      <main className="container mx-auto px-4 md:px-6 py-16 pt-24">
        <article className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-gaming font-bold text-white mb-4">
              {newsItem.title}
            </h1>
            <p className="text-semored text-sm">
              Published on {format(new Date(newsItem.created_at), "MMM d, yyyy 'at' HH:mm")}
            </p>
          </div>

          {newsItem.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden shadow-xl">
              <img
                src={newsItem.image_url}
                alt={newsItem.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.svg';
                }}
              />
            </div>
          )}

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 text-lg leading-relaxed">
              {newsItem.content}
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsDetailPage;