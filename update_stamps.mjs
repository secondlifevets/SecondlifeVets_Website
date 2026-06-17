import fs from 'fs';

const stampCode = `
const VerifiedStamp = ({ id }: { id: string | number }) => (
  <div className="relative w-[60px] h-[60px] rotate-[-12deg] mt-1 shrink-0 opacity-90 mx-auto bg-transparent overflow-visible" style={{ filter: 'drop-shadow(0 0 1px rgba(93, 177, 100, 0.2))' }}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#5DB164]">
      <defs>
        <path id={\`topArc-\${id}\`} d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
        <path id={\`bottomArc-\${id}\`} d="M 6 50 A 44 44 0 0 0 94 50" fill="none" />
        <filter id={\`stamp-noise-\${id}\`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1" in="noise" result="alphaNoise" />
          <feComposite operator="in" in="SourceGraphic" in2="alphaNoise" />
        </filter>
      </defs>
      <g filter={\`url(#stamp-noise-\${id})\`}>
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={\`#topArc-\${id}\`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
        </text>
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={\`#bottomArc-\${id}\`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
        </text>
        <path d="M 19.5 40 A 32 32 0 0 1 80.5 40" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <path d="M 19.5 60 A 32 32 0 0 0 80.5 60" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <text x="50" y="55" fontSize="16" fontWeight="900" fontFamily="Montserrat, sans-serif" fill="currentColor" textAnchor="middle" textLength="76" lengthAdjust="spacingAndGlyphs">VERIFIED</text>
        <g fill="currentColor">
          <text x="36" y="35" fontSize="6" textAnchor="middle">★</text>
          <text x="50" y="33.5" fontSize="7" textAnchor="middle">★</text>
          <text x="64" y="35" fontSize="6" textAnchor="middle">★</text>
        </g>
        <g fill="currentColor">
          <text x="36" y="67" fontSize="6" textAnchor="middle">★</text>
          <text x="50" y="68.5" fontSize="7" textAnchor="middle">★</text>
          <text x="64" y="67" fontSize="6" textAnchor="middle">★</text>
        </g>
      </g>
    </svg>
  </div>
);
`;

const processFile = (filePath, isEditable) => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('const VerifiedStamp =')) {
    const signature = isEditable 
      ? 'export default function EditableDigitalPassport'
      : 'export default function DigitalPassport';
    content = content.replace(signature, stampCode + '\n' + signature);
  }

  // Replace original inline svg in Vaccination
  const vaxSvgPattern = /<div className="relative w-\[60px\] h-\[60px\].*?<\/svg>\s*<\/div>/gims;
  content = content.replace(vaxSvgPattern, '<VerifiedStamp id={`vax-${i}`} />');

  if (isEditable) {
    // EditableDigitalPassport updates
    
    // Deworming
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[40%] border-l border-white/10">Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[25%] border-l border-white/10">Veterinarian</th>\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
    );
    content = content.replace(
      /<td className="p-3 border-l border-\[\#D9E2EC\]\/50 font-inter align-top">\s*<InputField value=\{v.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\('deworming_records', i, 'veterinarian_name', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" \/>\s*<\/td>/g,
      `<td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('deworming_records', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('deworming_records', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={\`deworm-\${i}\`} />}
                          </div>
                        </td>`
    );

    // Health Checkups
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Vet</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] border-l border-white/10">Vet</th>\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
    );
    content = content.replace(
      /<td className="p-3 border-l border-\[\#D9E2EC\]\/50 font-inter align-top">\s*<InputField value=\{v.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\('health_checkups', i, 'veterinarian_name', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" \/>\s*<\/td>/g,
      `<td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('health_checkups', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('health_checkups', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={\`health-\${i}\`} />}
                          </div>
                        </td>`
    );

    // Tick & Flea
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[35%] border-l border-white/10">Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Veterinarian</th>\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
    );
    content = content.replace(
      /<td className="p-3 border-l border-\[\#D9E2EC\]\/50 font-inter align-top">\s*<InputField value=\{v.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\('tick_flea_treatments', i, 'veterinarian_name', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" \/>\s*<\/td>/g,
      `<td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('tick_flea_treatments', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('tick_flea_treatments', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={\`tick-\${i}\`} />}
                          </div>
                        </td>`
    );

    // Surgeries
    // Using string replacements because there's only one such th
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[35%] border-l border-white/10">Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Veterinarian</th>\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
    );
    content = content.replace(
      /<td className="p-3 border-l border-\[\#D9E2EC\]\/50 font-inter align-top">\s*<InputField value=\{v.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\('surgeries', i, 'veterinarian_name', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" \/>\s*<\/td>/g,
      `<td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-top">
                          <InputField value={v.veterinarian_name || ""} onChange={(val) => updateTableData('surgeries', i, 'veterinarian_name', val)} placeholder="Vet Name" className="font-semibold text-[#0E4664]" />
                        </td>
                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">
                          <div className="flex flex-col items-center justify-center gap-1">
                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData('surgeries', i, 'is_vod_verified', val)} />
                            {v.is_vod_verified && <VerifiedStamp id={\`surgery-\${i}\`} />}
                          </div>
                        </td>`
    );

    // Default values for addRow
    content = content.replace(
      /addRow\('deworming_records', \{ date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\], dewormer: '', veterinarian_name: '' \}\)/g,
      "addRow('deworming_records', { date: new Date().toISOString().split('T')[0], dewormer: '', veterinarian_name: '', is_vod_verified: true })"
    );
    content = content.replace(
      /addRow\('health_checkups', \{ date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\], body_weight: '', tpr: '', general_body_condition: '', prescription: '', veterinarian_name: '' \}\)/g,
      "addRow('health_checkups', { date: new Date().toISOString().split('T')[0], body_weight: '', tpr: '', general_body_condition: '', prescription: '', veterinarian_name: '', is_vod_verified: true })"
    );
    content = content.replace(
      /addRow\('tick_flea_treatments', \{ date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\], medicine: '', veterinarian_name: '' \}\)/g,
      "addRow('tick_flea_treatments', { date: new Date().toISOString().split('T')[0], medicine: '', veterinarian_name: '', is_vod_verified: true })"
    );
    content = content.replace(
      /addRow\('surgeries', \{ date: new Date\(\)\.toISOString\(\)\.split\('T'\)\[0\], surgery_details: '', veterinarian_name: '' \}\)/g,
      "addRow('surgeries', { date: new Date().toISOString().split('T')[0], surgery_details: '', veterinarian_name: '', is_vod_verified: true })"
    );
    
  } else {
    // DigitalPassport updates
    
    // Deworming
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[30%] border-l border-white/10">Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Veterinarian</th>\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
    );
    content = content.replace(
      /<td className="p-3 font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]\/50 font-inter">\{record\.veterinarian_name \|\| "—"\}<\/td>/g,
      `<td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter">{record.veterinarian_name || "—"}</td>
                  <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                    <div className="flex flex-col items-center justify-center relative">
                      {record.is_vod_verified && <VerifiedStamp id={\`deworm-\${i}\`} />}
                    </div>
                  </td>`
    );
    content = content.replace('<td colSpan={3} className="p-4 text-center', '<td colSpan={4} className="p-4 text-center');

    // Health Checkups
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[18%] border-l border-white/10">Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] border-l border-white/10">Veterinarian</th>\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
    );
    content = content.replace(
      /<td className="p-3 font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]\/50 font-inter align-top">\{record\.veterinarian \|\| "—"\}<\/td>/g,
      `<td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter align-top">{record.veterinarian || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {record.is_vod_verified && <VerifiedStamp id={\`health-\${i}\`} />}
                  </div>
                </td>`
    );
    content = content.replace('<td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No health checkup records found.</td>', '<td colSpan={5} className="p-4 text-center text-xs text-slate-400 font-medium italic">No health checkup records found.</td>');

    // Tick & Flea (Using w-1/4 for Vet, so change it)
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-1/4 text-center border-l border-white/10">Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] text-center border-l border-white/10">Veterinarian</th>\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
    );
    content = content.replace(
      /<td className="p-3 text-center font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]\/50 font-inter">\{t\.veterinarian_name \|\| "—"\}<\/td>/g,
      `<td className="p-3 text-center font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter">{t.veterinarian_name || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {t.is_vod_verified && <VerifiedStamp id={\`tick-\${i}\`} />}
                  </div>
                </td>`
    );
    content = content.replace('<td colSpan={3} className="p-4 text-center text-xs text-slate-400 font-medium italic">No treatment records found.</td>', '<td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No treatment records found.</td>');

    // Surgeries
    content = content.replace(
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[30%] border-l border-white/10">Attending Veterinarian</th>',
      '<th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[20%] border-l border-white/10">Attending Veterinarian</th>\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
    );
    content = content.replace(
      /<td className="p-3 font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]\/50 font-inter align-middle">\{record\.veterinarian_name \|\| "—"\}<\/td>/g,
      `<td className="p-3 font-semibold text-[#0E4664] border-l border-[#D9E2EC]/50 font-inter align-middle">{record.veterinarian_name || "—"}</td>
                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">
                  <div className="flex flex-col items-center justify-center relative">
                    {record.is_vod_verified && <VerifiedStamp id={\`surgery-\${i}\`} />}
                  </div>
                </td>`
    );
    content = content.replace('<td colSpan={3} className="p-4 text-center text-xs text-slate-400 font-medium italic">No surgical records found.</td>', '<td colSpan={4} className="p-4 text-center text-xs text-slate-400 font-medium italic">No surgical records found.</td>');

  }

  fs.writeFileSync(filePath, content);
};

processFile('components/admin/EditableDigitalPassport.tsx', true);
processFile('components/DigitalPassport.tsx', false);
console.log('Update successful');
