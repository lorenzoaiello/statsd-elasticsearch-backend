const counters = function (key, value, ts, bucket) {
    if (value) {
        var listKeys = key.split('.');
        var act = listKeys.slice(3, listKeys.length).join('.');
        bucket.push({
            "ns": listKeys[0] || '',
            "grp":listKeys[1] || '',
            "tgt":listKeys[2] || '',
            "act":act || '',
            "val": value,
            "@timestamp": ts
        });
        return 1;
    }

    return 0;
};

const timers = function (key, series, ts, bucket) {
    let counter = 0;
    var listKeys = key.split('.');
    var act = listKeys.slice(3, listKeys.length).join('.');
    for (let keyTimer in series) {
        if (series[keyTimer]) {
            bucket.push({
                "ns": listKeys[0] || '',
                "grp":listKeys[1] || '',
                "tgt":listKeys[2] || '',
                "act":act || '',
                "val": series[keyTimer],
                "@timestamp": ts
            });
            counter++;
        }
    }
    return counter;
};

const timer_data = function (key, value, ts, bucket) {
    var listKeys = key.split('.');
    var act = listKeys.slice(3, listKeys.length).join('.');
    value["@timestamp"] = ts;
    value["ns"]  = listKeys[0] || '';
    value["grp"] = listKeys[1] || '';
    value["tgt"] = listKeys[2] || '';
    value["act"] = act || '';
    let shouldPush = false;
    if (value['histogram']) {
        for (var keyH in value['histogram']) {
            shouldPush = shouldPush || !!value['histogram'][keyH];
            value[keyH] = value['histogram'][keyH];
        }
        delete value['histogram'];
    }

    if (shouldPush) {
        bucket.push(value);
    }
};

exports.counters = counters;
exports.timers = timers;
exports.timer_data = timer_data;
exports.gauges = counters;
