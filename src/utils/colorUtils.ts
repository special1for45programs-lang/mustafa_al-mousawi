export function hsvToHex(h: number, s: number, v: number) {
    h = h || 0; s = s || 0; v = v || 0;
    s /= 100; v /= 100;
    let r = 0, g = 0, b = 0;
    let i = Math.floor(h / 60);
    let f = h / 60 - i;
    let p = v * (1 - s);
    let q = v * (1 - f * s);
    let t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    const toHex = (n: number) => {
        const hex = Math.round(n * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function hexToHSV(hex: string) {
    let r = 0, g = 0, b = 0;
    hex = hex.replace('#', '');
    if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
    } else {
        return { h: 210, s: 100, v: 100 };
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, v = max;
    const d = max - min;
    s = max === 0 ? 0 : d / max;
    if (max === min) h = 0;
    else {
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: (h * 360) || 0, s: (s * 100) || 0, v: (v * 100) || 0 };
}

export function isValidHex(hex: string) { return /^#?([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex); }
export function formatHex(hex: string) { if (!hex.startsWith('#')) hex = '#' + hex; return hex.toUpperCase(); }

export function hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export function mulberry32(a: number) {
    return function() {
      let t = a += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export interface GeneratedPalette {
    id: string;
    label: string;
    desc: string;
    colors: string[];
}

export function generatePalettesFromKeyword(keyword: string): GeneratedPalette[] {
    const seed = hashCode(keyword.toLowerCase().trim() || "default");
    const rand = mulberry32(seed);
    const baseH = Math.floor(rand() * 360);
    const wrapH = (h: number) => (h % 360 + 360) % 360;

    return [
        {
            id: 'monochromatic',
            label: 'تناغم أحادي',
            desc: 'درجات مختلفة من نفس اللون، مثالي للتصاميم البسيطة والنظيفة.',
            colors: [
                hsvToHex(baseH, 90, 30),
                hsvToHex(baseH, 80, 50),
                hsvToHex(baseH, 70, 70),
                hsvToHex(baseH, 50, 90),
                hsvToHex(baseH, 20, 95)
            ]
        },
        {
            id: 'analogous',
            label: 'تناغم متماثل',
            desc: 'ألوان متجاورة في العجلة تعطي إحساساً بالهدوء والتوافق الطبيعي.',
            colors: [
                hsvToHex(wrapH(baseH - 30), 80, 80),
                hsvToHex(wrapH(baseH - 15), 85, 85),
                hsvToHex(baseH, 90, 90),
                hsvToHex(wrapH(baseH + 15), 85, 85),
                hsvToHex(wrapH(baseH + 30), 80, 80)
            ]
        },
        {
            id: 'complementary',
            label: 'تناغم مكمل',
            desc: 'ألوان متقابلة توفر تبايناً عالياً وتلفت الانتباه بقوة.',
            colors: [
                hsvToHex(baseH, 90, 80),
                hsvToHex(baseH, 50, 95),
                hsvToHex(wrapH(baseH + 180), 10, 95),
                hsvToHex(wrapH(baseH + 180), 50, 95),
                hsvToHex(wrapH(baseH + 180), 90, 80)
            ]
        },
        {
            id: 'split-complementary',
            label: 'مكمل منشطر',
            desc: 'تباين قوي ولكن بحدة أقل من المكمل المباشر، متوازن وأنيق.',
            colors: [
                hsvToHex(baseH, 85, 85),
                hsvToHex(baseH, 40, 95),
                hsvToHex(wrapH(baseH + 150), 70, 85),
                hsvToHex(wrapH(baseH + 180), 15, 95),
                hsvToHex(wrapH(baseH + 210), 70, 85)
            ]
        },
        {
            id: 'triadic',
            label: 'تناغم ثلاثي',
            desc: 'ألوان موزعة بانتظام توفر حيوية ونشاطاً استثنائياً.',
            colors: [
                hsvToHex(baseH, 85, 85),
                hsvToHex(baseH, 40, 95),
                hsvToHex(wrapH(baseH + 120), 85, 85),
                hsvToHex(wrapH(baseH + 240), 40, 95),
                hsvToHex(wrapH(baseH + 240), 85, 85)
            ]
        },
        {
            id: 'warm',
            label: 'درجات دافئة',
            desc: 'مشتقة نحو الألوان الدافئة لتعطي إحساساً بالطاقة والترحيب.',
            colors: [
                hsvToHex(wrapH(baseH), 70, 40),
                hsvToHex(15, 80, 85),
                hsvToHex(35, 75, 95),
                hsvToHex(50, 60, 95),
                hsvToHex(wrapH(baseH), 20, 95)
            ]
        },
        {
            id: 'cool',
            label: 'درجات باردة',
            desc: 'مشتقة نحو الألوان الباردة لتعطي إحساساً بالثقة والاحترافية.',
            colors: [
                hsvToHex(wrapH(baseH), 80, 30),
                hsvToHex(200, 75, 80),
                hsvToHex(220, 65, 90), 
                hsvToHex(260, 55, 95), 
                hsvToHex(wrapH(baseH), 15, 95)
            ]
        },
        {
            id: 'pastel',
            label: 'ألوان باستيل',
            desc: 'ألوان ناعمة ومشرقة توحي باللطف والمرح.',
            colors: [
                hsvToHex(baseH, 35, 100),
                hsvToHex(wrapH(baseH + 40), 30, 100),
                hsvToHex(wrapH(baseH + 80), 30, 100),
                hsvToHex(wrapH(baseH + 120), 30, 100),
                hsvToHex(wrapH(baseH + 160), 35, 100)
            ]
        },
        {
            id: 'deep',
            label: 'ألوان عميقة وفاخرة',
            desc: 'ألوان داكنة وغنية تعكس الفخامة والقوة.',
            colors: [
                hsvToHex(baseH, 90, 25),
                hsvToHex(wrapH(baseH + 30), 85, 30),
                hsvToHex(wrapH(baseH + 60), 80, 40),
                hsvToHex(wrapH(baseH + 120), 75, 35),
                hsvToHex(baseH, 30, 85)
            ]
        },
        {
            id: 'high-contrast',
            label: 'تباين حاد',
            desc: 'ألوان قوية لعلامة تجارية جريئة وعصرية.',
            colors: [
                '#0A0A0A',
                '#FFFFFF',
                hsvToHex(baseH, 100, 100),
                hsvToHex(wrapH(baseH + 180), 100, 100),
                '#4A4A4A'
            ]
        }
    ];
}
