/**
 * @author Joachim Happel
 *
 * INCLUDE HTML
 * includes html in any dom element with the classname "rw-include-html"
 * @usage:
 * <div rw-include-html="inner.html"></div>
 * <script src="rw-include-html.js"></script>
 *
 */
(function () {

    function include() {
        var z, i, a, file, xhttp;
        z = document.getElementsByTagName("*");
        for (i = 0; i < z.length; i++) {
            if (z[i].getAttribute("rw-include-html")) {
                a = z[i].cloneNode(false);
                file = z[i].getAttribute("rw-include-html");
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (xhttp.readyState == 4 && xhttp.status == 200) {
                        a.removeAttribute("rw-include-html");
                        a.innerHTML = xhttp.responseText;
                        z[i].parentNode.replaceChild(a, z[i]);
                        include();
                    }
                }
                xhttp.open("GET", file, true);
                xhttp.send();
                return;
            }
        }
    };
    include();

})();
