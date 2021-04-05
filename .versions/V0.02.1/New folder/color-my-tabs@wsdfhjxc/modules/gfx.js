let EXPORTED_SYMBOLS = ["Gfx"];

Components.utils.import("resource://gre/modules/Services.jsm");
Components.utils.import("resource://gre/modules/Promise.jsm");

let Gfx = function(Prefs, RGBColor, RGBColorStore) {
    
    // returns modified brightness value required to create gradients for each tab CSS rule
    this.getBrightnessMod = function(hslColor, val, defaultColor) {        
        val /= 100;
        
        if (hslColor.l >= 0.75 || hslColor.l <= 0.25) {
            let brightnessFixes = Prefs.getValue("allowColorBrightnessFixes");
            
            // apply some dumb color brightness fixes only under certain conditions specified in prefs
            // for all colors or only for custom colors or only for default color
            if (brightnessFixes == 1
                || (brightnessFixes == 2 && defaultColor)
                || (brightnessFixes == 3 && !defaultColor)) {
                // this stupid mixing makes colors look better and less affected by brightness limits in prefs
                let d = Math.abs(hslColor.l - val);
                let n = d < val ? (val - d) * d * 2 : (d - val) * val * 2;
                
                val += hslColor.l >= 0.75 ? n : -n;
            }
        }
        
        return val;
    };

    // creates HTML background-image gradient with specific parameters
    this.createGradient = function(hslColor, fadingRange, fadingPower, appendDarkLine) {
        let mainColor = hslColor.getHTMLColor();
        let gradientBody = null;
        let direction = null;
        
        switch (Prefs.getValue("tabFadingStyle")) {
            case 1: {
                direction = "to bottom";
            } break;
            case 2: {
                direction = "to top";
            } break;
            case 3: {
                direction = "to right";
            } break;
            case 4: {
                direction = "to left";
            } break;
        }
        
        if (direction) {
            let fadingColor = Prefs.getValue("tabFadingColor");
            gradientBody = direction + "," + fadingColor + " " + fadingRange + "%,"
                         + mainColor + " " + (fadingPower * 5 + fadingRange) + "%";
        } else {
            gradientBody = mainColor + "," + mainColor;
        }
        
        appendDarkLine = appendDarkLine ? Prefs.getValue("drawSeparationLine") : false;
        
        // append dark line is used as a visual separator for inactive tab gradients at their bottoms
        let result = appendDarkLine ? "linear-gradient(to top,rgba(26,26,26,0.4) 1px,transparent 1px),"
                                    + "linear-gradient(" + gradientBody + ")"
                                    : "linear-gradient(" + gradientBody + ")";
        
        return result;
    };

    this.getImagePixelData = function(imgSrc) {
        let deferred = Promise.defer();
        
        let xhtmlNS = "http://www.w3.org/1999/xhtml";
        
        // create an img element inside most recent window
        let doc = Services.wm.getMostRecentWindow("navigator:browser").document;
        let img = doc.createElementNS(xhtmlNS, "img");
        
        img.onload = function() {
            let canvas = doc.createElementNS(xhtmlNS, "canvas");
            canvas.width = img.width < 32 ? img.width : 32;
            canvas.height = img.height < 32 ? img.height : 32;
            
            let ctx = canvas.getContext("2d");
            
            try {
                // https://bugzilla.mozilla.org/show_bug.cgi?id=574330
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // draw the image on canvas
                let imgPixelData = ctx.getImageData(0, 0, canvas.width, canvas.height); // get image pure pixels
                deferred.resolve(imgPixelData);
            } catch(e) {
                deferred.reject();
            }
        };
        
        img.onerror = function() {
            deferred.reject(); // image failed to load (should not happen)
        };
        
        img.src = imgSrc; // load img with providing its source to the img element
        
        return deferred.promise;
    };

    // this method contains a terrible algorithm of getting dominant RGB color of an image
    this.getImageRGBColor = function(imgPixelData) {
        let rgbColorEntries = []; // keep entries of already captured colors in the image
        let pixelArray = imgPixelData.data;
        let totalPixels = imgPixelData.width * imgPixelData.height;
        let pixelRGBAColor = new RGBColor(); // temporary RGB color extended by Alpha property
        
        let minColorAlpha = Prefs.getValue("minColorAlpha");
        let tooBrightRGBSet = Prefs.getValue("tooBrightRGBSet");
        let tooDarkRGBSet = Prefs.getValue("tooDarkRGBSet");
        let exceptionRGBPeakToPeak = Prefs.getValue("exceptionRGBPeakToPeak");
        let maxDiffBetweenSimilarColors = Prefs.getValue("maxDiffBetweenSimilarColors");
        
        for (let i = 0; i < totalPixels; i++) {
            let index = i * 4; // every pixel consists of four values - R, G, B and Alpha
            pixelRGBAColor.r = pixelArray[index];
            pixelRGBAColor.g = pixelArray[index + 1];
            pixelRGBAColor.b = pixelArray[index + 2];
            pixelRGBAColor.a = pixelArray[index + 3];
            
            // ignore this pixel if alpha is too low and color is not satisfying
            if (pixelRGBAColor.a < minColorAlpha ||
                (pixelRGBAColor.r > tooBrightRGBSet && pixelRGBAColor.g > tooBrightRGBSet && pixelRGBAColor.b > tooBrightRGBSet ||
                 ((pixelRGBAColor.r < tooDarkRGBSet && pixelRGBAColor.g < tooDarkRGBSet && pixelRGBAColor.b < tooDarkRGBSet) &&
                  Math.max(pixelRGBAColor.r, pixelRGBAColor.g, pixelRGBAColor.b) -
                  Math.min(pixelRGBAColor.r, pixelRGBAColor.g, pixelRGBAColor.b) < exceptionRGBPeakToPeak))) {
                continue;
             }
            
            let hit = false;
            
            for (let rgbColorEntry of rgbColorEntries) {
                // calc difference between iterated RGB color and current pixel color
                let diff = Math.abs(rgbColorEntry.rgbColor.r - pixelRGBAColor.r)
                         + Math.abs(rgbColorEntry.rgbColor.g - pixelRGBAColor.g)
                         + Math.abs(rgbColorEntry.rgbColor.b - pixelRGBAColor.b);
                         
                if (diff < maxDiffBetweenSimilarColors) {
                    // if difference is lower than that it means that this color is similar
                    rgbColorEntry.hits++; // bump its hit counter then
                    hit = true; // and set occurrence flag to true
                }
            }
            
            if (!hit) {
                // if there were no hits - none of existing colors was similar - add a new entry for this color
                let rgbColorEntry = {};
                rgbColorEntry.hits = 1;
                rgbColorEntry.rgbColor = new RGBColor(pixelRGBAColor.r, pixelRGBAColor.g, pixelRGBAColor.b);
                rgbColorEntries.push(rgbColorEntry);
            }
        }
        
        let mostHits = 0;
        let mostHitRGBColor = null;
        
        // find most hit color
        for (let rgbColorEntry of rgbColorEntries) {
            if (rgbColorEntry.hits > mostHits) {
                mostHits = rgbColorEntry.hits;
                mostHitRGBColor = rgbColorEntry.rgbColor;
            }
        }
        
        let imgRGBColor = new RGBColor();
        
        if (mostHitRGBColor) {
            imgRGBColor.loadFromRGBColor(mostHitRGBColor);
        }
        
        return imgRGBColor;
    };

    this.getFaviconRGBColor = function(faviconSrc) {
        let deferred = Promise.defer();
        
        // try to get RGB color for this source from cache
        let rgbColor = RGBColorStore.getItem(faviconSrc);
        
        if (rgbColor) {
            deferred.resolve(rgbColor);
        } else {
            // if there was no RGB color for this source in cache
            let gfx = this;
            this.getImagePixelData(faviconSrc).then(function(imgPixelData) {
                rgbColor = gfx.getImageRGBColor(imgPixelData); // get RGB color for image pixel data
                RGBColorStore.addItem(faviconSrc, rgbColor); // add this color to cache
                deferred.resolve(rgbColor);
            }, function() {
                deferred.reject();
            });
        }

        return deferred.promise;
    };
};