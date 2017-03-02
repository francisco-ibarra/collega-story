module.exports = {
    entry: {
      "bundle" : "./client/js/app.js"
    },
    output: {
        path: "./public/js/",
        filename: "[name].js"
    },

    externals: {
        "vue": "Vue",
        "vue-router" : "VueRouter",
        "axios" : "axios",
        "swiper" : "Swiper",
        "moment" : "moment"
    }
};
