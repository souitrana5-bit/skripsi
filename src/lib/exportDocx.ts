import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, TableOfContents, IParagraphOptions, Footer, PageNumber } from 'docx';
import { saveAs } from 'file-saver';
import { SkripsiData, User } from '../types';

const extractDraft = (text: string) => {
  if (!text) return "";
  const startTag = '[DRAF_SKRIPSI_MULAI]';
  const endTag = '[DRAF_SKRIPSI_SELESAI]';
  
  const startIndex = text.indexOf(startTag);
  const endIndex = text.indexOf(endTag);
  
  if (startIndex !== -1 && endIndex !== -1) {
    return text.substring(startIndex + startTag.length, endIndex).trim();
  } else if (startIndex !== -1) {
    return text.substring(startIndex + startTag.length).trim();
  }
  
  const babIndex = text.indexOf('# BAB');
  if (babIndex !== -1) {
     return text.substring(babIndex).trim();
  }
  
  return text;
};

const parseTextRuns = (text: string) => {
  const runs: TextRun[] = [];
  const boldParts = text.split(/(\*\*.*?\*\*)/g);
  
  boldParts.forEach(bPart => {
    if (bPart.startsWith('**') && bPart.endsWith('**')) {
      runs.push(new TextRun({ text: bPart.slice(2, -2), bold: true, size: 24 }));
    } else {
      const italicParts = bPart.split(/(\*.*?\*)/g);
      italicParts.forEach(iPart => {
        if (iPart.startsWith('*') && iPart.endsWith('*') && iPart.length > 2) {
          runs.push(new TextRun({ text: iPart.slice(1, -1), italics: true, size: 24 }));
        } else if (iPart.length > 0) {
          runs.push(new TextRun({ text: iPart, size: 24 }));
        }
      });
    }
  });
  
  return runs;
};

const parseMarkdownToDocx = (rawText: string) => {
  const text = extractDraft(rawText);
  if (!text) return [new Paragraph({ text: "Belum ada konten", style: "Normal" })];
  const lines = text.split('\n');
  
  const paragraphs: Paragraph[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (trimmed.length === 0) continue;

    if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({ 
        children: [new TextRun({ text: trimmed.replace('### ', ''), bold: true, size: 24 })],
        heading: HeadingLevel.HEADING_3, 
        spacing: { before: 240, after: 120 } 
      }));
    } else if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({ 
        children: [new TextRun({ text: trimmed.replace('## ', ''), bold: true, size: 26 })],
        heading: HeadingLevel.HEADING_2, 
        spacing: { before: 360, after: 120 } 
      }));
    } else if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({ 
        children: [new TextRun({ text: trimmed.replace('# ', ''), bold: true, size: 28 })],
        heading: HeadingLevel.HEADING_1, 
        alignment: AlignmentType.CENTER, 
        spacing: { before: 480, after: 240 } 
      }));
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      paragraphs.push(new Paragraph({
        children: parseTextRuns(trimmed.substring(2)),
        bullet: { level: 0 },
        spacing: { line: 360 },
        alignment: AlignmentType.JUSTIFIED,
      }));
    } else if (/^\d+\.\s/.test(trimmed)) {
      const content = trimmed.replace(/^\d+\.\s/, '');
      paragraphs.push(new Paragraph({
        children: parseTextRuns(content),
        numbering: { reference: "my-numbering", level: 0 },
        spacing: { line: 360 },
        alignment: AlignmentType.JUSTIFIED,
      }));
    } else {
      paragraphs.push(new Paragraph({
        children: parseTextRuns(trimmed),
        spacing: { line: 360, after: 120 },
        alignment: AlignmentType.JUSTIFIED,
        indent: { firstLine: 720 },
      }));
    }
  }
  
  return paragraphs;
};

export const exportTextToWord = async (text: string, filename: string = "Parafrase.docx") => {
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "my-numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24, // 12pt
          },
          paragraph: {
            spacing: { line: 360 }, // 1.5 spacing
            alignment: AlignmentType.JUSTIFIED,
          }
        }
      },
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Times New Roman",
            size: 24,
          },
          paragraph: {
            spacing: { line: 360, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 28,
            bold: true,
          },
          paragraph: {
            spacing: { before: 480, after: 240 },
            alignment: AlignmentType.CENTER,
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 24,
            bold: true,
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.LEFT,
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 24,
            bold: true,
            italics: true,
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.LEFT,
          },
        },
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1701,    // 3cm
              right: 1701,  // 3cm
              bottom: 1701, // 3cm
              left: 2268,   // 4cm
            },
            pageNumbers: {
              start: 1,
              formatType: "decimal",
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children: parseMarkdownToDocx(text),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};

export const exportToWord = async (data: SkripsiData, user: User | null, chapter?: 'full' | 'halaman-depan' | 'bab1' | 'bab2' | 'bab3' | 'bab4' | 'bab5' | 'lampiran') => {
  const exportType = chapter || 'full';
  
  const doc = new Document({
    numbering: {
      config: [
        {
          reference: "my-numbering",
          levels: [
            {
              level: 0,
              format: "decimal",
              text: "%1.",
              alignment: AlignmentType.START,
              style: {
                paragraph: {
                  indent: { left: 720, hanging: 360 },
                },
              },
            },
          ],
        },
      ],
    },
    styles: {
      default: {
        document: {
          run: {
            font: "Times New Roman",
            size: 24, // 12pt
          },
          paragraph: {
            spacing: { line: 360 }, // 1.5 spacing
            alignment: AlignmentType.JUSTIFIED,
          }
        }
      },
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Times New Roman",
            size: 24,
          },
          paragraph: {
            spacing: { line: 360, after: 120 },
            alignment: AlignmentType.JUSTIFIED,
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 28,
            bold: true,
          },
          paragraph: {
            spacing: { before: 480, after: 240 },
            alignment: AlignmentType.CENTER,
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 24,
            bold: true,
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.LEFT,
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            font: "Times New Roman",
            size: 24,
            bold: true,
            italics: true,
          },
          paragraph: {
            spacing: { before: 240, after: 120 },
            alignment: AlignmentType.LEFT,
          },
        },
      ]
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1701,    // 3cm
              right: 1701,  // 3cm
              bottom: 1701, // 3cm
              left: 2268,   // 4cm
            },
            pageNumbers: {
              start: 1,
              formatType: "decimal",
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          ...(exportType === 'full' || exportType === 'halaman-depan' ? [
            // ================= COVER PAGE =================
            new Paragraph({
              children: [new TextRun({ text: "SKRIPSI", bold: true, size: 32 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 1200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: (data.judul || "JUDUL BELUM DITENTUKAN").toUpperCase(), bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 1200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Diajukan sebagai salah satu syarat untuk memperoleh gelar Sarjana", size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 1200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "[ LOGO UNIVERSITAS ]", bold: true, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 1200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: "Oleh:", size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),
            new Paragraph({
              children: [new TextRun({ text: (user?.name || "Nama Mahasiswa").toUpperCase(), bold: true, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `NIM. ${user?.nim || "123456789"}`, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 1200 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `PROGRAM STUDI ${(user?.prodi || "PROGRAM STUDI").toUpperCase()}`, bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: `FAKULTAS ${(user?.fakultas || "FAKULTAS").toUpperCase()}`, bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: (user?.universitas || "UNIVERSITAS").toUpperCase(), bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [new TextRun({ text: user?.tahun || new Date().getFullYear().toString(), bold: true, size: 28 })],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // ================= KATA PENGANTAR =================
            new Paragraph({ children: [new TextRun({ text: "KATA PENGANTAR", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...parseMarkdownToDocx(data.kataPengantar),
            new Paragraph({ children: [new PageBreak()] }),

            // ================= DAFTAR ISI =================
            new Paragraph({ children: [new TextRun({ text: "DAFTAR ISI", bold: true, size: 28 })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
            new TableOfContents("Daftar Isi", {
              hyperlink: true,
              headingStyleRange: "1-3",
            }),
            new Paragraph({ children: [new PageBreak()] }),

            // ================= DAFTAR TABEL =================
            new Paragraph({ children: [new TextRun({ text: "DAFTAR TABEL", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            new Paragraph({ children: [new TextRun({ text: "Halaman ini disediakan untuk Daftar Tabel. Silakan perbarui di Microsoft Word.", italics: true })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new PageBreak()] }),

            // ================= DAFTAR GAMBAR =================
            new Paragraph({ children: [new TextRun({ text: "DAFTAR GAMBAR", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            new Paragraph({ children: [new TextRun({ text: "Halaman ini disediakan untuk Daftar Gambar. Silakan perbarui di Microsoft Word.", italics: true })], alignment: AlignmentType.CENTER }),
            new Paragraph({ children: [new PageBreak()] }),
          ] : []),
          
          ...(exportType === 'full' || exportType === 'bab1' ? [
            // ================= BAB I =================
            new Paragraph({ children: [new TextRun({ text: "BAB I", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...parseMarkdownToDocx(data.bab1),
            new Paragraph({ children: [new PageBreak()] }),
          ] : []),
          
          ...(exportType === 'full' || exportType === 'bab2' ? [
            new Paragraph({ children: [new TextRun({ text: "BAB II", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...parseMarkdownToDocx(data.bab2),
            new Paragraph({ children: [new PageBreak()] }),
          ] : []),
          
          ...(exportType === 'full' || exportType === 'bab3' ? [
            new Paragraph({ children: [new TextRun({ text: "BAB III", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...parseMarkdownToDocx(data.bab3),
            new Paragraph({ children: [new PageBreak()] }),
          ] : []),
          
          ...(exportType === 'full' || exportType === 'bab4' ? [
            new Paragraph({ children: [new TextRun({ text: "BAB IV", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...parseMarkdownToDocx(data.bab4),
            new Paragraph({ children: [new PageBreak()] }),
          ] : []),
          
          ...(exportType === 'full' || exportType === 'bab5' ? [
            new Paragraph({ children: [new TextRun({ text: "BAB V", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...parseMarkdownToDocx(data.bab5),
            ...(exportType === 'full' ? [new Paragraph({ children: [new PageBreak()] })] : []),
          ] : []),
          
          ...(exportType === 'full' || exportType === 'lampiran' ? [
            // ================= LAMPIRAN =================
            new Paragraph({ children: [new TextRun({ text: "LAMPIRAN", bold: true, size: 28 })], alignment: AlignmentType.CENTER, heading: HeadingLevel.HEADING_1, spacing: { after: 400 } }),
            ...Array.from({ length: 15 }).map((_, i) => [
              new Paragraph({ children: [new PageBreak()] }),
              new Paragraph({ children: [new TextRun({ text: `Lampiran ${i + 1}: Data Pendukung Penelitian Bagian ${i + 1}`, bold: true, size: 24 })], alignment: AlignmentType.CENTER, spacing: { after: 400 } }),
              new Paragraph({ children: [new TextRun({ text: "Tabel Data Statistik / Transkrip Wawancara / Kuesioner (Halaman ini digenerate secara otomatis untuk memenuhi standar minimal halaman skripsi. Silakan ganti dengan data lampiran asli Anda).", size: 24 })], alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 240 } }),
              ...Array.from({ length: 5 }).map(() => new Paragraph({ children: [new TextRun({ text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", size: 24 })], alignment: AlignmentType.JUSTIFIED, spacing: { line: 360, after: 120 }, indent: { firstLine: 720 } }))
            ]).flat(),
          ] : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  
  let filename = "Skripsi.docx";
  if (exportType !== 'full') {
    filename = `Skripsi_${exportType.toUpperCase()}.docx`;
  }
  
  saveAs(blob, filename);
};
