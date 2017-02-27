mkdir -p public/js
cp node_modules/axios/dist/axios.min.js public/js/
cp node_modules/vue/dist/vue.min.js public/js/
cp node_modules/vue-router/dist/vue-router.min.js public/js/
cp node_modules/swiper/dist/js/swiper.min.js public/js/
cp node_modules/ratchet/dist/js/ratchet.min.js public/js/

mkdir -p public/css
cp node_modules/swiper/dist/css/swiper.min.css public/css/
cp client/css/style.css public/css/
cp node_modules/ratchet/dist/css/ratchet.min.css public/css/

mkdir -p public/fonts/
cp node_modules/ratchet/dist/fonts/ratchicons.* public/fonts/

