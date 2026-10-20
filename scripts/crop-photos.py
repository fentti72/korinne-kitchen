"""How the site photos in src/assets/photos were cropped from the originals.
Re-run on full-size originals: python3 -I scripts/crop-photos.py ORIGINALS_DIR src/assets/photos"""
import sys, os
from PIL import Image, ImageOps

raw, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)

# name: (source, (left, top, right, bottom) as fractions, page)
PICKS = {
    # About
    'about-portrait': ('ivory-135.JPG', (0.0, 0.08, 1.0, 1.0), 'about'),
    'about-portrait-standing': ('ivory-137.JPG', (0.0, 0.06, 1.0, 1.0), 'about'),
    'about-mixing': ('IMG_3353.jpg', (0.22, 0.05, 1.0, 0.92), 'about'),
    'about-chocolate-cake': ('IMG_1023.jpg', (0.24, 0.02, 0.80, 0.78), 'about'),
    'about-chef-whites': ('c74468fc-abf1-4933-bc2f-0acbb1cb23d2.jpg', (0.36, 0.28, 0.82, 0.90), 'about'),
    # Gallery (signature dishes)
    'gallery-roulade-plate': ('011fcd37-efd6-458b-a160-80a0a6446de8.jpg', (0.0, 0.22, 0.95, 0.97), 'gallery'),
    'gallery-strawberry-layer-cake': ('2ae432d6-a1ef-4af3-84eb-a1b1bc80947d.jpg', (0.12, 0.10, 1.0, 0.82), 'gallery'),
    'gallery-strawberry-cake-top': ('3b44fd21-4d27-463a-8f2a-a6e3d477d22d.jpg', (0.06, 0.15, 0.96, 0.82), 'gallery'),
    'gallery-rainbow-cake-slice': ('IMG_6342.jpg', (0.0, 0.25, 1.0, 0.86), 'gallery'),
    'blog-chocolate-caramel-cake': ('IMG_1031.jpg', (0.0, 0.20, 1.0, 1.0), 'blog'),
    'gallery-monkey-bread': ('IMG_7875.jpg', (0.02, 0.12, 0.98, 0.88), 'gallery'),
    # Bake drops
    'bake-braided-rolls': ('IMG_3243.jpg', (0.0, 0.0, 1.0, 0.52), 'bake'),
    'bake-pecan-cake': ('IMG_1268.jpg', (0.18, 0.10, 0.88, 0.98), 'bake'),
    # Classes
    'class-mixing': ('IMG_3353.jpg', (0.0, 0.06, 1.0, 0.78), 'classes'),
    'class-braided-rolls': ('IMG_3243.jpg', (0.0, 0.45, 1.0, 1.0), 'classes'),
    # Kitchen Notes
    'blog-fried-rice': ('IMG_4907.jpg', (0.0, 0.18, 1.0, 0.95), 'blog'),
    'blog-chocolate-sprinkle-cake': ('IMG_4603.jpg', (0.0, 0.12, 1.0, 0.88), 'blog'),
    'blog-sprinkle-cake': ('IMG_6327.jpg', (0.10, 0.10, 0.95, 0.95), 'blog'),
    'blog-stethoscope-cake': ('IMG_4980.jpg', (0.38, 0.22, 0.83, 0.95), 'blog'),
    'blog-mint-oreo-cake': ('IMG_5867.jpg', (0.30, 0.18, 0.88, 1.0), 'blog'),
    # Added back: children cropped out, names kept
    'about-graduation': ('172777e8-c9a2-4115-901a-405f0754835c.jpg', (0.14, 0.14, 0.98, 0.98), 'about'),
    'about-school-poster': ('59a746f2-84a4-49e3-8642-ddfc0ed7430c.jpg', (0.0, 0.06, 1.0, 0.96), 'about'),
    'blog-birthday-cake-aria': ('61156080-3f31-470f-99f8-034c5bf419dd.jpg', (0.20, 0.10, 0.73, 0.84), 'blog'),
    'blog-pink-sprinkle-cake': ('IMG_3706.jpg', (0.0, 0.60, 0.58, 1.0), 'blog'),
    'blog-racecar-cake': ('IMG_7577.jpg', (0.06, 0.06, 0.98, 0.88), 'blog'),
    'blog-congrats-daddy-cake': ('IMG_2190.jpg', (0.05, 0.05, 0.95, 0.98), 'blog'),
    'blog-anniversary-cake': ('IMG_3302.jpg', (0.05, 0.10, 0.95, 0.95), 'blog'),
    'blog-birthday-31-cake': ('IMG_2841.jpg', (0.08, 0.20, 0.80, 0.98), 'blog'),
    'blog-first-birthday-cake': ('IMG_4621.jpg', (0.0, 0.05, 1.0, 0.95), 'blog'),
    'blog-rosette-cake': ('IMG_0277.jpg', (0.0, 0.0, 1.0, 1.0), 'blog'),
    # Recipes
    'recipe-healthy-pancakes': ('healthy-pancakes.jpg', (0.03, 0.17, 0.97, 0.80), 'recipes'),
}

for name, (src, (l, t, r, b), page) in PICKS.items():
    im = ImageOps.exif_transpose(Image.open(os.path.join(raw, src))).convert('RGB')
    w, h = im.size
    im = im.crop((round(l * w), round(t * h), round(r * w), round(b * h)))
    im.thumbnail((2000, 2000), Image.LANCZOS)  # never upscale
    path = os.path.join(out, f'{name}.jpg')
    im.save(path, quality=82, optimize=True, progressive=True)
    print(f'{page:8} {name:34} {im.width}x{im.height}  {os.path.getsize(path)//1024} KB  <- {src}')
