import os

# Base directory for backend source
base_dir = r"C:\Users\tb619\Videos\Projects\FuelEU\backend\src"

def fix_file(file_path):
    # Calculate depth relative to 'src'
    # src/adapters/inbound/http/middleware/errorHandler.ts -> ['adapters', 'inbound', 'http', 'middleware', 'errorHandler.ts']
    rel_path = os.path.relpath(file_path, base_dir)
    parts = rel_path.split(os.sep)
    # Number of levels to go up to reach 'src'
    levels = len(parts) - 1
    dots = "../" * levels
    
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    new_lines = []
    changed = False
    for line in lines:
        if "from '" in line or 'from "' in line:
            # Match patterns like '../../../core' and replace with appropriate number of dots
            # We look for imports starting with ../ to core, domain, application, etc.
            if "'../../../core" in line:
                line = line.replace("'../../../core", f"'{dots}core")
                changed = True
            elif '"../../../core' in line:
                line = line.replace('"../../../core', f'"{dots}core')
                changed = True
            elif "'../../domain" in line:
                # Some files might have different depths
                # Let's just fix the specific levels we found or make it more generic
                pass
        new_lines.append(line)
    
    if changed:
        with open(file_path, "w", encoding="utf-8") as f:
            f.writelines(new_lines)
        print(f"Fixed: {rel_path}")

# Walk through src and fix files
for root, dirs, files in os.walk(base_dir):
    for file in files:
        if file.endswith(".ts") or file.endswith(".tsx"):
            fix_file(os.path.join(root, file))

print("Systematic fix done.")
