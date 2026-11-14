import React, { useState, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import {
  ExternalLink,
  FileText,
  Download,
  Search,
  CheckCircle2,
  Copy,
  Globe,
  Sparkles,
  Filter,
} from 'lucide-react';

export interface AstrologyGuestPostSite {
  id: number;
  url: string;
  linkType: 'Dofollow';
  category: 'write-for-us' | 'blog-submission';
  domain: string;
}

const RAW_GUEST_POST_URLS: string[] = [
  'https://astro.99consultant.com/write-for-us/',
  'https://www.excelebiz.in/astrology-horoscope/',
  'https://www.creativebloggingworld.com/category/astrology/',
  'https://astroupdate.com/write-for-us/',
  'https://askastrology.com/write-for-us',
  'https://astroakashvani.com/write-for-us/',
  'https://www.adviseastro.com/write-for-us',
  'https://www.astrologyfix.com/write-for-us/',
  'https://www.healthmanifested.com/write-for-us',
  'https://mylittlemagicshop.com/pages/contribute',
  'https://astrologyanswers.com/pages/write-for-us/',
  'https://numbervoice.com/write-us-guest-post/',
  'https://angelnumbersmeans.com/',
  'https://www.astrologyzone.com/',
  'https://skyandtelescope.org/',
  'https://numerologist.com/',
  'https://www.starzology.com/',
  'https://onlinetarotreadings.net/',
  'https://www.purohitastrology.in/write-to-us/',
  'https://askastrology.com/write-for-us/',
  'https://www.adviseastro.com/write-for-us/',
  'http://www.tarotreadingsecrets.com/pages/Write-for-us',
  'https://www.biddytarot.com/submission-guidelines/',
  'https://askastrology.com/astrology-blog/articles/',
  'https://www.astroved.com/blogs',
  'https://www.clickastro.com/blog/',
  'https://www.astrology.com/articles',
  'https://www.yourtango.com/zodiac',
  'https://www.kellysastrology.com/category/blog/',
  'https://anneortelee.com/',
  'https://sasstrology.com/posts',
  'https://chaninicholas.com/category/horoscopes/',
  'https://darkstarastrology.com/',
  'https://www.leahwhitehorse.com/',
  'https://astrobutterfly.com/',
  'https://www.jessicaadams.com/category/blog/',
  'https://www.elsaelsa.com/',
  'https://starsignstyle.com/',
  'https://www.thedarkpixieastrology.com/blog',
  'https://astrology.com.au/blog',
  'https://astrofix.net/',
  'https://www.patrickarundell.com/blog/',
  'https://www.yasminboland.com/blog/',
  'http://www.bestastrologysolution.com/blog/',
  'https://www.thehoodwitch.com/blog/',
  'https://www.sallykirkman.com/blog/',
  'https://www.aquariuspapers.com/',
  'https://crystalbastrology.com/blog/',
  'https://www.moonkissd.com/blog/',
  'https://bigskyastrology.com/blog/',
  'https://cultureastrology.com/blog/',
  'https://newparadigmastrology.com/blog/',
  'https://www.mollysastrology.com/astrology-blog/',
  'https://techasli.com/',
  'https://juliedemboski.com/',
  'https://www.astrodynamics.net/blog/',
  'https://www.tdjacobs.com/blog/',
  'https://astrogospel.com/blogs/',
  'https://www.karenmoregold.com/astrology-blog',
  'https://blog.lanawooster.co.uk/',
  'https://my-sky-pie.com/news/',
  'https://cosmicoccultastrology.com/blogs/astrology',
  'http://somyadevi.com/blog/',
  'https://stormcestavani.com/blog/',
  'https://www.astroshaman.com/blog/',
  'https://www.pandoraastrology.com/blog/',
  'https://cassandratyndall.com/blog/',
  'https://www.starseedastrology.com/blog',
  'https://stephaniegailing.com/journal/',
  'https://auntiemoon.com/',
  'http://www.francescaoddie.com/blog/',
  'https://www.astrolocherry.com/',
  'https://astrologyindailylife.com/blog/',
  'https://www.astromomma.com/',
  'https://lisasalvatore.com/blog/',
  'https://www.asktheastrologers.com/',
  'https://www.radicalvirgo.com/',
  'https://debraclementastrologer.com/blog',
  'https://blog.indianastrologysoftware.com/',
  'https://www.astrohealer.com/astrology-articles/',
  'https://www.moonology.com/blog/',
  'https://trusted-astrology.com/blog/',
  'https://astrologyyard.com/blog/',
  'https://durgadarbar.com/blog/',
  'https://blog.astrologylover.com/',
  'https://www.astrovidhi.com/blog/',
  'https://astrologyschool.net/',
  'https://www.alinoura.com/blog',
  'https://classicalastrologer.com/',
  'https://www.dooroflotus.com/an-astrologer-diary',
  'https://www.mylifecreated.com/breadthnsol/',
  'https://kundalinivaran.com/blog?blog=y',
  'https://starsdanceastrology.com/blog/',
  'https://astrologyrealness.com/',
  'https://www.hereticastrologer.com/blog',
  'https://sunrulesleo.com/blog-astrology/',
  'https://tatianaborsch.com/articles',
  'http://www.carmendiluccio.com/blog/',
  'https://www.tarotbytashi.com/',
  'https://abbeygalequinn.com/real-advice/',
  'https://www.stelliumastrology.com/category/blog/',
  'https://www.williamlamontastrologer.com/astrology-blog',
  'https://astralharmony.com/blog/',
  'https://astro-awakenings.co.uk/astrology-blog',
  'https://www.yourtarotlife.com/blog/',
  'https://www.writeyourscreenplay.com/tarot-for-writers/',
  'https://www.astro.org/News-and-Publications/Journals/Author-Instructions',
  'https://astrobites.org/apply-to-write-for-astrobites/',
  'https://astrobites.org/2021/10/04/apply-to-write-for-astrobites-2020-2-2/',
  'https://bohoastro.com/category/celebrity-horoscopes-blog/',
  'https://starsintheircourses.com/%e3%83%96%e3%83%ad%e3%82%b0/',
  'https://www.appliedvedicastrology.com/category/astro-blog/',
  'https://nightfallastrology.com/unapologetic-horoscopes-and-more-astrology-blog/',
];

function extractDomain(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, '');
  } catch {
    return rawUrl;
  }
}

export const ASTROLOGY_GUEST_POST_SITES: AstrologyGuestPostSite[] = RAW_GUEST_POST_URLS.map(
  (url, idx) => {
    const lower = url.toLowerCase();
    const isDirectWriteForUs =
      lower.includes('write') ||
      lower.includes('contribute') ||
      lower.includes('submission') ||
      lower.includes('author-instructions') ||
      lower.includes('apply-to-write');
    return {
      id: idx + 1,
      url,
      linkType: 'Dofollow',
      category: isDirectWriteForUs ? 'write-for-us' : 'blog-submission',
      domain: extractDomain(url),
    };
  }
);

const STORAGE_SUBMITTED_KEY = 'slg_admin_guest_post_done_v1';

const PITCH_TEMPLATE = `Subject: Guest Post Contribution: Authentic Vedic Astrology, Drik Panchangam & Kundali Insights

Namaste Editorial Team,

I am Brahmasri Jallavaram Sai Dheeraj Sharma, chief Vedic astrologer at Sri Lakshmi Ganapathi Jyothishalayam (https://www.telugujyothisham.com), Hyderabad.

We would love to contribute an original, well-researched 1,200+ word article for your readers on one of the following topics:
1. How Drik Siddhanta Panchangam (Tithi, Nakshatra, Rahukalam & Abhijit Muhurtham) Shapes Daily Decision Making
2. Understanding 36 Guna Ashtakoota & 22 South Indian Poruthams in Vedic Marriage Matching
3. Planetary Gochara (Saturn, Jupiter & Rahu-Ketu Transits) and Practical Vedic Remedies

The article will be 100% original, non-promotional, and tailored to your editorial guidelines. Please let us know if we may send over the draft.

Warm regards,
Brahmasri Jallavaram Sai Dheeraj Sharma
Sri Lakshmi Ganapathi Jyothishalayam
Website: https://www.telugujyothisham.com
Daily Panchangam: https://www.telugujyothisham.com/panchangam
Daily Horoscope: https://www.telugujyothisham.com/rashi-phalalu`;

export const AdminAstrologyGuestPostStudio: React.FC = () => {
  const [search, setSearch] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<'all' | 'write-for-us' | 'blog-submission'>('all');
  const [copiedNotice, setCopiedNotice] = useState<string>('');
  const [submittedIds, setSubmittedIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SUBMITTED_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleSubmitted = (id: number) => {
    setSubmittedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_SUBMITTED_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const filteredSites = useMemo(() => {
    return ASTROLOGY_GUEST_POST_SITES.filter((site) => {
      if (filterCategory !== 'all' && site.category !== filterCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return (
        site.url.toLowerCase().includes(q) ||
        site.domain.toLowerCase().includes(q) ||
        String(site.id) === q
      );
    });
  }, [search, filterCategory]);

  const handleCopyText = async (label: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedNotice(`✅ ${label} కాపీ చేయబడింది!`);
      setTimeout(() => setCopiedNotice(''), 3000);
    } catch {
      setCopiedNotice('⚠️ కాపీ సాధ్యపడలేదు');
    }
  };

  /**
   * Generates a multi-page PDF where EVERY URL is a real clickable hyperlink
   * that opens the target website directly when clicked inside the PDF viewer.
   */
  const handleDownloadClickablePdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;

    const drawPageHeader = (pageNumber: number) => {
      doc.setFillColor(74, 18, 5); // Royal Maroon
      doc.rect(0, 0, pageWidth, 26, 'F');
      doc.setTextColor(253, 230, 138); // Gold
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(13);
      doc.text(
        'SRI LAKSHMI GANAPATHI JYOTHISHALAYAM - SEO BACKLINK DIRECTORY',
        margin,
        11
      );
      doc.setFontSize(9.5);
      doc.setTextColor(255, 255, 255);
      doc.text(
        `113 Dofollow Astrology Guest Posting Sites (Click any URL to open website)  |  Page ${pageNumber}`,
        margin,
        19
      );

      // Table column headers
      doc.setFillColor(254, 243, 199);
      doc.rect(margin, 29, pageWidth - margin * 2, 8, 'F');
      doc.setTextColor(120, 53, 15);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.text('No.', margin + 2, 34.3);
      doc.text('Website URL (Click Link to Open Directly)', margin + 14, 34.3);
      doc.text('Type', pageWidth - margin - 22, 34.3);
    };

    let currentPage = 1;
    drawPageHeader(currentPage);
    let y = 42;
    const rowHeight = 7.2;

    ASTROLOGY_GUEST_POST_SITES.forEach((site, index) => {
      if (y + rowHeight > pageHeight - 14) {
        doc.addPage();
        currentPage += 1;
        drawPageHeader(currentPage);
        y = 42;
      }

      // Alternating row background
      if (index % 2 === 0) {
        doc.setFillColor(255, 251, 235);
        doc.rect(margin, y - 4.8, pageWidth - margin * 2, rowHeight, 'F');
      }

      // Row number
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(71, 85, 105);
      doc.text(`${site.id}.`, margin + 2, y);

      // Clickable URL with real PDF hyperlink annotation
      const displayUrl =
        site.url.length > 74 ? site.url.slice(0, 71) + '...' : site.url;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.2);
      doc.setTextColor(29, 78, 216); // Classic clickable link blue
      doc.textWithLink(displayUrl, margin + 14, y, { url: site.url });

      // Underline for visual link clarity
      const textWidth = doc.getTextWidth(displayUrl);
      doc.setDrawColor(29, 78, 216);
      doc.setLineWidth(0.15);
      doc.line(margin + 14, y + 0.7, margin + 14 + textWidth, y + 0.7);

      // Dofollow badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(4, 120, 87);
      doc.text(site.linkType, pageWidth - margin - 22, y);

      y += rowHeight;
    });

    // Footer on last page
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Admin Exclusive SEO Resource - https://www.telugujyothisham.com (Source: 4seohelp Astrology Guest Posting List)',
      margin,
      pageHeight - 6
    );

    doc.save('Astrology-113-Guest-Posting-Sites-Clickable.pdf');
  };

  /**
   * Generates a Microsoft Word (.doc) document with a formatted table where
   * every website is an active <a href="..."> hyperlink that opens on click.
   */
  const handleDownloadClickableWordDoc = () => {
    const rowsHtml = ASTROLOGY_GUEST_POST_SITES.map(
      (site) => `
        <tr style="background:${site.id % 2 === 0 ? '#fffbeb' : '#ffffff'};">
          <td style="padding:8px 10px;border:1px solid #d97706;font-weight:bold;text-align:center;">${site.id}</td>
          <td style="padding:8px 10px;border:1px solid #d97706;font-weight:bold;color:#78350f;">${site.domain}</td>
          <td style="padding:8px 10px;border:1px solid #d97706;">
            <a href="${site.url}" target="_blank" style="color:#1d4ed8;text-decoration:underline;font-weight:bold;">${site.url}</a>
          </td>
          <td style="padding:8px 10px;border:1px solid #d97706;text-align:center;color:#047857;font-weight:bold;">${
            site.category === 'write-for-us' ? 'Write For Us (Direct)' : 'Astrology Blog'
          }</td>
          <td style="padding:8px 10px;border:1px solid #d97706;text-align:center;color:#065f46;font-weight:bold;">${site.linkType}</td>
        </tr>`
    ).join('');

    const wordHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:w="urn:schemas-microsoft-com:office:word"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8" />
        <title>113 Astrology Guest Posting Sites List - Admin SEO Directory</title>
      </head>
      <body style="font-family:Arial,sans-serif;color:#1e293b;line-height:1.5;">
        <div style="background:#3b1506;color:#fde68a;padding:18px 22px;border-bottom:4px solid #f59e0b;">
          <h1 style="margin:0;font-size:20pt;color:#fde68a;">శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం — Admin SEO Backlink Directory</h1>
          <p style="margin:6px 0 0;font-size:11pt;color:#ffffff;">
            113 Dofollow Astrology Guest Posting Websites (Click any link below to open the website directly)
          </p>
        </div>

        <h2 style="color:#9a3412;font-size:14pt;margin-top:18px;">1. Target Backlink URLs for Our Website (Copy & Use in Articles)</h2>
        <ul>
          <li><strong>Homepage:</strong> <a href="https://www.telugujyothisham.com">https://www.telugujyothisham.com</a> (Anchor: <em>Telugu Jyothisham / Best Astrologer in Hyderabad</em>)</li>
          <li><strong>Daily Telugu Panchangam:</strong> <a href="https://www.telugujyothisham.com/panchangam">https://www.telugujyothisham.com/panchangam</a> (Anchor: <em>Today Telugu Panchangam</em>)</li>
          <li><strong>Daily Rashi Phalalu:</strong> <a href="https://www.telugujyothisham.com/rashi-phalalu">https://www.telugujyothisham.com/rashi-phalalu</a> (Anchor: <em>Rashi Phalalu in Telugu</em>)</li>
          <li><strong>Free Janma Kundali PDF:</strong> <a href="https://www.telugujyothisham.com/janma-kundali">https://www.telugujyothisham.com/janma-kundali</a> (Anchor: <em>Janma Kundali by Date of Birth in Telugu</em>)</li>
        </ul>

        <h2 style="color:#9a3412;font-size:14pt;margin-top:18px;">2. Complete List of 113 Astrology Guest Posting Sites (Clickable Links)</h2>
        <table style="width:100%;border-collapse:collapse;font-size:10.5pt;">
          <thead>
            <tr style="background:#78350f;color:#fde68a;">
              <th style="padding:10px;border:1px solid #d97706;width:6%;">No.</th>
              <th style="padding:10px;border:1px solid #d97706;width:22%;">Domain</th>
              <th style="padding:10px;border:1px solid #d97706;width:46%;">Clickable Website URL</th>
              <th style="padding:10px;border:1px solid #d97706;width:16%;">Submission Type</th>
              <th style="padding:10px;border:1px solid #d97706;width:10%;">Link Type</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', wordHtml], {
      type: 'application/msword;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Astrology-113-Guest-Posting-Sites-Clickable.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const directWriteForUsCount = useMemo(
    () => ASTROLOGY_GUEST_POST_SITES.filter((s) => s.category === 'write-for-us').length,
    []
  );

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-lg space-y-6 text-slate-900">
      {/* Header & Download Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-amber-200 pb-5">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-900 text-amber-200 text-xs font-extrabold uppercase tracking-wider">
              <Globe size={14} />
              <span>ADMIN ONLY • OFF-PAGE SEO BACKLINK STUDIO</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-extrabold">
              ✓ 113 Dofollow Astrology Sites
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-900 text-xs font-extrabold">
              పూర్తయినవి (Submitted): {submittedIds.length} / {ASTROLOGY_GUEST_POST_SITES.length}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950">
            🔗 113 జ్యోతిష్య Guest Posting & Backlink వెబ్‌సైట్ల జాబితా (Clickable PDF & Word)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ఏ వెబ్‌సైట్ లింక్ మీద క్లిక్ చేసినా నేరుగా ఆ వెబ్‌సైట్ ఓపెన్ అవుతుంది. అలాగే కింద ఉన్న బటన్లతో{' '}
            <strong>Clickable PDF</strong> లేదా <strong>Word (.doc)</strong> ఫైల్‌గా డౌన్‌లోడ్ చేసుకోవచ్చు — అందులో కూడా లింక్ నొక్కితే నేరుగా ఆ సైట్‌కే వెళ్తుంది!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadClickablePdf}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-rose-700 via-red-600 to-amber-600 hover:from-rose-600 hover:to-amber-500 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <Download size={17} />
            <span>📄 Clickable PDF డౌన్‌లోడ్ (113 Links)</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadClickableWordDoc}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-600 hover:to-indigo-600 text-white font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
          >
            <FileText size={17} />
            <span>📝 Word (.doc) డౌన్‌లోడ్ (Clickable Links)</span>
          </button>

          <button
            type="button"
            onClick={() => handleCopyText('Guest Post Pitch Template', PITCH_TEMPLATE)}
            className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-400 font-extrabold text-xs sm:text-sm transition-all cursor-pointer"
          >
            <Copy size={15} />
            <span>✉️ Guest Post Email Pitch కాపీ</span>
          </button>
        </div>
      </div>

      {copiedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-between">
          <span>{copiedNotice}</span>
        </div>
      )}

      {/* Quick SEO Backlink Target Box for Admin */}
      <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs sm:text-sm font-extrabold text-amber-950 flex items-center gap-1.5">
            <Sparkles size={15} className="text-amber-700" />
            <span>మన సైట్ Top #1 రావడానికి Guest Post ఆర్టికల్స్‌లో ఇవ్వాల్సిన మన 4 ముఖ్య లింకులు:</span>
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
          {[
            {
              label: '1. హోమ్‌పేజీ (Hyderabad Astrologer)',
              url: 'https://www.telugujyothisham.com',
            },
            {
              label: '2. నేటి తెలుగు పంచాంగం',
              url: 'https://www.telugujyothisham.com/panchangam',
            },
            {
              label: '3. నేటి రాశి ఫలాలు (12 Rashis)',
              url: 'https://www.telugujyothisham.com/rashi-phalalu',
            },
            {
              label: '4. ఉచిత జన్మ కుండలి PDF',
              url: 'https://www.telugujyothisham.com/janma-kundali',
            },
          ].map((item) => (
            <div
              key={item.url}
              className="bg-white border border-amber-200 rounded-xl p-2.5 flex items-center justify-between gap-2"
            >
              <div className="truncate">
                <div className="font-bold text-amber-950 truncate">{item.label}</div>
                <div className="text-[11px] text-blue-700 font-mono truncate">{item.url}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyText(item.label, item.url)}
                className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-[11px] shrink-0 cursor-pointer"
              >
                కాపీ
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
            <Filter size={14} /> ఫిల్టర్:
          </span>
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-amber-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            అన్నీ ({ASTROLOGY_GUEST_POST_SITES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('write-for-us')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterCategory === 'write-for-us'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
            }`}
          >
            ✍️ Direct &ldquo;Write For Us&rdquo; పేజీలు ({directWriteForUsCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('blog-submission')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              filterCategory === 'blog-submission'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
            }`}
          >
            🌐 Astrology Blogs ({ASTROLOGY_GUEST_POST_SITES.length - directWriteForUsCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="వెబ్‌సైట్ పేరు లేదా నంబర్ వెతకండి..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-amber-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-amber-600"
          />
        </div>
      </div>

      {/* Interactive Clickable Table */}
      <div className="overflow-x-auto border border-amber-200 rounded-2xl max-h-[560px] overflow-y-auto">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead className="bg-amber-950 text-amber-100 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-3 font-extrabold w-14 text-center">No.</th>
              <th className="py-3 px-3 font-extrabold">వెబ్‌సైట్ లింక్ (Click to Open Website)</th>
              <th className="py-3 px-3 font-extrabold w-36 text-center">రకం (Category)</th>
              <th className="py-3 px-3 font-extrabold w-24 text-center">Link Type</th>
              <th className="py-3 px-3 font-extrabold w-28 text-center">Status</th>
              <th className="py-3 px-3 font-extrabold w-36 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-100">
            {filteredSites.map((site) => {
              const isDone = submittedIds.includes(site.id);
              return (
                <tr
                  key={site.id}
                  className={`transition-colors ${
                    isDone ? 'bg-emerald-50/70' : 'hover:bg-amber-50/70'
                  }`}
                >
                  <td className="py-2.5 px-3 font-extrabold text-center text-amber-950">
                    #{site.id}
                  </td>
                  <td className="py-2.5 px-3">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-bold text-blue-700 hover:text-blue-900 underline break-all"
                    >
                      <span>{site.url}</span>
                      <ExternalLink size={13} className="shrink-0" />
                    </a>
                    <div className="text-[11px] text-slate-500">Domain: {site.domain}</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {site.category === 'write-for-us' ? (
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 text-[11px] font-extrabold">
                        ✍️ Write For Us
                      </span>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-900 text-[11px] font-bold">
                        🌐 Astro Blog
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded-md bg-amber-100 text-amber-950 text-[11px] font-extrabold">
                      {site.linkType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => toggleSubmitted(site.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      <span>{isDone ? 'Posted ✓' : 'Mark Done'}</span>
                    </button>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs"
                    >
                      <span>వెబ్‌సైట్ తెరువు</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
