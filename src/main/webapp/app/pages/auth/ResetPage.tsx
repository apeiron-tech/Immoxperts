import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch } from 'app/config/store';
import { handlePasswordResetInit, reset } from 'app/modules/account/password-reset/password-reset.reducer';

const ResetPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(handlePasswordResetInit(email));
    setSent(true);
    setTimeout(() => dispatch(reset()), 3000);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Mot de passe oublié</h1>
        <p className="text-sm text-neutral-500 mt-1">Nous vous envoyons un lien de réinitialisation.</p>
      </div>
      {sent ? (
        <div className="text-sm text-neutral-700 bg-neutral-50 border border-neutral-200 rounded-md p-3">
          Si cet email est rattaché à un compte, un lien de réinitialisation vient de vous être envoyé.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full h-9 px-3 text-sm rounded-md border border-neutral-200 focus:border-propsight-500 focus:ring-2 focus:ring-propsight-500/20 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full h-9 text-sm font-medium rounded-md bg-propsight-500 hover:bg-propsight-600 text-white transition-colors"
          >
            Envoyer le lien
          </button>
        </form>
      )}
      <div className="text-xs text-neutral-500">
        <Link to="/login" className="hover:text-propsight-600">
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};

export default ResetPage;
