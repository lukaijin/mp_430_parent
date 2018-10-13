function _typeof(data) {
   return Object.prototype.toString.call(data).slice(8, -1).toLowerCase();
}

function encode(val) {
   return encodeURIComponent(val).replace(/%40/gi, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',').replace(/%20/g, '+').replace(/%5B/gi, '[').replace(/%5D/gi, ']');
}

function formatParams(data) {
   var str = "";
   var first = true;
   var that = this;
   if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) != "object") {
       return data;
   }
   function _encode(sub, path) {
       var type = _typeof(sub);
       if (type == "array") {
           sub.forEach(function (e, i) {
               _encode(e, path + "%5B%5D");
           });
       } else if (type == "object") {
           for (var key in sub) {
               if (path) {
                   _encode(sub[key], path + "%5B" + encode(key) + "%5D");
               } else {
                   _encode(sub[key], encode(key));
               }
           }
       } else {
           if (!first) {
               str += "&";
           }
           first = false;
           str += path + "=" + encode(sub);
       }
   }

   _encode(data, "");
   return str;
}

module.exports = {
   formatParams
}