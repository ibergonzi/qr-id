export async function generatePDF(
  qrDataUrl: string,
  personName: string,
  cardUrl: string
): Promise<void> {
  const { jsPDF } = await import('jspdf');

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = 210;

  // Header background
  pdf.setFillColor(30, 64, 175); // blue-800
  pdf.rect(0, 0, pageW, 28, 'F');

  // Nombre (grande, sin título)
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(26);
  pdf.setFont('helvetica', 'bold');
  const nameLines = pdf.splitTextToSize(personName, pageW - 20);
  pdf.text(nameLines, pageW / 2, 18, { align: 'center' });

  // QR Code (centered, 100mm x 100mm)
  const qrSize = 100;
  const qrX = (pageW - qrSize) / 2;
  const headerH = nameLines.length > 1 ? 36 : 28;
  const qrY = headerH + 10;
  pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);

  // Border around QR
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.5);
  pdf.rect(qrX - 2, qrY - 2, qrSize + 4, qrSize + 4);

  // Instruction
  pdf.setFontSize(12);
  pdf.setTextColor(60, 60, 60);
  pdf.text('Escaneá el código QR para ver la información completa', pageW / 2, qrY + qrSize + 12, { align: 'center' });

  // URL backup (truncated)
  pdf.setFontSize(7);
  pdf.setTextColor(150, 150, 150);
  const maxUrlLen = 90;
  const displayUrl = cardUrl.length > maxUrlLen ? cardUrl.substring(0, maxUrlLen - 3) + '...' : cardUrl;
  pdf.text(displayUrl, pageW / 2, qrY + qrSize + 20, { align: 'center' });

  // Footer
  pdf.setFontSize(8);
  pdf.setTextColor(180, 180, 180);
  pdf.text('QR-ID', pageW / 2, 285, { align: 'center' });

  const safeName = personName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
  pdf.save(`${safeName}-qr-id.pdf`);
}
