let EXPORTED_SYMBOLS = ["StyleSheets"];

let StyleSheets = function(CSSRules) {
    this.styleSheetId = "cmtStyle";
    
    this.init = function(window) {
        let document = window.document;
        let style = document.createElementNS("http://www.w3.org/1999/xhtml", "style");
        
        style.setAttribute("type", "text/css");
        style.setAttribute("id", this.styleSheetId);
        
        document.documentElement.appendChild(style);
        
        // one-time general rule applied here as a matter of convenience
        let pinnedNotifiedTabCSSRule = new CSSRules.PinnedNotifiedTabCSSRule();
        pinnedNotifiedTabCSSRule.apply(style.sheet);
    };
    
    this.clear = function(window) {
        let style = window.document.getElementById(this.styleSheetId);
        
        if (style) {
            window.document.documentElement.removeChild(style);
        }
    };
    
    this.get = function(window) {
        let style = window.document.getElementById(this.styleSheetId);
        
        if (style) {
            return style.sheet;
        } else {
            return null;
        }
    };
    
    this.getCSSRuleIndex = function(styleSheet, cssRule) {
        for (let i = 0; i < styleSheet.cssRules.length; i++) {
            if (styleSheet.cssRules[i] == cssRule) {
                return i;
            }
        }
        
        return null;
    };
};