let EXPORTED_SYMBOLS = ["Windows"];

Components.utils.import("resource://gre/modules/Services.jsm");

let Windows = function(StyleSheets, IndicationBars, Tabs) {
    this.windowListener = {
        onOpenWindow: function(nsIObj) {
            let domWindow = nsIObj.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                  .getInterface(Components.interfaces.nsIDOMWindow);
            
            // window is useful only after DOM has been loaded so we must put proper methods
            // in a temporary one-time load event listener
            domWindow.addEventListener("load", function() {
                domWindow.removeEventListener("load", arguments.callee, false);
                domWindow.setTimeout(function() {
                    
                    // only it this is a browser window, not some kind of alert etc.
                    if (domWindow.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
                        StyleSheets.init(domWindow);
                        IndicationBars.init(domWindow);
                        Tabs.init(domWindow);
                    }
                }, 0, domWindow);
            }, false);
        },
        
        onCloseWindow: function(nsIObj) {
            let domWindow = nsIObj.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                                  .getInterface(Components.interfaces.nsIDOMWindow);
            
            // only it this is a browser window, not some kind of alert etc.
            if (domWindow.document.documentElement.getAttribute("windowtype") === "navigator:browser") {
                StyleSheets.clear(domWindow);
                IndicationBars.clear(domWindow);
                Tabs.clear(domWindow);
            }
        }
    };

    this.init = function() {          
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            
            StyleSheets.init(window);
            IndicationBars.init(window);
            Tabs.init(window);
        }
        
        Services.wm.addListener(this.windowListener);
    };
    
    this.clear = function() {
        Services.wm.removeListener(this.windowListener);
        
        let windowsEnumerator = Services.wm.getEnumerator("navigator:browser");
        
        while (windowsEnumerator.hasMoreElements()) {
            let window = windowsEnumerator.getNext().QueryInterface(Components.interfaces.nsIDOMWindow);
            
            StyleSheets.clear(window);
            IndicationBars.clear(window);
            Tabs.clear(window);
        }
    };
    
    this.onPrefsApply = function() {
        this.clear();
        this.init();
    };
};