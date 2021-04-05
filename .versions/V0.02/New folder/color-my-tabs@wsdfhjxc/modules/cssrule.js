let EXPORTED_SYMBOLS = ["CSSRule"];

function CSSRule() {
    this.selectors = null; // this must be a string containing selectors
    this.style = {}; // this object must contain actual 1:1 CSS properties
}

CSSRule.prototype.apply = function(styleSheet, ruleIndex) {  
    if (this.selectors) {
        let rule = this.selectors + "{";
        let ruleBody = "";
        
        for (let attr in this.style) {
            if (this.style[attr]) {
                ruleBody += attr + ":" + this.style[attr] + ";";
            }
        }
        
        rule += ruleBody + "}";
        
        if (ruleIndex != undefined) {
            // ruleIndex is specified - it requires just a modification
            styleSheet.cssRules[ruleIndex].style.cssText = ruleBody;
        } else {
            // ruleIndex isn't specified - it requires to be created as a new rule
            styleSheet.insertRule(rule, styleSheet.cssRules.length);
            
            // return its reference to keep it - it'll be used for lookup
            return styleSheet.cssRules[styleSheet.cssRules.length - 1]; 
        }
    }
};