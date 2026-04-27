import React, { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { login } from 'app/shared/reducers/authentication';
import { proRoutes, publicRoutes } from 'app/config/proRoutes';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loginError = useAppSelector(state => state.authentication.loginError);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const params = new URLSearchParams(location.search);
  const next = params.get('next') ?? proRoutes.tableauDeBord;

  useEffect(() => {
    if (isAuthenticated) navigate(next, { replace: true });
  }, [isAuthenticated, next, navigate]);

  if (isAuthenticated) {
    return <Navigate to={next} replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    dispatch(login(username, password, rememberMe));
    setTimeout(() => setSubmitting(false), 800);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Connexion</h1>
        <p className="text-sm text-neutral-500 mt-1">Accédez à votre espace Propsight Pro.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Identifiant</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            autoComplete="username"
            placeholder="admin / user"
            className="w-full h-9 px-3 text-sm rounded-md border border-neutral-200 focus:border-propsight-500 focus:ring-2 focus:ring-propsight-500/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full h-9 px-3 text-sm rounded-md border border-neutral-200 focus:border-propsight-500 focus:ring-2 focus:ring-propsight-500/20 outline-none"
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-neutral-600 select-none">
          <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} />
          Rester connecté
        </label>
        {loginError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            Identifiants incorrects. Vérifiez votre email et votre mot de passe.
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="w-full h-9 text-sm font-medium rounded-md bg-propsight-500 hover:bg-propsight-600 disabled:opacity-60 text-white transition-colors"
        >
          {submitting ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
      <div className="flex justify-between text-xs text-neutral-500">
        <Link to={publicRoutes.loginReset} className="hover:text-propsight-600">
          Mot de passe oublié ?
        </Link>
        <Link to="/" className="hover:text-propsight-600">
          Retour au site
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
