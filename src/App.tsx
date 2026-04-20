import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Lesson } from './pages/Lesson';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { Quiz } from './pages/Quiz';
import { Practice } from './pages/Practice';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<Lesson />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/about" element={<About />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/quiz/:categoryId" element={<Quiz />} />
            <Route path="/practice" element={<Practice />} />
          </Routes>
        </AnimatePresence>
      </Layout>
    </HashRouter>
  );
}
