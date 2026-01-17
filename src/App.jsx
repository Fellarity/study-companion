import MainLayout from './components/layout/MainLayout';
import { StudyProvider } from './context/StudyContext';

function App() {
  return (
    <StudyProvider>
      <MainLayout />
    </StudyProvider>
  );
}

export default App;