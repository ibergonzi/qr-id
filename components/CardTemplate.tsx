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
  const waPhone = data.w.replace(/\D/g, '');
  const waMessage = encodeURIComponent(`Hola ${data.n}, te contacto a través de tu tarjeta digital.`);
  const age = calcAge(data.b);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-slate-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">

        {/* Header: foto izquierda, nombre+descripción derecha */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-900 px-6 pt-6 pb-5">
          <div className="flex items-start gap-4">
            <img
              src={data.ph}
              alt={`${data.n} ${data.l}`}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover shrink-0"
            />
            <div className="min-w-0 flex-1 pt-1">
              <h1 className="text-white text-xl font-bold leading-tight">{data.n}</h1>
              <p className="text-blue-200 text-base leading-tight">{data.l}</p>
              {data.d && (
                <p className="text-blue-100 text-sm mt-2 leading-relaxed">{data.d}</p>
              )}
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="px-6 py-4 divide-y divide-gray-100">
          <InfoRow
            icon="📅"
            label="Fecha de nacimiento"
            value={`${formatDate(data.b)} · ${age} años`}
          />
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
    </div>
  );
}
