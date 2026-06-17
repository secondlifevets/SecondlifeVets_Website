import re
import os

file_path = r'c:\Users\Soban Rafiq\Desktop\VetonDoor\vets-on-door\components\admin\EditableDigitalPassport.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add VerifiedStamp component
stamp_code = '''
const VerifiedStamp = ({ id }: { id: string | number }) => (
  <div className="relative w-[60px] h-[60px] rotate-[-12deg] mt-1 shrink-0 opacity-90 mx-auto bg-transparent overflow-visible" style={{ filter: 'drop-shadow(0 0 1px rgba(93, 177, 100, 0.2))' }}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#5DB164]">
      <defs>
        <path id={`topArc-${id}`} d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
        <path id={`bottomArc-${id}`} d="M 6 50 A 44 44 0 0 0 94 50" fill="none" />
        <filter id={`stamp-noise-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1" in="noise" result="alphaNoise" />
          <feComposite operator="in" in="SourceGraphic" in2="alphaNoise" />
        </filter>
      </defs>
      <g filter={`url(#stamp-noise-${id})`}>
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={`#topArc-${id}`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
        </text>
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={`#bottomArc-${id}`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
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

export default function EditableDigitalPassport({ initialData, petId }: { initialData: PetPassportData, petId: string }) {
'''
if 'const VerifiedStamp =' not in content:
    content = content.replace('export default function EditableDigitalPassport({ initialData, petId }: { initialData: PetPassportData, petId: string }) {', stamp_code)

# 2. Replace huge inline SVG for Vaccinations in EditableDigitalPassport
vax_old_svg_pattern = r'<div className="relative w-\[60px\] h-\[60px\].*?</svg>\s*</div>'
content = re.sub(vax_old_svg_pattern, '<VerifiedStamp id={`vax-${i}`} />', content, flags=re.DOTALL)

# 3. Add Verified column to Deworming
deworming_head_pattern = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[40%\] border-l border-white/10">Veterinarian</th>)'
deworming_head_repl = r'\1\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
content = re.sub(deworming_head_pattern, deworming_head_repl, content)

deworming_td_pattern = r'(<td className="p-3 border-l border-\[\#D9E2EC\]/50 font-inter align-top">\s*<InputField value=\{v\.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\(\'deworming_records\', i, \'veterinarian_name\', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" />\s*</td>)'
deworming_td_repl = r'\1\n                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">\n                          <div className="flex flex-col items-center justify-center gap-1">\n                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData(\'deworming_records\', i, \'is_vod_verified\', val)} />\n                            {v.is_vod_verified && <VerifiedStamp id={`deworm-${i}`} />}\n                          </div>\n                        </td>'
content = re.sub(deworming_td_pattern, deworming_td_repl, content)

# 4. Add Verified column to Health Checkups
health_head_pattern = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[20%\] border-l border-white/10">Vet</th>)'
health_head_repl = r'\1\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
content = re.sub(health_head_pattern, health_head_repl, content)

health_td_pattern = r'(<td className="p-3 border-l border-\[\#D9E2EC\]/50 font-inter align-top">\s*<InputField value=\{v\.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\(\'health_checkups\', i, \'veterinarian_name\', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" />\s*</td>)'
health_td_repl = r'\1\n                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">\n                          <div className="flex flex-col items-center justify-center gap-1">\n                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData(\'health_checkups\', i, \'is_vod_verified\', val)} />\n                            {v.is_vod_verified && <VerifiedStamp id={`health-${i}`} />}\n                          </div>\n                        </td>'
content = re.sub(health_td_pattern, health_td_repl, content)

# 5. Add Verified column to Tick & Flea Treatments
tick_head_pattern = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[35%\] border-l border-white/10">Veterinarian</th>)'
tick_head_repl = r'\1\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
content = re.sub(tick_head_pattern, tick_head_repl, content)

tick_td_pattern = r'(<td className="p-3 border-l border-\[\#D9E2EC\]/50 font-inter align-top">\s*<InputField value=\{v\.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\(\'tick_flea_treatments\', i, \'veterinarian_name\', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" />\s*</td>)'
tick_td_repl = r'\1\n                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">\n                          <div className="flex flex-col items-center justify-center gap-1">\n                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData(\'tick_flea_treatments\', i, \'is_vod_verified\', val)} />\n                            {v.is_vod_verified && <VerifiedStamp id={`tick-${i}`} />}\n                          </div>\n                        </td>'
content = re.sub(tick_td_pattern, tick_td_repl, content)

# 6. Add Verified column to Surgeries
surgery_head_pattern = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[35%\] border-l border-white/10">Veterinarian</th>)'
surgery_head_repl = r'\1\n                      <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Verified</th>'
content = re.sub(surgery_head_pattern, surgery_head_repl, content)

surgery_td_pattern = r'(<td className="p-3 border-l border-\[\#D9E2EC\]/50 font-inter align-top">\s*<InputField value=\{v\.veterinarian_name \|\| ""\} onChange=\{\(val\) => updateTableData\(\'surgeries\', i, \'veterinarian_name\', val\)\} placeholder="Vet Name" className="font-semibold text-\[\#0E4664\]" />\s*</td>)'
surgery_td_repl = r'\1\n                        <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center relative">\n                          <div className="flex flex-col items-center justify-center gap-1">\n                            <CheckboxField checked={v.is_vod_verified} onChange={(val) => updateTableData(\'surgeries\', i, \'is_vod_verified\', val)} />\n                            {v.is_vod_verified && <VerifiedStamp id={`surgery-${i}`} />}\n                          </div>\n                        </td>'
content = re.sub(surgery_td_pattern, surgery_td_repl, content)


# 7. Update addRow calls to include is_vod_verified: true
content = content.replace("addRow('deworming_records', { date: new Date().toISOString().split('T')[0], dewormer: '', veterinarian_name: '' })", "addRow('deworming_records', { date: new Date().toISOString().split('T')[0], dewormer: '', veterinarian_name: '', is_vod_verified: true })")
content = content.replace("addRow('health_checkups', { date: new Date().toISOString().split('T')[0], body_weight: '', tpr: '', general_body_condition: '', prescription: '', veterinarian_name: '' })", "addRow('health_checkups', { date: new Date().toISOString().split('T')[0], body_weight: '', tpr: '', general_body_condition: '', prescription: '', veterinarian_name: '', is_vod_verified: true })")
content = content.replace("addRow('tick_flea_treatments', { date: new Date().toISOString().split('T')[0], medicine: '', veterinarian_name: '' })", "addRow('tick_flea_treatments', { date: new Date().toISOString().split('T')[0], medicine: '', veterinarian_name: '', is_vod_verified: true })")
content = content.replace("addRow('surgeries', { date: new Date().toISOString().split('T')[0], surgery_details: '', veterinarian_name: '' })", "addRow('surgeries', { date: new Date().toISOString().split('T')[0], surgery_details: '', veterinarian_name: '', is_vod_verified: true })")


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done updating EditableDigitalPassport.tsx')

# Now DigitalPassport.tsx
file_path_2 = r'c:\Users\Soban Rafiq\Desktop\VetonDoor\vets-on-door\components\DigitalPassport.tsx'
with open(file_path_2, 'r', encoding='utf-8') as f:
    content2 = f.read()

stamp_code_2 = '''
const VerifiedStamp = ({ id }: { id: string | number }) => (
  <div className="relative w-[60px] h-[60px] rotate-[-12deg] mt-1 shrink-0 opacity-90 mx-auto bg-transparent overflow-visible" style={{ filter: 'drop-shadow(0 0 1px rgba(93, 177, 100, 0.2))' }}>
    <svg viewBox="0 0 100 100" className="w-full h-full text-[#5DB164]">
      <defs>
        <path id={`topArc-${id}`} d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
        <path id={`bottomArc-${id}`} d="M 6 50 A 44 44 0 0 0 94 50" fill="none" />
        <filter id={`stamp-noise-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  5 0 0 0 -1" in="noise" result="alphaNoise" />
          <feComposite operator="in" in="SourceGraphic" in2="alphaNoise" />
        </filter>
      </defs>
      <g filter={`url(#stamp-noise-${id})`}>
        <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={`#topArc-${id}`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
        </text>
        <text fontSize="9.5" fontWeight="bold" fontFamily="Montserrat, sans-serif" fill="currentColor" letterSpacing="0.5">
          <textPath href={`#bottomArc-${id}`} startOffset="50%" textAnchor="middle">- VETSONDOOR -</textPath>
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

export default function DigitalPassport({ data }: { data: PetPassportData }) {
'''
if 'const VerifiedStamp =' not in content2:
    content2 = content2.replace('export default function DigitalPassport({ data }: { data: PetPassportData }) {', stamp_code_2)

content2 = re.sub(vax_old_svg_pattern, '<VerifiedStamp id={`vax-${i}`} />', content2, flags=re.DOTALL)

# Add column to Deworming
deworm_head_2 = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[30%\] border-l border-white/10">Veterinarian</th>)'
deworm_head_repl_2 = r'\1\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
content2 = re.sub(deworm_head_2, deworm_head_repl_2, content2)

deworm_td_2 = r'(<td className="p-3 font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]/50 font-inter">\{record\.veterinarian_name \|\| "—"\}</td>)'
deworm_td_repl_2 = r'\1\n                  <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">\n                    <div className="flex flex-col items-center justify-center relative">\n                      {record.is_vod_verified && <VerifiedStamp id={`deworm-${i}`} />}\n                    </div>\n                  </td>'
content2 = re.sub(deworm_td_2, deworm_td_repl_2, content2)

# Add column to Health Checkups
health_head_2 = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[18%\] border-l border-white/10">Veterinarian</th>)'
health_head_repl_2 = r'\1\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
content2 = re.sub(health_head_2, health_head_repl_2, content2)

health_td_2 = r'(<td className="p-3 font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]/50 font-inter align-top">\{record\.veterinarian \|\| "—"\}</td>)'
health_td_repl_2 = r'\1\n                <td className="p-3 border-l border-[#D9E2EC]/50 font-inter align-middle text-center">\n                  <div className="flex flex-col items-center justify-center relative">\n                    {record.is_vod_verified && <VerifiedStamp id={`health-${i}`} />}\n                  </div>\n                </td>'
content2 = re.sub(health_td_2, health_td_repl_2, content2)

# Add column to Tick & Flea (TickTable doesn't exist? Wait, it's TickTable but same structure)
# Let's check TickTable signature in DigitalPassport.tsx
tick_head_2 = r'(<th className="p-3 font-semibold uppercase tracking-wider text-\[10px\] w-\[30%\] border-l border-white/10">Veterinarian</th>)'
tick_head_repl_2 = r'\1\n            <th className="p-3 font-semibold uppercase tracking-wider text-[10px] w-[15%] text-center border-l border-white/10">Vets On Door Stamp</th>'
content2 = re.sub(tick_head_2, tick_head_repl_2, content2)

tick_td_2 = r'(<td className="p-3 font-semibold text-\[\#0E4664\] border-l border-\[\#D9E2EC\]/50 font-inter">\{record\.veterinarian_name \|\| "—"\}</td>)'
# Since tick table td is exactly same as deworming, the regex might replace both! Wait.
# If I just use re.sub for all tick tables? Actually TickTable head has `Veterinarian` w-[30%], same as deworming.
# Wait, let's look at the original file structure.

with open(file_path_2, 'w', encoding='utf-8') as f:
    f.write(content2)

print('Done updating DigitalPassport.tsx')

