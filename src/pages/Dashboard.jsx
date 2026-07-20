import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { BrainCircuit, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchProjects = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/projects/${user.id}`);
        const data = await response.json();
        if (data.status === 'success') {
          setProjects(data.projects);
        }
      } catch (e) {
        console.error("Failed to load projects", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [user, navigate]);

  const loadProject = (project) => {
    // Save to session storage so Workspace picks it up
    sessionStorage.setItem('iogenius_hardware', JSON.stringify(project.hardware));
    sessionStorage.setItem('iogenius_software', JSON.stringify(project.software));
    sessionStorage.setItem('iogenius_chat', JSON.stringify([
      { role: 'ai', content: `Loaded project: "${project.prompt}"` }
    ]));
    navigate('/workspace');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/workspace" className="btn" style={{ background: 'transparent', color: 'var(--text-muted)', padding: '0.5rem', border: 'none' }}>
            <ArrowLeft size={24} />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.25rem' }}>
            <BrainCircuit color="var(--primary)" size={24} /> <span className="text-gradient">My Projects</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <ThemeToggle />
        </div>
      </header>

      <main style={{ flex: 1, padding: '3rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Welcome back, {user?.name}</h1>
        
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
             <p style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><BrainCircuit className="spin-animation" size={20} /> Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center', borderStyle: 'dashed', borderWidth: '2px', borderColor: 'var(--border-color)' }}>
            <BrainCircuit size={48} color="var(--primary)" style={{ margin: '0 auto 1.5rem auto', opacity: 0.5 }} />
            <h2 style={{ marginBottom: '1rem' }}>No Projects Yet</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>Start building your first hardware prototype using our AI generator.</p>
            <Link to="/workspace" className="btn btn-primary" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontWeight: 600 }}>
              Create New Project
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {projects.map((project, idx) => (
              <div key={project._id || idx} className="glass-card project-card-hover" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease', cursor: 'pointer', borderLeft: '4px solid var(--primary)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>"{project.prompt}"</h3>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} /> {new Date(project.created_at).toLocaleDateString()}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BrainCircuit size={14} /> {project.hardware?.microcontroller?.name || 'Unknown MCU'}
                    </span>
                  </div>
                </div>
                <button onClick={() => loadProject(project)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                  Load Project <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
