import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { IntentDetails } from './pages/IntentDetails';
import { TraceExplorer } from './pages/TraceExplorer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="intent/:id" element={<IntentDetails />} />
          <Route path="explorer" element={<TraceExplorer />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
