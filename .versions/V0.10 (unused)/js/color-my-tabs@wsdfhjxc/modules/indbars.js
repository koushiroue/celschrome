let EXPORTED_SYMBOLS = ["IndicationBars"];

let IndicationBars = function(StyleSheets, CSSRules, Prefs) {
    this.indBarId = "cmtIndBar";
    
    this.init = function(window) {
        if (Prefs.getValue("showIndicationBar")) {
            let navToolbox = window.document.getElementById("navigator-toolbox");
            let tabContainerVisible = !window.document.getElementById("TabsToolbar").collapsed;
            
            if (navToolbox && tabContainerVisible) {
                let xulNS = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
                let indBar = window.document.createElementNS(xulNS, "dummy");
                
                indBar.setAttribute("id", this.indBarId);
                navToolbox.insertBefore(indBar, navToolbox.firstChild);
                
                let styleSheet = StyleSheets.get(window);
                
                let indBarCSSRule = new CSSRules.IndicationBarCSSRule(this.indBarId);
                indBarCSSRule.apply(styleSheet);
                
                let indBarTabsOnTopCSSRule = new CSSRules.IndicationBarTabsOnTopCSSRule(this.indBarId);
                indBarTabsOnTopCSSRule.apply(styleSheet);
            }
        }
    };
    
    this.clear = function(window) {
        let indBar = window.document.getElementById(this.indBarId);
        
        if (indBar) {
            indBar.parentNode.removeChild(indBar);
        }
    };
    
    this.changeColorForWindow = function(window, htmlColor) {
        if (Prefs.getValue("showIndicationBar")) {
            let indBar = window.document.getElementById(this.indBarId);
            
            if (indBar) {
                indBar.style.setProperty("background-color", htmlColor);
            }
        }
    };
};