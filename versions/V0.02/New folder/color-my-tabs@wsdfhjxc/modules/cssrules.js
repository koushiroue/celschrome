let EXPORTED_SYMBOLS = ["CSSRules"];

Components.utils.import("resource://gre/modules/Services.jsm");

let CSSRules = function(CSSRule, HSLColor, Prefs, Gfx) {
    this.ActiveTabCSSRule = function(tabId, rgbColor, defaultColor) {
        CSSRule.call(this);
        
        let hslColor = new HSLColor();
        hslColor.loadFromRGBColor(rgbColor);
        
        hslColor.s = hslColor.s * (Prefs.getValue("activeTabSaturation") / 50);
        hslColor.l = Gfx.getBrightnessMod(hslColor, Prefs.getValue("activeTabBrightness"), defaultColor);
        
        this.hslColor = hslColor; // binding hslColor to this object as it'll be used by other module
        
        let gradient = Gfx.createGradient(hslColor, Prefs.getValue("activeTabFadingRange"),
                                                    Prefs.getValue("activeTabFadingPower"));
        
        // actual CSS rule data
        this.selectors = "#" + tabId + "[selected]";
        this.style["background-image"] = gradient + "!important";
        this.style["opacity"] = Prefs.getValue("activeTabOpacity") / 100;
        this.style["color"] = Prefs.getValue("activeTabFontColor");
        
        if (Prefs.getValue("boldActiveTabTitle")) {
            this.style["font-weight"] = "bold";
        }
        
        if (Prefs.getValue("showTabTitleShadow")) {
            this.style["text-shadow"] = "0px 0px 4px " + Prefs.getValue("activeTabFontShadowColor");
        }
    };

    this.InactiveTabCSSRule = function(tabId, rgbColor, defaultColor) {
        CSSRule.call(this);
        
        let hslColor = new HSLColor();
        hslColor.loadFromRGBColor(rgbColor);
        
        hslColor.s = hslColor.s * (Prefs.getValue("inactiveTabSaturation") / 50);
        hslColor.l = Gfx.getBrightnessMod(hslColor, Prefs.getValue("inactiveTabBrightness"), defaultColor);
        
        let gradient = Gfx.createGradient(hslColor, Prefs.getValue("inactiveTabFadingRange"),
                                                    Prefs.getValue("inactiveTabFadingPower"), true);
        
        // actual CSS rule data
        this.selectors = "#" + tabId;
        this.style["background-image"] = gradient + "!important";
        this.style["opacity"] = Prefs.getValue("inactiveTabOpacity") / 100;
        this.style["color"] = Prefs.getValue("inactiveTabFontColor");
        
        if (Prefs.getValue("showTabTitleShadow")) {
            this.style["text-shadow"] = "0px 0px 4px " + Prefs.getValue("inactiveTabFontShadowColor");
        }
    };

    this.HoveredTabCSSRule = function(tabId, rgbColor, defaultColor) {
        CSSRule.call(this);
        
        let hslColor = new HSLColor();
        hslColor.loadFromRGBColor(rgbColor);
        
        hslColor.s = hslColor.s * (Prefs.getValue("hoveredTabSaturation") / 50);
        hslColor.l = Gfx.getBrightnessMod(hslColor, Prefs.getValue("hoveredTabBrightness"), defaultColor);
        
        let gradient = Gfx.createGradient(hslColor, Prefs.getValue("hoveredTabFadingRange"),
                                                    Prefs.getValue("hoveredTabFadingPower"), true);
        
        // actual CSS rule data
        this.selectors = "#" + tabId + ":not([selected]):hover";
        this.style["background-image"] = gradient + "!important";
        this.style["opacity"] = Prefs.getValue("hoveredTabOpacity") / 100;
        this.style["color"] = Prefs.getValue("hoveredTabFontColor");
        
        if (Prefs.getValue("showTabTitleShadow")) {
            this.style["text-shadow"] = "0px 0px 4px " + Prefs.getValue("hoveredTabFontShadowColor");
        }
    };
    
    this.PinnedNotifiedTabCSSRule = function() {
        CSSRule.call(this);
        
        // actual CSS rule data
        this.selectors = ".tabbrowser-tab[pinned][titlechanged]";
        this.style["box-shadow"] = "0px 5px 10px 2px rgba(255, 255, 200, 0.9) inset";
    };

    this.IndicationBarCSSRule = function(indBarId) {
        CSSRule.call(this);

        // actual CSS rule data
        this.selectors = "#navigator-toolbox[tabsontop='false']>#" + indBarId;
        this.style["height"] = Prefs.getValue("indicationBarSize") + "px";
        this.style["-moz-box-ordinal-group"] = "101";
        
        let selectedSkin = Services.prefs.getBranch("general.skins.").getCharPref("selectedSkin");
        
        switch (selectedSkin) {
            case "mf3": {
                this.style["margin-top"] = "-3px";
            } break;
            case "kempelton-reloaded": {
                this.style["margin-top"] = "-2px";
            } break;
            case "aeromoon": {
                this.style["margin-top"] = "-2px";
            } break;
            case "littlemoon": {
                this.style["margin-top"] = "-2px";
            } break;
            case "pastmodern-r": {
                this.style["margin-top"] = "-7px";
            } break;
            case "reinheit": {
                this.style["margin-top"] = "-3px";
            } break;
            case "darkness": {
                this.style["margin-top"] = "-1px";
            } break;
            case "f2tm": {
                this.style["margin-top"] = "-5px";
            } break;
            case "micromoon": {
                this.style["margin-top"] = "-2px";
            } break;
            case "nauticalia": {
                this.style["margin-top"] = "-5px";
            } break;
            case "noiamoon": {
                this.style["margin-top"] = "-2px";
            } break;
            case "phoenity-rebirth": {
                this.style["margin-top"] = "-2px";
            } break;
        }
    };
    
    this.IndicationBarTabsOnTopCSSRule = function(indBarId) {
        CSSRule.call(this);
        
        // actual CSS rule data
        this.selectors = "#navigator-toolbox[tabsontop='true']>#" + indBarId;
        this.style["height"] = Prefs.getValue("indicationBarSize") + "px";
        this.style["-moz-box-ordinal-group"] = "49";
        
        let selectedSkin = Services.prefs.getBranch("general.skins.").getCharPref("selectedSkin");
        
        switch (selectedSkin) {
            case "littlemoon": {
                this.style["-moz-box-ordinal-group"] = "30";
            } break;
            case "pastmodern-r": {
                this.style["margin-top"] = "-7px";
            } break;
            case "reinheit": {
                this.style["margin-top"] = "-3px";
            } break;
            case "darkness": {
                this.style["margin-top"] = "-1px";
            } break;
            case "f2tm": {
                this.style["margin-top"] = "-2px";
            } break;
            case "micromoon": {
                this.style["-moz-box-ordinal-group"] = "40";
            } break;
            case "nauticalia": {
                this.style["-moz-box-ordinal-group"] = "40";
            } break;
            case "noiamoon": {
                this.style["margin-top"] = "-1px";
            } break;
        }
    };

    this.ActiveTabCSSRule.prototype = new CSSRule();
    this.InactiveTabCSSRule.prototype = new CSSRule();
    this.HoveredTabCSSRule.prototype = new CSSRule();
    this.PinnedNotifiedTabCSSRule.prototype = new CSSRule();
    this.IndicationBarCSSRule.prototype = new CSSRule();
    this.IndicationBarTabsOnTopCSSRule.prototype = new CSSRule();
};