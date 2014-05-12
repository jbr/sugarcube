cat base.js \
    stats/*.js \
    geoms/*.js \
    scales/*.js \
    util/*.js \
> sugarcube.js && \

which uglifyjs > /dev/null && \
uglifyjs sugarcube.js \
         2> /dev/null \
         > sugarcube.min.js
