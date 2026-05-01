'use client';

import { useState } from 'react';
import { PersonData } from '@/lib/encode';

interface Props {
  data: PersonData;
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function calcAge(iso: string): number {
  const [y, m, d] = iso.split('-').map(Number);
  const today = new Date();
  let age = today.getFullYear() - y;
  if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d)) age--;
  return age;
}

function InfoRow({ icon, label, value, href }: { icon: string; label: string; value: string; href?: string }) {
  const inner = (
    <div className="flex items-start gap-3 py-2">
      <span className="text-xl shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-gray-700 font-medium break-words">{value}</p>
      </div>
    </div>
  );
  if (href) {
    return <a href={href} className="block hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors">{inner}</a>;
  }
  return <div className="px-2 -mx-2">{inner}</div>;
}

export default function CardTemplate({ data }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const waPhone = data.w.replace(/\D/g, '');
  const waMessage = encodeURIComponent(`Hola ${data.n}, te contacto a través de tu tarjeta digital.`);
  const birthValue = data.b
    ? `${formatDate(data.b)} · ${calcAge(data.b)} años`
    : 'No especificada';

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-5 pt-5 pb-4">

          {/* Fila superior: foto 40% | descripción 60% */}
          <div className="flex gap-3 items-start">
            <div className="w-[40%] shrink-0">
              <img
                src={data.ph}
                alt={`${data.n} ${data.l}`}
                onClick={() => setLightboxOpen(true)}
                className="w-full aspect-square rounded-full border-[3px] border-white shadow-lg object-cover cursor-pointer active:opacity-80 transition-opacity"
              />
            </div>
            <div className="w-[60%] min-w-0">
              {data.d && (
                <p className="text-blue-100 text-base leading-relaxed">{data.d}</p>
              )}
            </div>
          </div>

          {/* Nombre completo — ancho total, centrado, serif */}
          <p className="mt-3 text-white text-xl font-bold text-center font-serif tracking-wide leading-tight">
            {data.n} {data.l}
          </p>

        </div>

        {/* Información */}
        <div className="px-6 py-4 divide-y divide-gray-100">
          <InfoRow icon="📅" label="Fecha de nacimiento" value={birthValue} />
          <InfoRow icon="📍" label="Dirección" value={data.a} />
          <InfoRow icon="✉️" label="Email" value={data.e} href={`mailto:${data.e}`} />
        </div>

        {/* Botones de acción */}
        <div className="px-6 pb-8 pt-4 space-y-3">
          <a
            href={`tel:${data.p}`}
            className="flex items-center justify-center gap-3 w-full bg-green-500 active:bg-green-600 text-white font-semibold py-4 rounded-2xl transition-colors text-lg select-none"
          >
            <span>📞</span>
            <span>{data.p}</span>
          </a>
          <a
            href={`https://wa.me/${waPhone}?text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full bg-emerald-500 active:bg-emerald-600 text-white font-semibold py-4 rounded-2xl transition-colors text-lg select-none"
          >
            <span>💬</span>
            <span>WhatsApp</span>
          </a>
        </div>

      </div>

      {/* Lightbox */}
      <div
        onClick={() => setLightboxOpen(false)}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/85 transition-opacity duration-300 ${
          lightboxOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img
          src={data.ph}
          alt={`${data.n} ${data.l}`}
          onClick={e => e.stopPropagation()}
          className={`max-w-[90vw] max-h-[85vh] rounded-2xl shadow-2xl object-contain transition-transform duration-300 ${
            lightboxOpen ? 'scale-100' : 'scale-90'
          }`}
        />
        <button
          onClick={() => setLightboxOpen(false)}
          aria-label="Cerrar"
          className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl leading-none"
        >
          ✕
        </button>
      </div>

    </div>
  );
}
