import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Lesson } from './pages/Lesson';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { Quiz } from './pages/Quiz';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { InstallPWA } from './components/InstallPWA';

export default function App() {
  return (
    <HashRouter>
      <InstallPWA />
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Lesson />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:categoryId" element={<Quiz />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </HashRouter>
  );
}
