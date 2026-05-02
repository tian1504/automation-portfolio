"""Generate the OG image for eleazarai.dev — Workshop Vespers aesthetic."""
import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# --- Output ---
OUT_PATH = r"C:/Users/Lenovo/Desktop/Claude Code/EleazarAI/public/og-image.png"
W, H = 1200, 630

# --- Colors ---
BG = (10, 9, 7)             # warm near-black hsl(30 8% 4%)
INK = (247, 246, 242)       # warm cream foreground
INK_DIM = (180, 174, 167)   # muted cream
INK_QUIET = (110, 105, 99)  # very dim
YELLOW = (245, 197, 24)     # signature yellow hsl(45 93% 54%) — #f5c518
YELLOW_GLOW = (245, 197, 24)
KEYWORD = (210, 145, 130)   # soft rose for keywords
FUNC = (155, 195, 215)      # soft cyan for namespaces
BORDER = (44, 41, 37)       # 30 6% 16%
CARD = (18, 16, 13)         # 30 8% 6%
TRAFFIC_RED = (255, 95, 87)
TRAFFIC_AMBER = (254, 188, 46)
TRAFFIC_GREEN = (40, 200, 64)

FONT_DIR = r"C:/Users/Lenovo/AppData/Roaming/Claude/local-agent-mode-sessions/skills-plugin/cc4f3cd4-3c36-4dae-a093-fd5447a67dcf/7ba69bbd-b43e-4cff-9c0e-7875a8445c8a/skills/canvas-design/canvas-fonts"

def f(name, size):
    return ImageFont.truetype(os.path.join(FONT_DIR, name), size)

# Type stack
SANS_BOLD = lambda s: f("Outfit-Bold.ttf", s)
SANS_REG  = lambda s: f("Outfit-Regular.ttf", s)
MONO_BOLD = lambda s: f("GeistMono-Bold.ttf", s)
MONO_REG  = lambda s: f("GeistMono-Regular.ttf", s)


def draw_text_kerned(draw, xy, text, font, fill, tracking=0):
    """Draw text with optional manual letter-spacing (in px)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        bbox = font.getbbox(ch)
        x += (bbox[2] - bbox[0]) + tracking
    return x


def text_width_kerned(font, text, tracking=0):
    w = 0
    for ch in text:
        bbox = font.getbbox(ch)
        w += (bbox[2] - bbox[0]) + tracking
    return w - tracking if text else 0


def make_glow(size, color, alpha):
    """Create a radial glow rectangle — soft blurred ellipse."""
    glow = Image.new("RGBA", size, (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    cx, cy = size[0] // 2, size[1] // 2
    rx, ry = size[0] // 2, size[1] // 2
    gd.ellipse([0, 0, size[0], size[1]], fill=(*color, alpha))
    return glow.filter(ImageFilter.GaussianBlur(radius=80))


# --- Build canvas ---
img = Image.new("RGB", (W, H), BG)

# Subtle yellow glow upper-right (the "lamp on the workbench")
glow = make_glow((520, 380), YELLOW_GLOW, 36)
img.paste(glow, (W - 380, -120), glow)

# Faint warm vignette on the left to ground the type
left_glow = make_glow((640, 640), (60, 50, 40), 24)
img.paste(left_glow, (-240, 60), left_glow)

draw = ImageDraw.Draw(img)

# === LAYOUT ===
LEFT_X = 64
RIGHT_X = 700
RIGHT_W = 444   # code window width
RIGHT_PAD_R = 64

# === TOP-LEFT: mono label ===
label_font = MONO_REG(20)
label_y = 64
# Yellow indicator slash before label
label_text = "// AI AUTOMATION ENGINEER"
draw_text_kerned(draw, (LEFT_X, label_y), label_text, label_font, YELLOW, tracking=2.0)

# === HEADLINE: stacked 3 lines ===
HEAD_SIZE = 88
head_font = SANS_BOLD(HEAD_SIZE)
head_lines = ["Eleazar", "Sebastian", "Martinez"]
line_height = int(HEAD_SIZE * 0.92)
head_start_y = 130

for i, line in enumerate(head_lines):
    y = head_start_y + i * line_height
    draw_text_kerned(draw, (LEFT_X - 2, y), line, head_font, INK, tracking=-3.0)

# Yellow period after "Martinez"
last_line = head_lines[-1]
last_y = head_start_y + (len(head_lines) - 1) * line_height
last_w = text_width_kerned(head_font, last_line, tracking=-3.0)
draw_text_kerned(draw, (LEFT_X - 2 + last_w + 2, last_y), ".", head_font, YELLOW, tracking=0)

# === SUBHEAD ===
sub_y = head_start_y + 3 * line_height + 18
sub_font = SANS_REG(26)
sub_text = "I build AI agents and automations that actually ship."
draw.text((LEFT_X, sub_y), sub_text, font=sub_font, fill=INK_DIM)

# === BOTTOM-LEFT mono inscription ===
bottom_y = H - 64 - 18
bottom_font = MONO_REG(16)
bottom_text = "n8n + Claude  ·  Make + Zapier  ·  eleazarai.dev"
draw_text_kerned(draw, (LEFT_X, bottom_y), bottom_text, bottom_font, INK_QUIET, tracking=1.0)

# === RIGHT: code window ===
WIN_X = RIGHT_X
WIN_Y = 110
WIN_W = RIGHT_W
WIN_H = 380

# Window backdrop with 1px yellow-tinted border
# Drop shadow first
shadow = Image.new("RGBA", (WIN_W + 80, WIN_H + 80), (0, 0, 0, 0))
sd = ImageDraw.Draw(shadow)
sd.rounded_rectangle([40, 40, 40 + WIN_W, 40 + WIN_H], radius=12, fill=(0, 0, 0, 130))
shadow = shadow.filter(ImageFilter.GaussianBlur(radius=18))
img.paste(shadow, (WIN_X - 40, WIN_Y - 28), shadow)

# Window body
window_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
wd = ImageDraw.Draw(window_overlay)
wd.rounded_rectangle(
    [WIN_X, WIN_Y, WIN_X + WIN_W, WIN_Y + WIN_H],
    radius=12,
    fill=(*CARD, 235),
    outline=(*YELLOW, 70),
    width=1,
)
img.paste(window_overlay, (0, 0), window_overlay)

# Title bar
TITLE_H = 36
title_bar = Image.new("RGBA", (W, H), (0, 0, 0, 0))
tb = ImageDraw.Draw(title_bar)
tb.rounded_rectangle(
    [WIN_X, WIN_Y, WIN_X + WIN_W, WIN_Y + TITLE_H],
    radius=12,
    fill=(28, 26, 22, 235),
)
# Bottom-flat hack: overlay rectangle to flatten lower edge of title-bar rounding
tb.rectangle(
    [WIN_X, WIN_Y + TITLE_H - 12, WIN_X + WIN_W, WIN_Y + TITLE_H],
    fill=(28, 26, 22, 235),
)
# 1px divider
tb.line(
    [WIN_X, WIN_Y + TITLE_H, WIN_X + WIN_W, WIN_Y + TITLE_H],
    fill=BORDER,
    width=1,
)
img.paste(title_bar, (0, 0), title_bar)

draw = ImageDraw.Draw(img)

# Traffic lights
tl_y = WIN_Y + TITLE_H // 2
tl_x = WIN_X + 16
for i, color in enumerate([TRAFFIC_RED, TRAFFIC_AMBER, TRAFFIC_GREEN]):
    cx = tl_x + i * 18
    draw.ellipse([cx - 5, tl_y - 5, cx + 5, tl_y + 5], fill=color)

# File name
fname_font = MONO_REG(13)
fname = "ai-customer-agent.workflow.ts"
fname_w = fname_font.getbbox(fname)[2]
fname_x = WIN_X + (WIN_W - fname_w) // 2
draw.text((fname_x, tl_y - 9), fname, font=fname_font, fill=INK_DIM)

# Live indicator (right side)
live_x = WIN_X + WIN_W - 60
draw.ellipse([live_x, tl_y - 3, live_x + 6, tl_y + 3], fill=YELLOW)
live_font = MONO_BOLD(10)
draw.text((live_x + 12, tl_y - 7), "LIVE", font=live_font, fill=YELLOW)

# === CODE BODY ===
CODE_X = WIN_X + 22
CODE_Y = WIN_Y + TITLE_H + 22
code_font = MONO_REG(14)
code_bold = MONO_BOLD(14)
LINE_H = 22

def draw_line(line_no, segments, y):
    """segments: list of (text, color, font_or_None)"""
    # Line number
    ln_font = MONO_REG(11)
    ln_text = str(line_no)
    ln_w = ln_font.getbbox(ln_text)[2]
    draw.text((CODE_X - ln_w + 18, y + 4), ln_text, font=ln_font, fill=INK_QUIET)
    # Code
    x = CODE_X + 32
    for text, color, font in segments:
        f = font if font else code_font
        draw.text((x, y), text, font=f, fill=color)
        bbox = f.getbbox(text)
        x += (bbox[2] - bbox[0])

lines = [
    [("export const ", KEYWORD, code_font), ("agent", INK, code_font), (" = {", INK, code_font)],
    [("  name", INK, code_font), (": ", INK_DIM, code_font), ('"AI Customer Agent"', YELLOW, code_font), (",", INK_DIM, code_font)],
    [("  model", INK, code_font), (": ", INK_DIM, code_font), ("claude", FUNC, code_font), (".opus,", INK, code_font)],
    [("  tools", INK, code_font), (": [", INK_DIM, code_font)],
    [("    ", INK, code_font), ("crm", FUNC, code_font), (".lookup(email),", INK, code_font)],
    [("    ", INK, code_font), ("knowledge", FUNC, code_font), (".search(query),", INK, code_font)],
    [("    ", INK, code_font), ("ticket", FUNC, code_font), (".create({ priority }),", INK, code_font)],
    [("    ", INK, code_font), ("handoff", FUNC, code_font), (".toHuman(),", INK, code_font)],
    [("  ],", INK_DIM, code_font)],
    [("  memory", INK, code_font), (": ", INK_DIM, code_font), ("vector", FUNC, code_font), (".thread,", INK, code_font)],
    [("};", INK_DIM, code_font)],
]

for i, segs in enumerate(lines):
    draw_line(i + 1, segs, CODE_Y + i * LINE_H)

# Status bar at bottom of window
status_y = WIN_Y + WIN_H - 28
draw.line([WIN_X, status_y, WIN_X + WIN_W, status_y], fill=BORDER, width=1)
status_font = MONO_REG(11)
status_left = "@eleazar  ·  n8n + Claude + Pinecone"
draw.text((WIN_X + 16, status_y + 8), status_left, font=status_font, fill=INK_QUIET)
status_right = "~/agents"
sr_w = status_font.getbbox(status_right)[2]
draw.text((WIN_X + WIN_W - sr_w - 16, status_y + 8), status_right, font=status_font, fill=INK_QUIET)

# Save
img.save(OUT_PATH, "PNG", optimize=True)
print(f"Wrote {OUT_PATH}  ({W}x{H})")
