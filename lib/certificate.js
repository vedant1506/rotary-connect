'use client';

import { jsPDF } from 'jspdf';

function formatCertificateDate(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

function sanitizeText(value, fallback) {
  if (typeof value !== 'string') {
    return fallback;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

async function loadImageDataUrl(src) {
  try {
    const response = await fetch(src);

    if (!response.ok) {
      return '';
    }

    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    return '';
  }
}

function drawLogoFrame(pdf, x, y, size) {
  pdf.setDrawColor(203, 213, 225);
  pdf.setFillColor(248, 250, 252);
  pdf.roundedRect(x, y, size, size, 5, 5, 'FD');
}

function drawLogoPlaceholder(pdf, x, y, size) {
  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('LOGO', x + size / 2, y + size / 2 - 1.5, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(6.5);
  pdf.text('Place in /public/rotary-logo.png', x + size / 2, y + size / 2 + 2.5, { align: 'center', maxWidth: size - 4 });
}

export async function generateVolunteerCertificate(volunteerName, eventName = 'Scheduled Community Service Drive') {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  const safeVolunteerName = sanitizeText(volunteerName, 'Volunteer');
  const safeEventName = sanitizeText(eventName, 'Scheduled Community Service Drive');
  const today = formatCertificateDate();
  const logoDataUrl = await loadImageDataUrl('/rotary-logo.png');

  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setFillColor(236, 253, 245);
  pdf.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 8, 8, 'F');

  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(1.6);
  pdf.roundedRect(10, 10, pageWidth - 20, pageHeight - 20, 8, 8);

  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(18, 18, pageWidth - 36, pageHeight - 36, 6, 6, 'F');

  drawLogoFrame(pdf, 26, 24, 28);

  if (logoDataUrl) {
    try {
      pdf.addImage(logoDataUrl, 'PNG', 28, 26, 24, 24, undefined, 'FAST');
    } catch (error) {
      drawLogoPlaceholder(pdf, 26, 24, 28);
    }
  } else {
    drawLogoPlaceholder(pdf, 26, 24, 28);
  }

  pdf.setFillColor(16, 185, 129);
  pdf.circle(pageWidth - 26, 26, 5, 'F');
  pdf.circle(26, pageHeight - 26, 5, 'F');
  pdf.circle(pageWidth - 26, pageHeight - 26, 5, 'F');

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(4, 120, 87);
  pdf.setFontSize(24);
  pdf.text('ROTARY CLUB', centerX + 12, 48, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(71, 85, 105);
  pdf.setFontSize(11);
  pdf.text('Community Service Recognition Certificate', centerX + 12, 57, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(16);
  pdf.text('Certificate of Appreciation', centerX + 12, 74, { align: 'center' });

  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.5);
  pdf.line(72, 80, pageWidth - 72, 80);

  pdf.setFontSize(12);
  pdf.setTextColor(100, 116, 139);
  pdf.text('This certificate is proudly presented to', centerX + 12, 93, { align: 'center' });

  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(15, 23, 42);
  pdf.text(safeVolunteerName, centerX + 12, centerY - 2, { align: 'center' });

  pdf.setDrawColor(16, 185, 129);
  pdf.setLineWidth(0.8);
  pdf.line(centerX - 16, centerY + 4, centerX + 40, centerY + 4);

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(13);
  pdf.setTextColor(71, 85, 105);
  pdf.text('For dedicated volunteer service at', centerX + 12, centerY + 16, {
    align: 'center',
    maxWidth: pageWidth - 36,
  });

  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(4, 120, 87);
  pdf.setFontSize(17);
  pdf.text(safeEventName, centerX + 12, centerY + 28, {
    align: 'center',
    maxWidth: pageWidth - 44,
  });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(71, 85, 105);
  pdf.text('Your commitment and service have helped strengthen our community.', centerX + 12, centerY + 42, {
    align: 'center',
    maxWidth: pageWidth - 48,
  });

  pdf.setFontSize(11);
  pdf.setTextColor(71, 85, 105);
  pdf.text(`Date: ${today}`, 22, pageHeight - 22);

  pdf.setFontSize(10);
  pdf.text('Rotary Connect', pageWidth - 22, pageHeight - 22, { align: 'right' });

  pdf.setDrawColor(203, 213, 225);
  pdf.setLineWidth(0.4);
  pdf.line(24, pageHeight - 34, 72, pageHeight - 34);
  pdf.line(pageWidth - 72, pageHeight - 34, pageWidth - 24, pageHeight - 34);

  pdf.setFontSize(9);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Volunteer Signature', 48, pageHeight - 28, { align: 'center' });
  pdf.text('Authorized by Rotary Club', pageWidth - 48, pageHeight - 28, { align: 'center' });

  const safeFileName = `${safeVolunteerName}-${safeEventName}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  pdf.save(`rotary-connect-certificate-${safeFileName}.pdf`);
}
