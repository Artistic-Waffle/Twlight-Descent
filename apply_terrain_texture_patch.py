from pathlib import Path
import json, re

terrain = Path("RP/textures/terrain_texture.json")
additions_file = Path("RP/textures/terrain_texture_additions.json")

if not terrain.exists():
    raise SystemExit("Run this from the repository root. RP/textures/terrain_texture.json was not found.")

data = json.loads(additions_file.read_text(encoding="utf-8"))["texture_data"]
text = terrain.read_text(encoding="utf-8")

missing = [k for k in data if not re.search(rf'(?m)^\s*"{re.escape(k)}"\s*:', text)]
if not missing:
    print("No terrain_texture changes needed.")
    raise SystemExit(0)

marker = "\t\t// ===== WIP ====="
if marker not in text:
    raise SystemExit("Could not find the WIP section marker. No changes were made.")

lines = ["\t\t// ===== New Frostveil / Shattermoor Assets ====="]
for key in missing:
    value = json.dumps(data[key], indent=4)
    value = "\n".join([value.splitlines()[0]] + ["\t\t" + x for x in value.splitlines()[1:]])
    lines.append(f'\t\t"{key}": {value},')

text = text.replace(marker, "\n".join(lines) + "\n\n" + marker, 1)
terrain.write_text(text, encoding="utf-8")
print("Added:", ", ".join(missing))
