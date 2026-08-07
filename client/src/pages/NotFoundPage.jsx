import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Card, Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <h1 className="text-5xl font-bold mb-3">404</h1>
        <p className="text-lg mb-4">The page you’re looking for has drifted into the literary void.</p>
        <Link to="/">
          <Button className="flex items-center gap-2 mx-auto">
            <Home size={16} /> Take Me Home
          </Button>
        </Link>
      </Card>
    </div>
  );
}
