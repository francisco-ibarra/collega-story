module.exports = {
    entry: {
      "bundle" : "./src/app.js"
    },
    output: {
        path: "./public/js/",
        filename: "[name].js"
    },

    externals: {
        "vue": "Vue",
        "vue-router" : "VueRouter",
        "axios" : "axios",
        "swiper" : "Swiper"
    }
};
