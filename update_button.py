import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<button className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-6\s*py-2\.5 rounded-full text-sm font-bold transition">\s*Contact Sales\s*</button>'

repl = r'<a href="mailto:banerjeearindam888@gmail.com" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-xl text-sm transition flex flex-col items-end text-right"><span className="font-black text-cyan-400 tracking-wider">HIRE ME</span><span className="text-[10px] font-medium mt-0.5 opacity-80">8709786647 | banerjeearindam888@gmail.com</span></a>'

c = re.sub(pattern, repl, c, flags=re.MULTILINE|re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
