import fs from 'fs';
import path from 'path';

const kishanImgPath = path.resolve(process.cwd(), 'public/pramana-patram-kishan-rao.png');
const sampleImgPath = path.resolve(process.cwd(), 'public/pramana-patram-sample.png');
const kishanPdfPath = path.resolve(process.cwd(), 'public/pramana-patram-kishan-rao.pdf');
const samplePdfPath = path.resolve(process.cwd(), 'public/pramana-patram-sample.pdf');

const kishanImgBase64 = fs.readFileSync(kishanImgPath).toString('base64');
const sampleImgBase64 = fs.readFileSync(sampleImgPath).toString('base64');
const kishanPdfBase64 = fs.readFileSync(kishanPdfPath).toString('base64');
const samplePdfBase64 = fs.readFileSync(samplePdfPath).toString('base64');

const htmlContent = `<!DOCTYPE html>
<html lang="te">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>కార్తీక మాస ఏకవార రుద్రాభిషేక సంకల్ప ప్రమాణ పత్రములు</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800&family=Noto+Serif+Telugu:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: linear-gradient(135deg, #1e0909 0%, #2a0c0c 50%, #150505 100%);
      color: #fef3c7;
      font-family: 'Noto Serif Telugu', serif;
      padding: 24px;
      min-height: 100vh;
    }
    .header {
      text-align: center;
      max-width: 900px;
      margin: 0 auto 30px;
      padding: 24px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 16px;
    }
    h1 {
      color: #fde68a;
      font-size: 26px;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #fbbf24;
      font-size: 16px;
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 28px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .card {
      background: #230a0a;
      border: 2px solid #d97706;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      display: flex;
      flex-direction: column;
    }
    .card-title {
      font-size: 20px;
      font-weight: bold;
      color: #fef08a;
      border-bottom: 2px solid rgba(245, 158, 11, 0.3);
      padding-bottom: 10px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .badge {
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 9999px;
      background: #78350f;
      color: #fef3c7;
    }
    .badge-sample {
      background: #854d0e;
    }
    .img-container {
      background: #000;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(245, 158, 11, 0.4);
      margin-bottom: 16px;
    }
    .img-container img {
      width: 100%;
      height: auto;
      display: block;
    }
    .btn-group {
      display: flex;
      gap: 12px;
      margin-top: auto;
    }
    .btn {
      flex: 1;
      padding: 12px 14px;
      border-radius: 10px;
      border: none;
      font-weight: bold;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      text-decoration: none;
      transition: all 0.2s;
      text-align: center;
    }
    .btn-pdf {
      background: linear-gradient(135deg, #991b1b 0%, #b91c1c 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(153, 27, 27, 0.4);
      border: 1px solid #f87171;
    }
    .btn-pdf:hover {
      background: linear-gradient(135deg, #b91c1c 0%, #dc2626 100%);
    }
    .btn-download {
      background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
      color: #ffffff;
      box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
      border: 1px solid #fbbf24;
    }
    .btn-download:hover {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>శ్రీలక్ష్మి గణపతి జ్యోతిషాలయం</h1>
    <div class="subtitle">కార్తీక మాస ఏకవార రుద్రాభిషేక సంకల్ప అధికారిక ప్రమాణ పత్రములు</div>
    <p style="margin-top: 8px; font-size: 14px; color: #cbd5e1;">బ్రహ్మశ్రీ జల్లవరం సాయి ధీరజ్ శర్మ గారి ఆధ్వర్యంలో • అధికారిక వేదిక: www.telugujyothisham.com</p>
  </div>

  <div class="grid">
    <!-- 1. Kishan Rao Certificate -->
    <div class="card">
      <div class="card-title">
        <span>కిషన్ రావ్ గారి ప్రమాణ పత్రం</span>
        <span class="badge">గోప్యమైనది / వ్యక్తిగతం</span>
      </div>
      <p style="font-size: 13px; color: #fed7aa; margin-bottom: 12px;">
        భరద్వాజస గోత్రం • కిషన్ రావ్, మాలతి, రాఘవేంద్ర రావు • దక్షిణ ₹2,500/- స్వీకరించబడినది
      </p>
      <div class="img-container">
        <img src="data:image/png;base64,${kishanImgBase64}" alt="కిషన్ రావ్ గారి ప్రమాణ పత్రం" />
      </div>
      <div class="btn-group">
        <a class="btn btn-pdf" href="data:application/pdf;base64,${kishanPdfBase64}" download="pramana-patram-kishan-rao.pdf">
          📄 PDF డౌన్‌లోడ్ (A4 Print)
        </a>
        <a class="btn btn-download" href="data:image/png;base64,${kishanImgBase64}" download="pramana-patram-kishan-rao.png">
          🖼️ PNG డౌన్‌లోడ్ (HD)
        </a>
      </div>
    </div>

    <!-- 2. Sample Certificate for Group -->
    <div class="card">
      <div class="card-title">
        <span>వాట్సాప్ గ్రూప్ నమూనా పత్రం</span>
        <span class="badge badge-sample">గ్రూప్ ఎగ్జాంపుల్</span>
      </div>
      <p style="font-size: 13px; color: #fed7aa; margin-bottom: 12px;">
        కౌశికస (నమూనా) • భక్తులకు చూపించడానికి వాటర్‌మార్క్‌తో సిద్ధం చేసిన శాంపిల్ పత్రం
      </p>
      <div class="img-container">
        <img src="data:image/png;base64,${sampleImgBase64}" alt="శాంపిల్ ప్రమాణ పత్రం" />
      </div>
      <div class="btn-group">
        <a class="btn btn-pdf" href="data:application/pdf;base64,${samplePdfBase64}" download="pramana-patram-sample.pdf">
          📄 PDF డౌన్‌లోడ్ (A4 Print)
        </a>
        <a class="btn btn-download" href="data:image/png;base64,${sampleImgBase64}" download="pramana-patram-sample.png">
          🖼️ PNG డౌన్‌లోడ్ (HD)
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;

const outArtifactDir = '/.aistudio/artifacts/brain/d7f4d73a-f04c-4d56-99d8-3fa007f00f48';
if (!fs.existsSync(outArtifactDir)) {
  fs.mkdirSync(outArtifactDir, { recursive: true });
}

const outArtifactFile = path.join(outArtifactDir, 'pramana_patram_certificates.html');
fs.writeFileSync(outArtifactFile, htmlContent);
console.log('✅ Updated artifact viewer with PDF & PNG at: ' + outArtifactFile);
