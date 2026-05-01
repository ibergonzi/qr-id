'use client';

interface Props {
  qrDataUrl: string;
  cardUrl: string;
  personName: string;
  onDownloadPDF: () => void;
  onNew: () => void;
}

export default function QRPreview({ qrDataUrl, cardUrl, personName, onDownloadPDF, onNew }: Props) {
  function copyUrl() {
    navigator.clipboard.writeText(cardUrl).catch(() => {});
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl shadow p-8 text-center">
          <span className="text-4xl">✅</span>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">QR generado</h2>
          <p className="text-gray-500 mt-1 mb-6">{personName}</p>

          <div className="flex justify-center mb-4">
            <img src={qrDataUrl} alt="Código QR" className="w-56 h-56 rounded-lg border border-gray-100 shadow-sm" />
          </div>

          <button
            onClick={copyUrl}
            title="Copiar URL"
            className="text-xs text-gray-400 hover:text-blue-500 break-all font-mono block w-full text-center mb-6 transition-colors"
          >
            {cardUrl}
          </button>

          <div className="space-y-3">
            <button
              onClick={onDownloadPDF}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
            >
              Descargar PDF
            </button>
            <button
              onClick={onNew}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Nueva tarjeta
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 text-center mt-4">
          Escaneá el QR con tu teléfono para previsualizar la tarjeta
        </p>
      </div>
    </main>
  );
}
