#!/bin/bash
set -e

cat << 'ASS' > /tmp/full_scroll.ass
[Script Info]
ScriptType: v4.00+
PlayResX: 478
PlayResY: 850
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: TickerBar,Noto Serif Telugu,14,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,0,0,2,0,0,0,1
Style: HeaderBadge,Noto Serif Telugu,14,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,1,0,1,10,10,72,1
Style: TopTitle,Noto Serif Telugu,13,&H0000FFFF,&H000000FF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,3,1,1,1,10,10,72,1
Style: ScrollText,Noto Serif Telugu,17,&H0000FFFF,&H000000FF,&H00000000,&H90000000,-1,0,0,0,100,100,0,0,3,1,1,1,0,0,22,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
; Permanent lower-third background bar across entire video
Dialogue: 0,0:00:00.00,0:01:23.00,TickerBar,,0,0,0,,{\an1\pos(0,850)\p1\c&H0A0A3B&\1a&H18&\3a&H00&\3c&H08B3EA&\bord2}m 0 0 l 478 0 l 478 92 l 0 92{\p0}
; Fixed live red badge
Dialogue: 2,0:00:00.00,0:01:23.00,HeaderBadge,,0,0,0,,{\an1\pos(10,772)\c&H0000EE&\bord1\3c&HFFFFFF&}🔴 సంకల్ప కర్తలు:
Dialogue: 2,0:00:00.00,0:01:23.00,TopTitle,,0,0,0,,{\an1\pos(135,772)\c&H00D7FF&\bord1\3c&H000000&}శ్రీ కార్తీక మాస ఏకవార రుద్రాభిషేకం

; Cycle 1: 0:00 to 0:28
Dialogue: 1,0:00:00.00,0:00:28.00,ScrollText,,0,0,0,,{\move(480,820,-2800,820)}🔱 కణ్వాసస గోత్రం: మునిపల్లె భవాని దేవి, పుత్రుడు శ్రీహర్ష మణికంఠ ఆంజనేయ శర్మ   ❖   🔱 కాశ్యపస గోత్రం: జల్లవరం సాయి ధీరజ్ శర్మ & సమస్త కుటుంబ సభ్యులు   ❖   🔱 ఆత్రేయస గోత్రం: పెండ్యాల వెంకటేశ్వరరావు, లక్ష్మి, సాయికృష్ణ   ❖   🔱 భారద్వాజస గోత్రం: చదలవాడ శ్రీనివాస శర్మ, సుమలత, దీపిక   ❖   🔱 కౌండిన్యస గోత్రం: మారేపల్లి సుబ్రహ్మణ్య శాస్త్రి & కుటుంబ సభ్యులు   ❖   🔱 శ్రీవత్సస గోత్రం: వడ్లమాని రామకృష్ణ, పద్మావతి   ❖   🔱 హరితస గోత్రం: కొండేటి అన్నపూర్ణ దేవి, రాజశేఖర్ పరివారం

; Cycle 2: 0:27 to 0:55
Dialogue: 1,0:00:27.00,0:00:55.00,ScrollText,,0,0,0,,{\move(480,820,-2800,820)}🔱 కణ్వాసస గోత్రం: మునిపల్లె భవాని దేవి, పుత్రుడు శ్రీహర్ష మణికంఠ ఆంజనేయ శర్మ   ❖   🔱 కాశ్యపస గోత్రం: జల్లవరం సాయి ధీరజ్ శర్మ & సమస్త కుటుంబ సభ్యులు   ❖   🔱 ఆత్రేయస గోత్రం: పెండ్యాల వెంకటేశ్వరరావు, లక్ష్మి, సాయికృష్ణ   ❖   🔱 భారద్వాజస గోత్రం: చదలవాడ శ్రీనివాస శర్మ, సుమలత, దీపిక   ❖   🔱 కౌండిన్యస గోత్రం: మారేపల్లి సుబ్రహ్మణ్య శాస్త్రి & కుటుంబ సభ్యులు   ❖   🔱 శ్రీవత్సస గోత్రం: వడ్లమాని రామకృష్ణ, పద్మావతి   ❖   🔱 హరితస గోత్రం: కొండేటి అన్నపూర్ణ దేవి, రాజశేఖర్ పరివారం

; Cycle 3: 0:54 to 0:83
Dialogue: 1,0:00:54.00,0:01:23.00,ScrollText,,0,0,0,,{\move(480,820,-2800,820)}🔱 కణ్వాసస గోత్రం: మునిపల్లె భవాని దేవి, పుత్రుడు శ్రీహర్ష మణికంఠ ఆంజనేయ శర్మ   ❖   🔱 కాశ్యపస గోత్రం: జల్లవరం సాయి ధీరజ్ శర్మ & సమస్త కుటుంబ సభ్యులు   ❖   🔱 ఆత్రేయస గోత్రం: పెండ్యాల వెంకటేశ్వరరావు, లక్ష్మి, సాయికృష్ణ   ❖   🔱 భారద్వాజస గోత్రం: చదలవాడ శ్రీనివాస శర్మ, సుమలత, దీపిక   ❖   🔱 కౌండిన్యస గోత్రం: మారేపల్లి సుబ్రహ్మణ్య శాస్త్రి & కుటుంబ సభ్యులు   ❖   🔱 శ్రీవత్సస గోత్రం: వడ్లమాని రామకృష్ణ, పద్మావతి   ❖   🔱 హరితస గోత్రం: కొండేటి అన్నపూర్ణ దేవి, రాజశేఖర్ పరివారం
ASS

echo "Encoding full video with burned-in scrolling ticker..."
ffmpeg -i public/assets/aistudio/0574c345-07e3-45ef-b15c-debb61f809b6_59677808.mp4 \
  -vf "ass=/tmp/full_scroll.ass" \
  -c:v libx264 -preset veryfast -crf 22 \
  -c:a copy \
  -movflags +faststart \
  -y public/assets/aistudio/kartika-abhishekam-with-scrolltext.mp4

echo "Copying to dist directory..."
mkdir -p dist/assets/aistudio
cp -f public/assets/aistudio/kartika-abhishekam-with-scrolltext.mp4 dist/assets/aistudio/

echo "Finished successfully!"
ls -lh public/assets/aistudio/kartika-abhishekam-with-scrolltext.mp4
