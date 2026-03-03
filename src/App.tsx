import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Donors } from '@/pages/Donors';
import { Register } from '@/pages/Register';
import { Requests } from '@/pages/Requests';
import { Admin } from '@/pages/Admin';
import { Login } from '@/pages/Login';
import { Profile } from '@/pages/Profile';
import { About } from '@/pages/About';
import { Leaderboard } from '@/pages/Leaderboard';
import { Certificate } from '@/pages/Certificate';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/donors" element={<Donors />} />
          <Route path="/register" element={<Register />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/about" element={<About />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/certificate" element={<Certificate />} />
        </Routes>
      </Layout>
    </Router>
  );
}
