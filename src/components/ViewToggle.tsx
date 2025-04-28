
import { ViewMode } from '../types';
import { useData } from '../contexts/DataContext';

const ViewToggle = () => {
  const { viewMode, setViewMode } = useData();

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`px-6 py-2 text-sm font-medium rounded-r-md ${
          viewMode === 'weekly' 
            ? 'bg-primary text-white' 
            : 'bg-secondary text-muted-foreground'
        }`}
        onClick={() => setViewMode('weekly')}
      >
        أسبوعي
      </button>
      <button
        type="button"
        className={`px-6 py-2 text-sm font-medium rounded-l-md ${
          viewMode === 'annual' 
            ? 'bg-primary text-white' 
            : 'bg-secondary text-muted-foreground'
        }`}
        onClick={() => setViewMode('annual')}
      >
        سنوي
      </button>
    </div>
  );
};

export default ViewToggle;
