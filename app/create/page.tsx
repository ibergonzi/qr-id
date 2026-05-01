'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import { encodePersonData, PersonData } from '@/lib/encode';
import { uploadPhoto } from '@/lib/cloudinary';
import { generatePDF } from '@/lib/pdfGen';
import PhotoUpload from '@/components/PhotoUpload';
import QRPreview from '@/components/QRPreview';

interface FormFields {
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  direccion: string;
  email: string;
  telefono: string;
  whatsapp: string;
  descripcion: string;
}

const emptyForm: FormFields = {
  nombre: '', apellido: '', fechaNacimiento: '',
  direccion: '', email: '', telefono: '', whatsapp: '', descripcion: '',
};

export default function CreatePage() {
  const [fields, setFields] = useState<FormFields>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ qrDataUrl: string; cardUrl: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
  }

  function handleWhatsappBlur() {
    if (fields.telefono && !fields.whatsapp) {
      setFields(prev => ({ ...prev, whatsapp: prev.telefono }));
    }
  }

  function handlePhotoChange(file: File) {
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!photoFile) { setError('Seleccioná una foto antes de continuar.'); return; }

    setLoading(true);
    setError('');

    try {
      const photoUrl = await uploadPhoto(photoFile);

      const personData: PersonData = {
        n: fields.nombre.trim(),
        l: fields.apellido.trim(),
        b: fields.fechaNacimiento,
        a: fields.direccion.trim(),
        e: fields.email.trim(),
        p: fields.telefono.trim(),
        w: fields.whatsapp.trim(),
        ph: photoUrl,
        ...(fields.descripcion.trim() && { d: fields.descripcion.trim() }),
      };

      const encoded = encodePersonData(personData);
      const cardUrl = `${window.location.origin}/card?d=${encoded}`;

      const qrDataUrl = await QRCode.toDataURL(cardUrl, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'M',
        color: { dark: '#1e293b', light: '#ffffff' },
      });

      setResult({ qrDataUrl, cardUrl });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error al generar el QR: ${msg}`);
    } finally {
      setLoading(false);
    }
  }

  function handleDownloadPDF() {
    if (!result) return;
    const fullName = `${fields.nombre} ${fields.apellido}`;
    generatePDF(result.qrDataUrl, fullName, result.cardUrl);
  }

  function handleNew() {
    setResult(null);
    setFields(emptyForm);
    setPhotoFile(null);
    setPhotoPreview('');
    setError('');
  }

  if (result) {
    return (
      <QRPreview
        qrDataUrl={result.qrDataUrl}
        cardUrl={result.cardUrl}
        personName={`${fields.nombre} ${fields.apellido}`}
        onDownloadPDF={handleDownloadPDF}
        onNew={handleNew}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🪪 Crear tarjeta</h1>
          <p className="text-gray-500 mt-1">Completá los datos para generar el código QR y el PDF</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-6 space-y-5">

          <PhotoUpload onPhotoChange={handlePhotoChange} preview={photoPreview} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Nombre</label>
              <input name="nombre" value={fields.nombre} onChange={handleChange}
                required className="input-field" placeholder="Juan" />
            </div>
            <div>
              <label className="form-label">Apellido</label>
              <input name="apellido" value={fields.apellido} onChange={handleChange}
                required className="input-field" placeholder="García" />
            </div>
          </div>

          <div>
            <label className="form-label">Fecha de nacimiento</label>
            <input type="date" name="fechaNacimiento" value={fields.fechaNacimiento}
              onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label className="form-label">Dirección</label>
            <input name="direccion" value={fields.direccion} onChange={handleChange}
              required className="input-field" placeholder="Calle Florida 1234, Buenos Aires" />
          </div>

          <div>
            <label className="form-label">Email</label>
            <input type="email" name="email" value={fields.email} onChange={handleChange}
              required className="input-field" placeholder="juan@ejemplo.com" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Teléfono</label>
              <input name="telefono" value={fields.telefono} onChange={handleChange}
                onBlur={handleWhatsappBlur}
                required className="input-field" placeholder="+54 11 5566 7788" />
            </div>
            <div>
              <label className="form-label">WhatsApp</label>
              <input name="whatsapp" value={fields.whatsapp} onChange={handleChange}
                required className="input-field" placeholder="+54 11 5566 7788" />
            </div>
          </div>

          <div>
            <label className="form-label">
              Descripción{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              name="descripcion"
              value={fields.descripcion}
              onChange={handleChange}
              rows={3}
              className="input-field resize-none"
              placeholder='Ej: "Soy neurodivergente y no me comunico con palabras"'
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 rounded-xl transition-colors text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generando...
              </span>
            ) : 'Generar QR y PDF'}
          </button>
        </form>
      </div>
    </main>
  );
}
