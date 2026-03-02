import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Donors } from '@/pages/Donors';
import { Register } from '@/pages/Register';
import { Requests } from '@/pages/Requests';
import { Admin } from '@/pages/Admin';

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
        </Routes>
      </Layout>
    </Router>
  );
}
