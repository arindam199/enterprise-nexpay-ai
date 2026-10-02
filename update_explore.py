import re

with open('src/app/page.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<button className="bg-white text-purple-900 font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">\s*Explore Perks\s*</button>'

repl = r'<button onClick={() => window.location.href = \'/pro\'} className="bg-white text-purple-900 font-bold py-2 px-6 rounded-full shadow-lg hover:scale-105 transition-transform">Explore Perks</button>'

c = re.sub(pattern, repl, c, flags=re.MULTILINE|re.DOTALL)

with open('src/app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(c)
