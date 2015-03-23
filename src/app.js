(function () {
    'use strict';

    angular.module('jcXsltFiddle', []);
}());

(function () {
    'use strict';

    angular.module('jcXsltFiddle')
        .factory('xsltService', serviceFn);

    serviceFn.$inject = ['$log', '$http'];
    function serviceFn($log, $http) {
        var service = {
            transform: transform
        }

        return service;

        function transform(xml, xslt) {

            var json = angular.toJson({
                xml: xml,
                xslt: xslt
            });

            $log.debug(json);

            return $http
                .post('/home/transform', json)
                .then(function (response) {
                    return response.data;
                });
        }
    }
}());

(function() {
    'use strict';

    angular.module('jcXsltFiddle')
        .factory('codeMirrorService', serviceFn);

    serviceFn.$inject = [];
    function serviceFn() {
        var tags = {};

        var service = {
            bindAll: bindAll
        };

        return service;

        function bindAll() {
            var xmlEditor = CodeMirror.fromTextArea(document.getElementById('xmlEdit'), {
                mode: "xml",
                lineNumbers: true,
                styleActiveLine: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                hintOptions: { schemaInfo: tags },
                theme: 'monokai',
                matchTags: true,
                autoCloseTags: true,
                extraKeys: {
                    "'<'": completeAfter,
                    "'/'": completeIfAfterLt,
                    "' '": completeIfInTag,
                    "'='": completeIfInTag,
                    "Ctrl-Space": "autocomplete"
                }
            });

            var xsltEditor = CodeMirror.fromTextArea(document.getElementById('xsltEdit'), {
                mode: "xml",
                lineNumbers: true,
                styleActiveLine: true,
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                theme: 'monokai',
                hintOptions: { schemaInfo: tags },
                matchTags: true,
                autoCloseTags: true,
                extraKeys: {
                    "'<'": completeAfter,
                    "'/'": completeIfAfterLt,
                    "' '": completeIfInTag,
                    "'='": completeIfInTag,
                    "Ctrl-Space": "autocomplete"
                }
            });

            var resultEditor = CodeMirror.fromTextArea(document.getElementById('result'), {
                mode: "xml",
                lineNumbers: true,
                theme: 'monokai',
                readOnly: 'nocursor'
            });

            //Not be a good idea, but for now, exposing it to global via viewBag namespace for debugging...
            window.viewBag = window.viewBag || {};
            window.viewBag.xmlEditor = xmlEditor;
            window.viewBag.xsltEditor = xsltEditor;
            window.viewBag.resultEditor = resultEditor;

            window.viewBag.resultEditor.setValue('<!-- click Run to see the XSLT transform result -->');
        }

        function completeAfter(cm, pred) {
            // ReSharper disable once UnusedLocals
            var cur = cm.getCursor();
            if (!pred || pred()) setTimeout(function () {
                if (!cm.state.completionActive)
                    cm.showHint({ completeSingle: false });
            }, 100);
            return CodeMirror.Pass;
        }

        function completeIfAfterLt(cm) {
            return completeAfter(cm, function () {
                var cur = cm.getCursor();
                return cm.getRange(CodeMirror.Pos(cur.line, cur.ch - 1), cur) === "<";
            });
        }

        function completeIfInTag(cm) {
            return completeAfter(cm, function () {
                var tok = cm.getTokenAt(cm.getCursor());
                if (tok.type === "string" && (!/['"]/.test(tok.string.charAt(tok.string.length - 1)) || tok.string.length === 1)) return false;
                var inner = CodeMirror.innerMode(cm.getMode(), tok.state).state;
                return inner.tagName;
            });
        }
    }

}());

(function () {
    'use strict';

    angular.module('jcXsltFiddle')
        .controller('editController', ctrlFn);

    ctrlFn.$inject = ['$log', 'xsltService', 'codeMirrorService'];
    function ctrlFn($log, xsltService, codeMirrorService) {
        var self = this;
        self.run = run;
        self.runEnabled = true;

        activate();

        function activate() {
            codeMirrorService.bindAll();
        }

        function run() {
            self.runEnabled = false;
            $log.info('Running transform...');
            var xml = window.viewBag.xmlEditor.getValue();
            var xslt = window.viewBag.xsltEditor.getValue();

            xsltService.transform(xml, xslt)
                .then(displayResult, handleError)
                .finally(resetUserInterface);

        }

        function resetUserInterface() {
            self.runEnabled = true;
        }

        function displayResult(data) {
            window.viewBag.resultEditor.setValue(data);
            alert('Result updated!');
        }

        function handleError(response) {
            $log.error(response);
        }
    }
}());