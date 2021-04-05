let EXPORTED_SYMBOLS = ["RGBColor"];

function RGBColor(r, g, b) {
    if (r == undefined || g == undefined || b == undefined) {
        this.load(0, 0, 0);
    } else {
        this.load(r, g, b);
    }
}

RGBColor.prototype.load = function(r, g, b) {
    this.r = Math.min(r, 255);
    this.g = Math.min(g, 255);
    this.b = Math.min(b, 255);
};

RGBColor.prototype.loadFromRGBColor = function(rgbColor) {
    this.load(rgbColor.r, rgbColor.g, rgbColor.b);
};

RGBColor.prototype.loadFromHSLColor = function(hslColor) {
    // code adapted from http://www.rapidtables.com/convert/color/hsl-to-rgb.htm
    let c = (1 - Math.abs(2 * hslColor.l - 1)) * hslColor.s;
    let x = c * (1 - Math.abs((hslColor.h / 60) % 2 - 1));
    let m = hslColor.l - c / 2;
    let r, g, b;
    
    if (hslColor.h >= 0 && hslColor.h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (hslColor.h >= 60 && hslColor.h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (hslColor.h >= 120 && hslColor.h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (hslColor.h >= 180 && hslColor.h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (hslColor.h >= 240 && hslColor.h < 300) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }
    
    r += m;
    g += m;
    b += m;
    
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    
    this.load(r, g, b);
};

RGBColor.prototype.loadFromHTMLColor = function(htmlColor) {
    let regexMatches = null;
    let r = 0, g = 0, b = 0;
    
    if (regexMatches = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(htmlColor)) {
        r = parseInt(regexMatches[1], 16);
        g = parseInt(regexMatches[2], 16);
        b = parseInt(regexMatches[3], 16);
    } else if (regexMatches = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i.exec(htmlColor)) {
        r = regexMatches[1];
        g = regexMatches[2];
        b = regexMatches[3];
    }
    
    this.load(r, g, b);
};

RGBColor.prototype.getHTMLColor = function() {
    return "rgb(" + this.r + "," + this.g + "," + this.b + ")";
};