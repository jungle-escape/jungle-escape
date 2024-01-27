var TextInput = pc.createScript('textInput');

TextInput.attributes.add('placeholder', { type: 'string' });
TextInput.attributes.add('maxLength', { type: 'number', default: 30 });

TextInput.prototype.initialize = function() {
    this.focused = false;
    this.blocked = false;
    
    this.element = document.createElement('input');    
    this.element.type = 'text';
    this.element.maxLength = this.maxLength;
    this.element.value = this.entity.element.text.substr(0, this.maxLength);
    
    document.body.appendChild(this.element);
    
    document.body.addEventListener('mousedown', (e) => {
        this.element.blur();
    });

    document.body.addEventListener('touchstart', (e) => {
        this.element.blur();
    });

    this.entity.element.on('mousedown', (e) => {
        if (this.blocked)
            return;

        e.event.stopPropagation();
        this.focused = true;
        this.element.focus();
    });

    this.entity.element.on('touchstart', (e) => {
        if (this.blocked)
            return;
        
        e.event.stopPropagation();
        this.focused = true;
        this.element.focus();
    });
    
    this.app.mouse.on(pc.EVENT_MOUSEUP, () => {
        this.focused = false;
        this.entity.fire('input:change', this.element.value);
    }, this);
    
    this.element.addEventListener('input', (e) => {
        if (this.blocked)
            return;
        
        this.entity.element.text = this.element.value;
    });
    
    this.element.addEventListener('keyup', (e) => {
        if (this.blocked)
            return;
        
        if (e.keyCode === 13) {
            this.inputConfirm();
        }
    });
    
    this.element.addEventListener('blur', () => {
        if (!this.focused || this.blocked)
            return;
        
        this.element.focus();
    });
    
    this.entity.on('input:set', (value) => {
        this.entity.element.text = value;
        this.element.value = value;
    });
    
    this.entity.on('input:block', () => {
        this.blocked = true;
    });
    
    this.entity.on('input:unblock', () => {
        this.blocked = false; 
    });
    
    this.entity.on('destroy', () => {
        this.element.removeEventListener('input');
        this.element.removeEventListener('blur');
        this.app.mouse.off(pc.EVENT_MOUSEUP, this);
    });
};

TextInput.prototype.inputConfirm = function() {
    this.focused = false;
    this.element.blur();
    this.entity.fire('input:confirm', this.element.value);
};