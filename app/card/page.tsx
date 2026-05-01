import { decodePersonData } from '@/lib/encode';
import CardTemplate from '@/components/CardTemplate';

export const metadata = {
  title: 'Tarjeta de Identidad — QR-ID',
};

interface Props {
  searchParams: { d?: string };
}

export default function CardPage({ searchParams }: Props) {
  const encoded = searchParams.d;

  if (!encoded) {
    return <ErrorScreen title="QR inválido" message="Este código QR no contiene datos." />;
  }

  try {
    const data = decodePersonData(encoded);
    return <CardTemplate data={data} />;
  } catch {
    return <ErrorScreen title="Error al leer el QR" message="Los datos están dañados o son inválidos." />;
  }
}

function ErrorScreen({ title, message }: { title: string; message: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-800">
      <div className="text-center text-white px-4">
        <p className="text-6xl mb-4">⚠️</p>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-slate-300 mt-2">{message}</p>
      </div>
    </main>
  );
}
