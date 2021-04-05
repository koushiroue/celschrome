let EXPORTED_SYMBOLS = ["TabHandlers"];

Components.utils.import("resource://gre/modules/Promise.jsm");

let TabHandlers = function(Prefs, HSLColor, RGBColor, CSSRules, Gfx, StyleSheets, IndicationBars) {
    this.TabHandler = function(tab) { 
        this.tab = tab;
        this.actualTabId = "cmtTab" + String.split(tab.linkedPanel, "panel").pop(); // extract only number from "panel123123123"
        tab.setAttribute("id", this.actualTabId); // set custom id for recognition purposes
        
        this.cssRules = []; // this will keep actual DOM CSS rule references
        this.deferredColorAssignment = null; // not null - color assignment is still being executed
        this.activeTabHSLColor = new HSLColor(); // this will be used to set color of an indication bar
        
        // initially let it be a default color
        let defaultColor = new RGBColor();
        defaultColor.loadFromHTMLColor(Prefs.getValue("tabDefaultColor"))
        this.activeTabHSLColor.loadFromRGBColor(defaultColor); 
        
        let tabHandler = this;
        
        // mutation observer reacts to changes of tab's attributes
        this.mutationObserver = new tab.ownerDocument.defaultView.MutationObserver(function(mutations) {
            tabHandler.refresh(); // refresh tab appearance when the image changes
        });
        
        this.mutationObserver.observe(tab, {
            attributes: true, // yes, interested in attributes
            attributeFilter: ["image"] // especially when image changes
        });
    };

    this.TabHandler.prototype.assignColor = function() {
        let deferred = Promise.defer();
        
        if (this.deferredColorAssignment) {
            this.deferredColorAssignment.reject(); // stop previous method deferred execution
        }
        
        this.deferredColorAssignment = deferred; // replace the reference with this method executed right now
        
        if (this.tab.hasAttribute("image")) {
            let faviconSrc = this.tab.getAttribute("image"); // if tab has an image then take its address
            let tabHandler = this;

            Gfx.getFaviconRGBColor(faviconSrc).then(function(rgbColor) {
                // when function successfully returns an RGB color
                tabHandler.deferredColorAssignment = null; // nullify as this method is finished
                deferred.resolve(rgbColor);
            }, function() {
                deferred.reject();
            });
        } else {
            let defaultColor = new RGBColor(); // if tab has no image then create a new RGB color
            defaultColor.loadFromHTMLColor(Prefs.getValue("tabDefaultColor")); // load default color value from prefs
            defaultColor["isDefaultColor"] = true; // append this property to mark that it's a default color
            
            this.deferredColorAssignment = null; // nullify as this method is finished
            deferred.resolve(defaultColor);
        }

        return deferred.promise;
    };

    this.TabHandler.prototype.applyStyling = function(rgbColor, defaultColor) {   
        let tabWindow = this.tab.ownerDocument.defaultView; // get a window related to this tab
        let styleSheet = StyleSheets.get(tabWindow); // get a stylesheet embedded into this window
        
        if (styleSheet) {
            // create tab related CSS rules
            let activeTabCSSRule = new CSSRules.ActiveTabCSSRule(this.actualTabId, rgbColor, defaultColor);
            let inactiveTabCSSRule = new CSSRules.InactiveTabCSSRule(this.actualTabId, rgbColor, defaultColor);
            let hoveredTabCSSRule = new CSSRules.HoveredTabCSSRule(this.actualTabId, rgbColor, defaultColor);
            
            this.activeTabHSLColor.loadFromHSLColor(activeTabCSSRule.hslColor); // keep active tab color for indication bar
            
            if (this.tab.selected) {
                IndicationBars.changeColorForWindow(tabWindow, activeTabCSSRule.hslColor.getHTMLColor()); // and change its color if tab is selected
            }
            
            if (this.cssRules.length > 0) {
                // if there is at least one applied CSS rule reference for this tab
                let cssRuleIndex = StyleSheets.getCSSRuleIndex(styleSheet, this.cssRules[0]); // get index of the first one
                
                if (cssRuleIndex) {
                    // CSS rules are always applied and inserted into the list consecutively
                    activeTabCSSRule.apply(styleSheet, cssRuleIndex);
                    inactiveTabCSSRule.apply(styleSheet, cssRuleIndex + 1); // just increase index to get next one
                    hoveredTabCSSRule.apply(styleSheet, cssRuleIndex + 2); // just increase index to get next one
                }
            } else {
                // if there are no CSS rules stored - they must be firstly applied and then their references stored
                this.cssRules.push(activeTabCSSRule.apply(styleSheet));
                this.cssRules.push(inactiveTabCSSRule.apply(styleSheet));
                this.cssRules.push(hoveredTabCSSRule.apply(styleSheet));
            }
        }
    };

    this.TabHandler.prototype.clearStyling = function() {
        let tabWindow = this.tab.ownerDocument.defaultView; // get related window for this tab
        let styleSheet = StyleSheets.get(tabWindow); // get related stylesheet to this window
        
        if (styleSheet) {
            // get only index of first rule
            let cssRuleIndex = StyleSheets.getCSSRuleIndex(styleSheet, this.cssRules[0]);
            
            if (cssRuleIndex) {
                for (let rule of this.cssRules) {
                    // after each deletion the list shifts but the index value stays the same
                    // and points to a next rule
                    styleSheet.deleteRule(cssRuleIndex);
                }
            }
        }
    };

    this.TabHandler.prototype.refresh = function() {
        let tabHandler = this;

        this.assignColor().then(function(rgbColor) {
            tabHandler.applyStyling(rgbColor, rgbColor.isDefaultColor);
        }, function() {
            return;
        });
    };

    this.TabHandler.prototype.clear = function() {
        // reverts any changes made for this tab
        this.tab.removeAttribute("id");
        this.mutationObserver.disconnect();
        this.mutationObserver = undefined;
        this.clearStyling();
    };
};