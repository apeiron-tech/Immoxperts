import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { postEstimationLead } from './lib/api';

interface LeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  consent: boolean;
  website?: string;
}

interface Props {
  estimationId?: string;
}

const PHONE_FR = /^(?:\+33|0)[1-9](?:[ .-]?\d{2}){4}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EstimationLeadForm: React.FC<Props> = ({ estimationId }) => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', consent: false, website: '' },
  });

  const onSubmit = async (values: LeadFormValues) => {
    setServerError(null);
    if (values.website && values.website.length > 0) {
      // honeypot — silencieux
      setSubmitted(true);
      return;
    }
    try {
      await postEstimationLead({
        estimationId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        consent: values.consent,
      });
      setSubmitted(true);
    } catch {
      setServerError("Impossible d'envoyer votre demande pour le moment. Réessayez dans quelques instants.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-propsight-100 flex items-center justify-center">
          <Check size={20} className="text-propsight-700" />
        </div>
        <h3 className="mt-4 text-[18px] font-medium text-slate-900">Merci, votre demande a bien été transmise.</h3>
        <p className="mt-2 text-[14px] text-slate-600">Un conseiller vous recontacte sous 24h.</p>
        <Link
          to="/prix-immobiliers"
          className="mt-6 inline-flex items-center h-10 px-5 rounded-md border border-slate-200 hover:bg-white text-[13px] font-medium text-slate-700"
        >
          Explorer les prix du marché
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 lg:p-8">
      <h3 className="text-[20px] font-medium text-slate-900">Obtenir un avis de valeur officiel</h3>
      <p className="mt-1 text-[14px] text-slate-600">Un conseiller local vous recontacte sous 24h pour affiner cette estimation gratuitement.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
        <input type="text" tabIndex={-1} autoComplete="off" {...register('website')} className="hidden" aria-hidden />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="text"
              placeholder="Prénom"
              {...register('firstName', { required: true, minLength: 2 })}
              aria-invalid={!!errors.firstName}
              className="w-full h-11 px-3 text-[14px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
            />
            {errors.firstName ? <p className="mt-1 text-[11.5px] text-rose-600">Prénom requis (2 caractères min).</p> : null}
          </div>
          <div>
            <input
              type="text"
              placeholder="Nom"
              {...register('lastName', { required: true, minLength: 2 })}
              aria-invalid={!!errors.lastName}
              className="w-full h-11 px-3 text-[14px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
            />
            {errors.lastName ? <p className="mt-1 text-[11.5px] text-rose-600">Nom requis (2 caractères min).</p> : null}
          </div>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: true, pattern: EMAIL })}
            aria-invalid={!!errors.email}
            className="w-full h-11 px-3 text-[14px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
          />
          {errors.email ? <p className="mt-1 text-[11.5px] text-rose-600">Email valide requis.</p> : null}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Téléphone (recommandé)"
            {...register('phone', { validate: v => !v || PHONE_FR.test(v) || 'invalid' })}
            aria-invalid={!!errors.phone}
            className="w-full h-11 px-3 text-[14px] rounded-md border border-slate-200 focus:border-propsight-500 focus:ring-1 focus:ring-propsight-500 outline-none bg-white"
          />
          {errors.phone ? <p className="mt-1 text-[11.5px] text-rose-600">Numéro français invalide.</p> : null}
        </div>

        <label className="flex items-start gap-2 text-[12px] text-slate-500 leading-relaxed">
          <input type="checkbox" {...register('consent', { required: true })} className="mt-0.5 accent-propsight-600" />
          <span>
            J&rsquo;accepte d&rsquo;être recontacté par un conseiller Propsight ou un partenaire. Mes données sont traitées conformément à la{' '}
            <Link to="/politique-de-confidentialite" className="underline hover:text-slate-700">
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        {errors.consent ? <p className="text-[11.5px] text-rose-600">Vous devez accepter pour être recontacté.</p> : null}

        {serverError ? <p className="text-[12.5px] text-rose-600">{serverError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 rounded-md bg-propsight-600 hover:bg-propsight-700 text-white text-[14.5px] font-semibold transition-colors disabled:opacity-60"
        >
          {isSubmitting ? 'Envoi…' : 'Être recontacté par un conseiller'}
        </button>
      </form>
    </div>
  );
};

export default EstimationLeadForm;
