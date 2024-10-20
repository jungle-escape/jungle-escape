export default {
    VALID_PARAMS: ['server_no_context_takeover', 'client_no_context_takeover', 'server_max_window_bits', 'client_max_window_bits'],

    MIN_WINDOW_BITS: 9,
    MAX_WINDOW_BITS: 15,
    VALID_WINDOW_BITS: [8, 9, 10, 11, 12, 13, 14, 15],

    fetch: function(options, key, _default) {
        if (Object.hasOwnProperty.call(options, key)) return options[key];
        else return _default;
    },

    validateOptions: function(options, validKeys) {
        for (const key in options) {
            if (validKeys.indexOf(key) < 0) throw new Error('Unrecognized option: ' + key);
        }
    },

    validParams: function(params) {
        const keys = Object.keys(params);
        let i = keys.length;
        while (i--) {
            if (this.VALID_PARAMS.indexOf(keys[i]) < 0) return false;
            if (params[keys[i]] instanceof Array) return false;
        }
        if (Object.hasOwnProperty.call(params, 'server_no_context_takeover')) {
            if (params.server_no_context_takeover !== true) return false;
        }
        if (Object.hasOwnProperty.call(params, 'client_no_context_takeover')) {
            if (params.client_no_context_takeover !== true) return false;
        }
        if (Object.hasOwnProperty.call(params, 'server_max_window_bits')) {
            if (this.VALID_WINDOW_BITS.indexOf(params.server_max_window_bits) < 0) return false;
        }
        return true;
    }
};
