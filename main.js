function RingArray(object, position) {
    this.array = RingArray.compact(object);
    this.setPosition(position);
}

RingArray.toInt32 = function (number) {
    return number >> 0;
};

RingArray.toUint32 = function (number) {
    return number >>> 0;
};

RingArray.isOdd = function (number) {
    return number % 2 === 1;
};

RingArray.indexWrap = function (index, length) {
    index = RingArray.toInt32(index);
    length = RingArray.toUint32(length);
    if (index < 0 && RingArray.isOdd(length)) {
        index -= 1;
    }

    return RingArray.toUint32(index) % length;
};

RingArray.compact = (function (filter) {
    let compact;

    if (typeof filter === 'function') {
        compact = function (object) {
            return filter.call(object, function (element) {
                return element;
            });
        };
    } else {
        compact = function (object) {
            object = Object(object);
            let array = [],
                length = RingArray.toUint32(object.length),
                index;

            for (index = 0; index < length; index += 1) {
                if (index in object) {
                    array.push(object[index]);
                }
            }

            return array;
        };
    }

    return compact;
}(Array.prototype.filter));

RingArray.prototype = {
    setPosition: function (position) {
        this.position = RingArray.indexWrap(position, this.array.length);

        return this;
    },

    setToStart: function () {
        return this.setPosition(0);
    },

    setToEnd: function () {
        return this.setPosition(this.array.length - 1);
    },

    setRandom: function () {
        return this.setPosition(Math.floor(Math.random() * this.array.length));
    },

    increment: function (amount) {
        return this.setPosition(this.position + (RingArray.toInt32(amount) || 1));
    },

    previousElement: function () {
        return this.array[RingArray.indexWrap(this.position - 1, this.array.length)];
    },

    currentElement: function () {
        return this.array[this.position];
    },

    nextElement: function () {
        return this.array[RingArray.indexWrap(this.position + 1, this.array.length)];
    }
};

let utubeFrame = document.getElementById('utubeFrame'),
    utubeIds = ["JhXK1c3X8hg", "CcsUYu0PVxY", "dE_XVl7fwBQ", "iIwxR6kjTfA", "USe6s2kfuWk"],
    baseURL = 'http://www.youtube.com/embed/',
    utubeRing = new RingArray(utubeIds);

function update() {
    utubeFrame.src = baseURL + utubeRing.currentElement();
}

document.getElementById('random').addEventListener('click', function () {
    let currentElement = utubeRing.currentElement();

    do {
        utubeRing.setRandom();
    } while (utubeRing.currentElement() === currentElement);
    update();
});

document.getElementById("previous").addEventListener("click", function () {
    utubeRing.increment(-1);
    update();
}, false);

document.getElementById("next").addEventListener("click", function () {
    utubeRing.increment(1);
    update();
}, false);

update();