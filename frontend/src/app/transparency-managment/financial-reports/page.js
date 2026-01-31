'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Box, Typography, Link, Container, Stack,
  Accordion, AccordionSummary, AccordionDetails,
  CircularProgress, Divider, Paper
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import firebird3 from '@/assets/photos/firebird/firebird3.png';
import { useTranslation } from '@/contexts/TranslationProvider.jsx';

const FINANCIAL_DATA = [
  {
    id: 1,
    title: "Фінансова звітність за 2024 рік",
    titleEn: "Financial Reporting 2024",
    documents: [
      {
        name: "Річний фінансовий план",
        nameEn: "Annual Financial Plan",
        url: "https://example.com/plan2024.pdf",
        description: "Затверджений план видатків на поточний рік",
        descriptionEn: "Approved expenditure plan for the current year"
      }
    ],
    subReports: [
      {
        id: "1-1",
        title: "I Квартал",
        titleEn: "Q1 Report",
        description: "Звіти за січень - березень",
        documents: [
          {
            name: "Звіт про надходження коштів (Q1)",
            nameEn: "Revenue Report (Q1)",
            url: "https://example.com/q1-revenue.pdf"
          },
          {
            name: "Витрати на господарські потреби",
            nameEn: "Operational Expenses",
            url: "https://example.com/q1-expenses.pdf"
          }
        ]
      },
      {
        id: "1-2",
        title: "II Квартал",
        titleEn: "Q2 Report",
        documents: [
          {
            name: "Звіт про використання благодійних внесків",
            nameEn: "Charity Funds Usage Report",
            url: "https://example.com/q2-charity.pdf"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Публічні закупівлі (Тендери)",
    titleEn: "Public Procurement (Tenders)",
    documents: [],
    subReports: [
      {
        id: "2-1",
        title: "Закупівля комп'ютерного обладнання",
        titleEn: "Computer Equipment Procurement",
        documents: [
          {
            name: "Тендерна документація",
            nameEn: "Tender Documentation",
            url: "https://example.com/tender-specs.docx"
          },
          {
            name: "Договір з постачальником",
            nameEn: "Supplier Agreement",
            url: "https://example.com/contract.pdf"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Інші офіційні документи",
    titleEn: "Other Official Documents",
    documents: [
      {
        name: "Статут організації",
        nameEn: "Organization Charter",
        url: "https://example.com/charter.pdf",
        description: "Офіційний установчий документ",
        descriptionEn: "Official constitutive document"
      }
    ],
    subReports: []
  }
];

const FinancialReportsPage = () => {
  const { t, locale } = useTranslation("financial");
  const [reports, setReports] = useState(FINANCIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const fetchReports = async () => {
  //     try {
  //       const res = await fetch('/api/financial-reports');
  //       if (res.ok) {
  //         const data = await res.json();
  //         // Очікуємо структуру: { id, title, titleEn, subReports: [ { title, titleEn, documents: [...] } ], documents: [...] }
  //         setReports(data);
  //       }
  //     } catch (e) {
  //       console.error('Error fetching reports:', e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchReports();
  // }, []);

  // Допоміжна функція для локалізації
  const l = (uk, en) => (locale === 'en' ? en || uk : uk);

  return (
      <Container maxWidth="lg" sx={{ py: 2, mb: 1, minHeight: "450px" }}>
        {/* Header із зображенням */}
        <Box
            sx={{
              position: 'relative',
              mb: { xs: 4, md: 6 },
              p: { xs: 2, md: 6 },
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: "150px",  md: '300px' }
            }}
        >
          {/* Текстовий блок */}
          <Typography
              variant="h1"
              sx={{
                fontFamily: 'Montserrat Alternates, sans-serif',
                fontWeight: 800,
                fontSize: { xs: '26px', sm: '36px', md: '52px' },
                color: '#182BA1',
                zIndex: 2,
                position: 'relative',
                maxWidth: { md: '60%' },
                textAlign: 'center',
                lineHeight: 1.2
              }}
          >
            {t('financialReportsTitle')}
          </Typography>

          {/* Фенікс (Firebird) */}
          <Box sx={{
            position: 'absolute',
            right: { xs: '-10%', md: '-5%' },
            width: { xs: '180px', sm: '300px' },
            height: 'auto',
            opacity: 0.2,
            zIndex: 1,
            pointerEvents: 'none',
            transform: 'rotate(-10deg)',
          }}>
            <Image
                src={firebird3}
                alt=""
                priority
                style={{ width: '100%', height: 'auto', filter: 'grayscale(30%)' }}
            />
          </Box>
        </Box>

        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#182BA1' }} />
            </Box>
        ) : (
            <Stack spacing={4}>
              {reports.map((report) => (
                  <ReportSection key={report.id} report={report} l={l} />
              ))}
            </Stack>
        )}
      </Container>
  );
};

// Компонент секції (Заголовок + Підзаголовки + Документи)
const ReportSection = ({ report, l }) => {
  return (
      <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
        <Typography variant="h4" sx={{
          fontWeight: 700,
          color: '#182BA1',
          mb: 3,
          fontSize: { xs: 20, md: 28 },
          borderLeft: '4px solid #182BA1',
          pl: 2
        }}>
          {l(report.title, report.titleEn)}
        </Typography>

        {/* 1. Прямі документи заголовку (якщо є) */}
        {report.documents?.length > 0 && (
            <DocumentList documents={report.documents} l={l} />
        )}

        {/* 2. Підзаголовки (якщо є) */}
        {report.subReports?.map((sub) => (
            <Accordion
                key={sub.id}
                elevation={0}
                sx={{
                  bgcolor: 'transparent',
                  '&:before': { display: 'none' },
                  borderBottom: '1px solid #CBD5E1'
                }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ fontWeight: 600, fontSize: { xs: 16, md: 19 } }}>
                  {l(sub.title, sub.titleEn)}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {sub.description && (
                    <Typography sx={{ mb: 2, fontSize: 14, color: '#475569' }}>
                      {l(sub.description, sub.descriptionEn)}
                    </Typography>
                )}
                <DocumentList documents={sub.documents} l={l} />
              </AccordionDetails>
            </Accordion>
        ))}
      </Paper>
  );
};

// Компонент списку документів
const DocumentList = ({ documents, l }) => (
    <Stack spacing={1.5} sx={{ my: 2 }}>
      {documents.map((doc, idx) => (
          <Box
              key={idx}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                p: 1.5,
                borderRadius: 2,
                transition: '0.2s',
                '&:hover': { bgcolor: 'rgba(24, 43, 161, 0.04)' }
              }}
          >
            <InsertDriveFileIcon sx={{ color: '#182BA1', mt: 0.5 }} />
            <Box>
              <Link
                  href={doc.fileUrl || doc.url}
                  target="_blank"
                  sx={{
                    fontWeight: 600,
                    color: '#182BA1',
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' }
                  }}
              >
                {l(doc.name, doc.nameEn)}
              </Link>
              {doc.description && (
                  <Typography sx={{ fontSize: 13, color: '#64748B', mt: 0.5 }}>
                    {l(doc.description, doc.descriptionEn)}
                  </Typography>
              )}
            </Box>
          </Box>
      ))}
    </Stack>
);

export default FinancialReportsPage;