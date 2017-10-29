const i18n = require('LanguageData');

cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {

        i18n.init("zh");

        this.label.string = i18n.t("label.close");
    },

    // called every frame
    update: function (dt) {

    },
});
