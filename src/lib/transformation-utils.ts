import {TransformationConfig} from "@/types";
import {
  AiMagic,
  BasicsTransform,
  Enhancements,
  Overlay,
} from "@/types/image-transformations";
import {
  Audio as VideoAudio,
  BasicsTransform as VideoBasics,
  Enhancements as VideoEnhancements,
  Overlay as VideoOverlay,
} from "@/types/video-transformations";

/* ---------------- BASICS ---------------- */

function basicsToParams(basics: BasicsTransform): string[] {
  const parts: string[] = [];
  if (basics.width) parts.push(`w-${basics.width}`);
  if (basics.height) parts.push(`h-${basics.height}`);
  if (basics.aspectRatio) parts.push(`ar-${basics.aspectRatio}`);
  if (basics.cropMode) parts.push(`c-${basics.cropMode}`);
  if (basics.focus) parts.push(`fo-${basics.focus}`);
  if (basics.zoom !== undefined) parts.push(`z-${basics.zoom}`);
  if (basics.dpr) parts.push(`dpr-${basics.dpr}`);
  if (basics.x !== undefined) parts.push(`x-${basics.x}`);
  if (basics.y !== undefined) parts.push(`y-${basics.y}`);
  if (basics.xc !== undefined) parts.push(`xc-${basics.xc}`);
  if (basics.yc !== undefined) parts.push(`yc-${basics.yc}`);
  return parts;
}

function videoBasicsToParams(b: VideoBasics): string[] {
  const p: string[] = [];
  if (b.width) p.push(`w-${b.width}`);
  if (b.height) p.push(`h-${b.height}`);
  if (b.aspectRatio) p.push(`ar-${b.aspectRatio}`);
  if (b.cropMode) p.push(`c-${b.cropMode}`);
  if (b.focus) p.push(`fo-${b.focus}`);
  if (b.rotate !== undefined) p.push(`rt-${b.rotate}`);
  if (b.border) p.push(`b-${b.border}`);
  if (b.radius !== undefined) p.push(`r-${b.radius}`);
  if (b.background) p.push(`bg-${b.background}`);
  return p;
}

/* ---------------- OVERLAYS ---------------- */

function overlaysToParams(overlays: Overlay[]): string[] {
  return overlays
    .map(o => {
      if (o.type === "text" && o.text) {
        const params: string[] = ["l-text"];

        const hasSpecialChars = /[^a-zA-Z0-9@\-_]/.test(o.text);
        if (hasSpecialChars) {
          const encoded = encodeURIComponent(btoa(o.text));
          params.push(`ie-${encoded}`);
        } else {
          params.push(`i-${o.text}`);
        }

        if (o.fontSize) params.push(`fs-${o.fontSize}`);
        if (o.fontFamily) params.push(`ff-${o.fontFamily}`);
        if (o.color) params.push(`co-${o.color}`);
        if (o.backgroundColor) params.push(`bg-${o.backgroundColor}`);
        if (o.padding) params.push(`pa-${o.padding}`);
        if (o.align) params.push(`ia-${o.align}`);

        const typography: string[] = [];
        if (o.bold) typography.push("b");
        if (o.italic) typography.push("i");
        if (o.strike) typography.push("strikethrough");
        if (typography.length > 0) params.push(`tg-${typography.join("_")}`);

        if (o.x !== undefined) params.push(`lx-${o.x}`);
        if (o.y !== undefined) params.push(`ly-${o.y}`);
        if (o.rotation !== undefined) params.push(`rt-${o.rotation}`);
        if (o.flip) params.push(`fl-${o.flip}`);
        params.push("l-end");
        return params.join(",");
      }

      if (o.type === "gradient" && o.fromColor && o.toColor) {
        const gradientParams = [`from-${o.fromColor}`, `to-${o.toColor}`];
        if (o.direction !== undefined)
          gradientParams.unshift(`ld-${o.direction}`);
        if (o.stopPoint !== undefined) gradientParams.push(`sp-${o.stopPoint}`);

        const params: string[] = [
          "l-image",
          "i-ik_canvas",
          `e-gradient-${gradientParams.join("_")}`,
        ];
        if (o.width) params.push(`w-${o.width}`);
        if (o.height) params.push(`h-${o.height}`);
        if (o.x !== undefined) params.push(`lx-${o.x}`);
        if (o.y !== undefined) params.push(`ly-${o.y}`);
        params.push("l-end");
        return params.join(",");
      }

      if (o.type === "solid") {
        const params: string[] = ["l-image", "i-ik_canvas"];
        if (o.color) params.push(`bg-${o.color}`);
        if (o.width) params.push(`w-${o.width}`);
        if (o.height) params.push(`h-${o.height}`);
        if (o.x !== undefined) params.push(`lx-${o.x}`);
        if (o.y !== undefined) params.push(`ly-${o.y}`);
        if (o.opacity !== undefined) params.push(`o-${o.opacity}`);
        if (o.radius) params.push(`r-${o.radius}`);
        params.push("l-end");
        return params.join(",");
      }

      return "";
    })
    .filter(Boolean);
}

function videoOverlaysToParams(overlays: VideoOverlay[]): string[] {
  const parts: string[] = [];
  overlays.forEach(o => {
    const p: string[] = [];
    if (o.type === "image") {
      p.push("l-image", `i-${o.src}`);
      if (o.width) p.push(`w-${o.width}`);
      if (o.height) p.push(`h-${o.height}`);
    } else if (o.type === "video") {
      p.push("l-video", `i-${o.src}`);
      if (o.width) p.push(`w-${o.width}`);
      if (o.height) p.push(`h-${o.height}`);
    } else if (o.type === "text") {
      p.push("l-text", `i-${encodeURIComponent(o.text)}`);
      if (o.fontSize) p.push(`fs-${o.fontSize}`);
      if (o.fontFamily) p.push(`ff-${o.fontFamily}`);
      if (o.color) p.push(`co-${o.color}`);
      if (o.padding) p.push(`pa-${o.padding}`);
    } else if (o.type === "solid") {
      p.push("l-image", "i-ik_canvas", `bg-${o.color}`);
      if (o.width) p.push(`w-${o.width}`);
      if (o.height) p.push(`h-${o.height}`);
      if (o.radius) p.push(`r-${o.radius}`);
    }
    // shared overlay controls
    if (o.x) p.push(`lx-${o.x}`);
    if (o.y) p.push(`ly-${o.y}`);
    if (o.startOffset) p.push(`lso-${o.startOffset}`);
    if (o.endOffset) p.push(`leo-${o.endOffset}`);
    if (o.duration) p.push(`ldu-${o.duration}`);
    p.push("l-end");
    parts.push(p.join(","));
  });
  return parts;
}

/* ---------------- ENHANCEMENTS ---------------- */

function enhancementsToParams(enh: Enhancements): string[] {
  const parts: string[] = [];
  if (enh.blur) parts.push(`bl-${enh.blur}`);
  if (enh.sharpen) parts.push(`e-sharpen-${enh.sharpen}`);
  if (enh.shadow) {
    const s = enh.shadow;
    const shadowParts: string[] = ["e-shadow"];
    if (s.blur !== undefined) shadowParts.push(`bl-${s.blur}`);
    if (s.saturation !== undefined) shadowParts.push(`st-${s.saturation}`);
    if (s.offsetX !== undefined) shadowParts.push(`x-${s.offsetX}`);
    if (s.offsetY !== undefined) shadowParts.push(`y-${s.offsetY}`);
    parts.push(shadowParts.join("_"));
  }
  if (enh.background) {
    const bg = enh.background;
    if (bg.type === "solid" && bg.color) parts.push(`bg-${bg.color}`);
    if (bg.type === "blurred") {
      const val = ["bg-blurred"];
      if (bg.blurIntensity) val.push(`${bg.blurIntensity}`);
      if (bg.brightness) val.push(`${bg.brightness}`);
      parts.push(val.join("_"));
    }
    if (bg.type === "dominant") parts.push("bg-dominant");
  }
  return parts;
}

function videoEnhancementsToParams(enh: VideoEnhancements): string[] {
  const parts: string[] = [];

  // trimming
  if (enh.trimming) {
    const t = enh.trimming;
    if (t.startOffset !== undefined) parts.push(`so-${t.startOffset}`);
    if (t.endOffset !== undefined) parts.push(`eo-${t.endOffset}`);
    if (t.duration !== undefined) parts.push(`du-${t.duration}`);
  }

  // thumbnail transforms
  if (enh.thumbnail) {
    const th = enh.thumbnail;
    if (th.time !== undefined) parts.push(`so-${th.time}`);
    if (th.width) parts.push(`w-${th.width}`);
    if (th.height) parts.push(`h-${th.height}`);
    if (th.aspectRatio) parts.push(`ar-${th.aspectRatio}`);
    if (th.cropMode) {
      if (["extract", "pad_resize"].includes(th.cropMode))
        parts.push(`cm-${th.cropMode}`);
      else parts.push(`c-${th.cropMode}`);
    }
    if (th.focus) parts.push(`fo-${th.focus}`);
    if (th.border) parts.push(`b-${th.border.width}_${th.border.color}`);
    if (th.bg) parts.push(`bg-${th.bg}`);
    if (th.radius !== undefined) parts.push(`r-${th.radius}`);
  }

  return parts;
}

/* ---------------- AI MAGIC ---------------- */

function aiToParams(ai: AiMagic): string[] {
  const parts: string[] = [];

  if (ai.background) {
    const bg = ai.background;
    if (bg.remove) {
      parts.push(bg.mode === "economy" ? "e-bgremove" : "e-removedotbg");
    }
    if (bg.changePrompt) {
      parts.push(`e-changebg-prompt-${bg.changePrompt}`);
    }
    if (bg.generativeFill) {
      const g = bg.generativeFill;
      let val = "bg-genfill";
      if (g.prompt) val += `-prompt-${g.prompt}`;
      parts.push(val);
      if (g.width) parts.push(`w-${g.width}`);
      if (g.height) parts.push(`h-${g.height}`);
      if (g.cropMode) parts.push(`cm-${g.cropMode}`);
    }
  }

  if (ai.editing) {
    const e = ai.editing;
    if (e.prompt) parts.push(`e-edit-prompt-${e.prompt}`);
    if (e.retouch) parts.push("e-retouch");
    if (e.upscale) parts.push("e-upscale");
  }

  if (ai.shadowLighting?.dropShadow) {
    const s = ai.shadowLighting.dropShadow;
    let val = "e-dropshadow";
    if (s.azimuth !== undefined) val += `-az-${s.azimuth}`;
    if (s.elevation !== undefined) val += `-el-${s.elevation}`;
    if (s.saturation !== undefined) val += `-st-${s.saturation}`;
    parts.push(val);
  }

  if (ai.generation) {
    const g = ai.generation;
    if (g.textPrompt) {
      parts.push(`ik-genimg-prompt-${g.textPrompt}`);
    }
    if (g.variation) parts.push("e-genvar");
  }

  if (ai.cropping) {
    const c = ai.cropping;
    if (c.type === "smart") parts.push("fo-auto");
    if (c.type === "face") parts.push("fo-face");
    if (c.type === "object" && c.objectName) parts.push(`fo-${c.objectName}`);
    if (c.zoom !== undefined) parts.push(`z-${c.zoom}`);
    if (c.width) parts.push(`w-${c.width}`);
    if (c.height) parts.push(`h-${c.height}`);
  }

  return parts;
}

/* ---------------- AUDIO ---------------- */
function audioToParams(a: VideoAudio): string[] {
  const p: string[] = [];
  if (a.mute) p.push("ac-none");
  if (a.extractAudio) p.push("vc-none");
  return p;
}

/* ---------------- MASTER BUILDER ---------------- */

export function buildTrString(config: TransformationConfig): string {
  const parts: string[] = [];

  if (config.type === "IMAGE") {
    if (config.basics) parts.push(...basicsToParams(config.basics));
    if (config.enhancements)
      parts.push(...enhancementsToParams(config.enhancements));
    if (config.ai) parts.push(...aiToParams(config.ai));
  }

  if (config.type === "VIDEO") {
    if (config.basics) parts.push(...videoBasicsToParams(config.basics));
    if (config.enhancements)
      parts.push(...videoEnhancementsToParams(config.enhancements));
    if (config.audio) parts.push(...audioToParams(config.audio));
  }

  let result = parts.filter(Boolean).join(",");

  if (config.overlays && config.overlays.length > 0) {
    const overlayParts = overlaysToParams(config.overlays);
    if (result) {
      result += `:${overlayParts.join(":")}`;
    } else {
      result = overlayParts.join(":");
    }
  }

  return result;
}

export function buildImageKitUrl(
  src: string,
  config: TransformationConfig
): string {
  const tr = buildTrString(config);
  if (!tr) return src;

  try {
    const url = new URL(src);

    const base = url.origin + url.pathname;
    const search = url.search
      ? `${url.search.replace(/^\?/, "")}&tr=${tr}`
      : `tr=${tr}`;

    return `${base}?${search}`;
  } catch {
    return src.includes("?") ? `${src}&tr=${tr}` : `${src}?tr=${tr}`;
  }
}
