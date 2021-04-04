let EXPORTED_SYMBOLS = ["Store"];

function Store(maxItems) {
    this.items = {};
    this.itemsCounter = 0;
    this.maxItems = maxItems;
}

// add item and if limit is reached remove some item and overwrite it
Store.prototype.addItem = function(key, item) {
    if (!this.maxItems || this.itemsCounter < this.maxItems) {
        this.items[key] = item;
    } else {
        this.removeItem();
        this.items[0] = item;
    }
    
    this.itemsCounter++;
};

// processItem is a function called before item removal
Store.prototype.removeItem = function(key, processItem) {
    if (key && this.items[key]) {
        if (processItem) {
            processItem(this.items[key]);
        }
        
        this.items[key] = undefined;
    } else {
        this.items[0] = undefined;
    }
    
    this.itemsCounter--;
};

// processItem is a function called before each item removal
Store.prototype.removeAllItems = function(processItem) {
    for (let item in this.items) {
        if (this.items[item]) {
            if (processItem) {
                processItem(this.items[item]);
            }
            
            this.items[item] = undefined;
        }
    }
    
    this.itemsCounter = 0;
};

// processItem is a function called for every item
Store.prototype.processAllItems = function(processItem) {
    if (processItem) {
        for (let item in this.items) {
            if (this.items[item]) {
                processItem(this.items[item]);
            }
        }
    }
};
    
Store.prototype.getItem = function(key) {
    return this.items[key];
};