/*
 * Copyright (C) 2007 Apple Inc.  All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer. 
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution. 
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission. 
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

var WebInspector = {};

Array.prototype.keySet = function()
{
    var keys = {};
    for (var i = 0; i < this.length; ++i)
        keys[this[i]] = true;
    return keys;
}

Element.prototype.removeChildren = function()
{
    this.innerHTML = "";
}

/* DOMSyntaxHighlighter.js */

/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.DOMSyntaxHighlighter = function(mimeType)
{
    this._tokenizer = WebInspector.SourceTokenizer.Registry.getInstance().getTokenizer(mimeType);
}

WebInspector.DOMSyntaxHighlighter.prototype = {
    createSpan: function(content, className)
    {
        var span = document.createElement("span");
        span.className = "webkit-" + className;
        span.appendChild(document.createTextNode(content));
        return span;
    },

    syntaxHighlightNode: function(node)
    {
        this._tokenizer.condition = this._tokenizer.initialCondition;
        var lines = node.textContent.split("\n");
        node.removeChildren();

        for (var i = lines[0].length ? 0 : 1; i < lines.length; ++i) {
            var line = lines[i];
            var plainTextStart = 0;
            this._tokenizer.line = line;
            var column = 0;
            do {
                var newColumn = this._tokenizer.nextToken(column);
                var tokenType = this._tokenizer.tokenType;
                if (tokenType) {
                    if (column > plainTextStart) {
                    	var plainText = line.substring(plainTextStart, column);
                        node.appendChild(document.createTextNode(plainText));
                    }
                    var token = line.substring(column, newColumn);
                    node.appendChild(this.createSpan(token, tokenType));
                    plainTextStart = newColumn;
                }
                column = newColumn;
           } while (column < line.length)

           if (plainTextStart < line.length) {
               var plainText = line.substring(plainTextStart, line.length);
               node.appendChild(document.createTextNode(plainText));
           }
           if (i < lines.length - 1)
               node.appendChild(document.createElement("br"));
        }
    }
}

/* SourceTokenizer.js */

/* Generated by re2c 0.13.5 on Tue Jan 26 01:16:33 2010 */
/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

WebInspector.SourceTokenizer = function()
{
}

WebInspector.SourceTokenizer.prototype = {		
    set line(line) {
        this._line = line;
    },

    set condition(condition)
    {
        this._condition = condition;
    },

    get condition()
    {
        return this._condition;
    },

    get subTokenizer()
    {
        return this._condition.subTokenizer;
    },

    getLexCondition: function()
    {
        return this.condition.lexCondition;
    },

    setLexCondition: function(lexCondition)
    {
        this.condition.lexCondition = lexCondition;
    },

    _charAt: function(cursor)
    {
        return cursor < this._line.length ? this._line.charAt(cursor) : "\n";
    }
}


WebInspector.SourceTokenizer.Registry = function() {
    this._tokenizers = {};
    this._tokenizerConstructors = {
        "text/css": "SourceCSSTokenizer",
        "text/html": "SourceHTMLTokenizer",
        "text/javascript": "SourceJavaScriptTokenizer",
        "application/javascript": "SourceJavaScriptTokenizer",
        "application/x-javascript": "SourceJavaScriptTokenizer"
    };
}

WebInspector.SourceTokenizer.Registry.getInstance = function()
{
    if (!WebInspector.SourceTokenizer.Registry._instance)
        WebInspector.SourceTokenizer.Registry._instance = new WebInspector.SourceTokenizer.Registry();
    return WebInspector.SourceTokenizer.Registry._instance;
}

WebInspector.SourceTokenizer.Registry.prototype = {
    getTokenizer: function(mimeType)
    {
        if (!this._tokenizerConstructors[mimeType])
            return null;
        var tokenizerClass = this._tokenizerConstructors[mimeType];
        var tokenizer = this._tokenizers[tokenizerClass];
        if (!tokenizer) {
            tokenizer = new WebInspector[tokenizerClass]();
            this._tokenizers[mimeType] = tokenizer;
        }
        return tokenizer;
    }
}

/* SourceJavaScriptTokenizer.js */

/* Generated by re2c 0.13.5 on Thu Feb 25 21:44:55 2010 */
/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Generate js file as follows:
//
// re2c -isc WebCore/inspector/front-end/SourceJavaScriptTokenizer.re2js \
// | sed 's|^yy\([^:]*\)*\:|case \1:|' \
// | sed 's|[*]cursor[+][+]|this._charAt(cursor++)|' \
// | sed 's|[[*][+][+]cursor|this._charAt(++cursor)|' \
// | sed 's|[*]cursor|this._charAt(cursor)|' \
// | sed 's|yych = \*\([^;]*\)|yych = this._charAt\1|' \
// | sed 's|{ gotoCase = \([^; continue; };]*\)|{ gotoCase = \1; continue; }|' \
// | sed 's|unsigned\ int|var|' \
// | sed 's|var\ yych|case 1: case 1: var yych|'

WebInspector.SourceJavaScriptTokenizer = function()
{
    WebInspector.SourceTokenizer.call(this);

    this._keywords = [
        "null", "true", "false", "break", "case", "catch", "const", "default", "finally", "for",
        "instanceof", "new", "var", "continue", "function", "return", "void", "delete", "if",
        "this", "do", "while", "else", "in", "switch", "throw", "try", "typeof", "debugger",
        "class", "enum", "export", "extends", "import", "super", "get", "set", "with"
    ].keySet();

    this._lexConditions = {
        DIV: 0,
        NODIV: 1,
        COMMENT: 2,
        DSTRING: 3,
        SSTRING: 4,
        REGEX: 5
    };

    this.case_DIV = 1000;
    this.case_NODIV = 1001;
    this.case_COMMENT = 1002;
    this.case_DSTRING = 1003;
    this.case_SSTRING = 1004;
    this.case_REGEX = 1005;

    this.initialCondition = { lexCondition: this._lexConditions.NODIV }
    this.condition = this.initialCondition;
}

WebInspector.SourceJavaScriptTokenizer.prototype = {
    nextToken: function(cursor)
    {
        var cursorOnEnter = cursor;
        var gotoCase = 1;
        while (1) {
            switch (gotoCase)
            // Following comment is replaced with generated state machine.
            
        {
            case 1: var yych;
            var yyaccept = 0;
            if (this.getLexCondition() < 3) {
                if (this.getLexCondition() < 1) {
                    { gotoCase = this.case_DIV; continue; };
                } else {
                    if (this.getLexCondition() < 2) {
                        { gotoCase = this.case_NODIV; continue; };
                    } else {
                        { gotoCase = this.case_COMMENT; continue; };
                    }
                }
            } else {
                if (this.getLexCondition() < 4) {
                    { gotoCase = this.case_DSTRING; continue; };
                } else {
                    if (this.getLexCondition() < 5) {
                        { gotoCase = this.case_SSTRING; continue; };
                    } else {
                        { gotoCase = this.case_REGEX; continue; };
                    }
                }
            }
/* *********************************** */
case this.case_COMMENT:

            yych = this._charAt(cursor);
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 4; continue; };
                { gotoCase = 3; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 4; continue; };
                if (yych == '*') { gotoCase = 6; continue; };
                { gotoCase = 3; continue; };
            }
case 2:
            { this.tokenType = "javascript-comment"; return cursor; }
case 3:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 12; continue; };
case 4:
            ++cursor;
            { this.tokenType = null; return cursor; }
case 6:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '*') { gotoCase = 9; continue; };
            if (yych != '/') { gotoCase = 11; continue; };
case 7:
            ++cursor;
            this.setLexCondition(this._lexConditions.NODIV);
            { this.tokenType = "javascript-comment"; return cursor; }
case 9:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '*') { gotoCase = 9; continue; };
            if (yych == '/') { gotoCase = 7; continue; };
case 11:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 12:
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 2; continue; };
                { gotoCase = 11; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 2; continue; };
                if (yych == '*') { gotoCase = 9; continue; };
                { gotoCase = 11; continue; };
            }
/* *********************************** */
case this.case_DIV:
            yych = this._charAt(cursor);
            if (yych <= '9') {
                if (yych <= '(') {
                    if (yych <= '#') {
                        if (yych <= ' ') { gotoCase = 15; continue; };
                        if (yych <= '!') { gotoCase = 17; continue; };
                        if (yych <= '"') { gotoCase = 19; continue; };
                    } else {
                        if (yych <= '%') {
                            if (yych <= '$') { gotoCase = 20; continue; };
                            { gotoCase = 22; continue; };
                        } else {
                            if (yych <= '&') { gotoCase = 23; continue; };
                            if (yych <= '\'') { gotoCase = 24; continue; };
                            { gotoCase = 25; continue; };
                        }
                    }
                } else {
                    if (yych <= ',') {
                        if (yych <= ')') { gotoCase = 26; continue; };
                        if (yych <= '*') { gotoCase = 28; continue; };
                        if (yych <= '+') { gotoCase = 29; continue; };
                        { gotoCase = 25; continue; };
                    } else {
                        if (yych <= '.') {
                            if (yych <= '-') { gotoCase = 30; continue; };
                            { gotoCase = 31; continue; };
                        } else {
                            if (yych <= '/') { gotoCase = 32; continue; };
                            if (yych <= '0') { gotoCase = 34; continue; };
                            { gotoCase = 36; continue; };
                        }
                    }
                }
            } else {
                if (yych <= '\\') {
                    if (yych <= '>') {
                        if (yych <= ';') { gotoCase = 25; continue; };
                        if (yych <= '<') { gotoCase = 37; continue; };
                        if (yych <= '=') { gotoCase = 38; continue; };
                        { gotoCase = 39; continue; };
                    } else {
                        if (yych <= '@') {
                            if (yych <= '?') { gotoCase = 25; continue; };
                        } else {
                            if (yych <= 'Z') { gotoCase = 20; continue; };
                            if (yych <= '[') { gotoCase = 25; continue; };
                            { gotoCase = 40; continue; };
                        }
                    }
                } else {
                    if (yych <= 'z') {
                        if (yych <= '^') {
                            if (yych <= ']') { gotoCase = 25; continue; };
                            { gotoCase = 41; continue; };
                        } else {
                            if (yych != '`') { gotoCase = 20; continue; };
                        }
                    } else {
                        if (yych <= '|') {
                            if (yych <= '{') { gotoCase = 25; continue; };
                            { gotoCase = 42; continue; };
                        } else {
                            if (yych <= '~') { gotoCase = 25; continue; };
                            if (yych >= 0x80) { gotoCase = 20; continue; };
                        }
                    }
                }
            }
case 15:
            ++cursor;
case 16:
            { this.tokenType = null; return cursor; }
case 17:
            ++cursor;
            if ((yych = this._charAt(cursor)) == '=') { gotoCase = 115; continue; };
case 18:
            this.setLexCondition(this._lexConditions.NODIV);
            { this.tokenType = null; return cursor; }
case 19:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '\n') { gotoCase = 16; continue; };
            if (yych == '\r') { gotoCase = 16; continue; };
            { gotoCase = 107; continue; };
case 20:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 50; continue; };
case 21:
            {
                    var token = this._line.substring(cursorOnEnter, cursor);
                    if (token in this._keywords)
                        this.tokenType = "javascript-keyword";
                    else
                        this.tokenType = "javascript-ident";
                    return cursor;
                }
case 22:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 23:
            yych = this._charAt(++cursor);
            if (yych == '&') { gotoCase = 43; continue; };
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 24:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '\n') { gotoCase = 16; continue; };
            if (yych == '\r') { gotoCase = 16; continue; };
            { gotoCase = 96; continue; };
case 25:
            yych = this._charAt(++cursor);
            { gotoCase = 18; continue; };
case 26:
            ++cursor;
            { this.tokenType = null; return cursor; }
case 28:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 29:
            yych = this._charAt(++cursor);
            if (yych == '+') { gotoCase = 43; continue; };
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 30:
            yych = this._charAt(++cursor);
            if (yych == '-') { gotoCase = 43; continue; };
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 31:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 18; continue; };
            if (yych <= '9') { gotoCase = 89; continue; };
            { gotoCase = 18; continue; };
case 32:
            yyaccept = 2;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '.') {
                if (yych == '*') { gotoCase = 78; continue; };
            } else {
                if (yych <= '/') { gotoCase = 80; continue; };
                if (yych == '=') { gotoCase = 77; continue; };
            }
case 33:
            this.setLexCondition(this._lexConditions.NODIV);
            { this.tokenType = null; return cursor; }
case 34:
            yyaccept = 3;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= 'E') {
                if (yych <= '/') {
                    if (yych == '.') { gotoCase = 63; continue; };
                } else {
                    if (yych <= '7') { gotoCase = 72; continue; };
                    if (yych >= 'E') { gotoCase = 62; continue; };
                }
            } else {
                if (yych <= 'd') {
                    if (yych == 'X') { gotoCase = 74; continue; };
                } else {
                    if (yych <= 'e') { gotoCase = 62; continue; };
                    if (yych == 'x') { gotoCase = 74; continue; };
                }
            }
case 35:
            { this.tokenType = "javascript-number"; return cursor; }
case 36:
            yyaccept = 3;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '9') {
                if (yych == '.') { gotoCase = 63; continue; };
                if (yych <= '/') { gotoCase = 35; continue; };
                { gotoCase = 60; continue; };
            } else {
                if (yych <= 'E') {
                    if (yych <= 'D') { gotoCase = 35; continue; };
                    { gotoCase = 62; continue; };
                } else {
                    if (yych == 'e') { gotoCase = 62; continue; };
                    { gotoCase = 35; continue; };
                }
            }
case 37:
            yych = this._charAt(++cursor);
            if (yych <= ';') { gotoCase = 18; continue; };
            if (yych <= '<') { gotoCase = 59; continue; };
            if (yych <= '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 38:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 58; continue; };
            { gotoCase = 18; continue; };
case 39:
            yych = this._charAt(++cursor);
            if (yych <= '<') { gotoCase = 18; continue; };
            if (yych <= '=') { gotoCase = 43; continue; };
            if (yych <= '>') { gotoCase = 56; continue; };
            { gotoCase = 18; continue; };
case 40:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == 'u') { gotoCase = 44; continue; };
            { gotoCase = 16; continue; };
case 41:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 42:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            if (yych != '|') { gotoCase = 18; continue; };
case 43:
            yych = this._charAt(++cursor);
            { gotoCase = 18; continue; };
case 44:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 46; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 46; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych <= 'f') { gotoCase = 46; continue; };
            }
case 45:
            cursor = YYMARKER;
            if (yyaccept <= 1) {
                if (yyaccept <= 0) {
                    { gotoCase = 16; continue; };
                } else {
                    { gotoCase = 21; continue; };
                }
            } else {
                if (yyaccept <= 2) {
                    { gotoCase = 33; continue; };
                } else {
                    { gotoCase = 35; continue; };
                }
            }
case 46:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 47; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 47:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 48; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 48:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 49; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 49:
            yyaccept = 1;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 50:
            if (yych <= '[') {
                if (yych <= '/') {
                    if (yych == '$') { gotoCase = 49; continue; };
                    { gotoCase = 21; continue; };
                } else {
                    if (yych <= '9') { gotoCase = 49; continue; };
                    if (yych <= '@') { gotoCase = 21; continue; };
                    if (yych <= 'Z') { gotoCase = 49; continue; };
                    { gotoCase = 21; continue; };
                }
            } else {
                if (yych <= '_') {
                    if (yych <= '\\') { gotoCase = 51; continue; };
                    if (yych <= '^') { gotoCase = 21; continue; };
                    { gotoCase = 49; continue; };
                } else {
                    if (yych <= '`') { gotoCase = 21; continue; };
                    if (yych <= 'z') { gotoCase = 49; continue; };
                    if (yych <= 0x7F) { gotoCase = 21; continue; };
                    { gotoCase = 49; continue; };
                }
            }
case 51:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych != 'u') { gotoCase = 45; continue; };
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 53; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 53:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 54; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 54:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 55; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 55:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 49; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 49; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych <= 'f') { gotoCase = 49; continue; };
                { gotoCase = 45; continue; };
            }
case 56:
            yych = this._charAt(++cursor);
            if (yych <= '<') { gotoCase = 18; continue; };
            if (yych <= '=') { gotoCase = 43; continue; };
            if (yych >= '?') { gotoCase = 18; continue; };
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 58:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 59:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
case 60:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '9') {
                if (yych == '.') { gotoCase = 63; continue; };
                if (yych <= '/') { gotoCase = 35; continue; };
                { gotoCase = 60; continue; };
            } else {
                if (yych <= 'E') {
                    if (yych <= 'D') { gotoCase = 35; continue; };
                } else {
                    if (yych != 'e') { gotoCase = 35; continue; };
                }
            }
case 62:
            yych = this._charAt(++cursor);
            if (yych <= ',') {
                if (yych == '+') { gotoCase = 69; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= '-') { gotoCase = 69; continue; };
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 70; continue; };
                { gotoCase = 45; continue; };
            }
case 63:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'D') {
                if (yych <= '/') { gotoCase = 35; continue; };
                if (yych <= '9') { gotoCase = 63; continue; };
                { gotoCase = 35; continue; };
            } else {
                if (yych <= 'E') { gotoCase = 65; continue; };
                if (yych != 'e') { gotoCase = 35; continue; };
            }
case 65:
            yych = this._charAt(++cursor);
            if (yych <= ',') {
                if (yych != '+') { gotoCase = 45; continue; };
            } else {
                if (yych <= '-') { gotoCase = 66; continue; };
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 67; continue; };
                { gotoCase = 45; continue; };
            }
case 66:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 45; continue; };
            if (yych >= ':') { gotoCase = 45; continue; };
case 67:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 35; continue; };
            if (yych <= '9') { gotoCase = 67; continue; };
            { gotoCase = 35; continue; };
case 69:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 45; continue; };
            if (yych >= ':') { gotoCase = 45; continue; };
case 70:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 35; continue; };
            if (yych <= '9') { gotoCase = 70; continue; };
            { gotoCase = 35; continue; };
case 72:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 35; continue; };
            if (yych <= '7') { gotoCase = 72; continue; };
            { gotoCase = 35; continue; };
case 74:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 75; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 75:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 35; continue; };
                if (yych <= '9') { gotoCase = 75; continue; };
                { gotoCase = 35; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 75; continue; };
                if (yych <= '`') { gotoCase = 35; continue; };
                if (yych <= 'f') { gotoCase = 75; continue; };
                { gotoCase = 35; continue; };
            }
case 77:
            yych = this._charAt(++cursor);
            { gotoCase = 33; continue; };
case 78:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 85; continue; };
                { gotoCase = 78; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 85; continue; };
                if (yych == '*') { gotoCase = 83; continue; };
                { gotoCase = 78; continue; };
            }
case 80:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 82; continue; };
            if (yych != '\r') { gotoCase = 80; continue; };
case 82:
            { this.tokenType = "javascript-comment"; return cursor; }
case 83:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '*') { gotoCase = 83; continue; };
            if (yych == '/') { gotoCase = 87; continue; };
            { gotoCase = 78; continue; };
case 85:
            ++cursor;
            this.setLexCondition(this._lexConditions.COMMENT);
            { this.tokenType = "javascript-comment"; return cursor; }
case 87:
            ++cursor;
            { this.tokenType = "javascript-comment"; return cursor; }
case 89:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'D') {
                if (yych <= '/') { gotoCase = 35; continue; };
                if (yych <= '9') { gotoCase = 89; continue; };
                { gotoCase = 35; continue; };
            } else {
                if (yych <= 'E') { gotoCase = 91; continue; };
                if (yych != 'e') { gotoCase = 35; continue; };
            }
case 91:
            yych = this._charAt(++cursor);
            if (yych <= ',') {
                if (yych != '+') { gotoCase = 45; continue; };
            } else {
                if (yych <= '-') { gotoCase = 92; continue; };
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 93; continue; };
                { gotoCase = 45; continue; };
            }
case 92:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 45; continue; };
            if (yych >= ':') { gotoCase = 45; continue; };
case 93:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 35; continue; };
            if (yych <= '9') { gotoCase = 93; continue; };
            { gotoCase = 35; continue; };
case 95:
            ++cursor;
            yych = this._charAt(cursor);
case 96:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 45; continue; };
                if (yych <= '\f') { gotoCase = 95; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 95; continue; };
                    { gotoCase = 98; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 95; continue; };
                }
            }
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'a') {
                if (yych <= '!') {
                    if (yych <= '\n') {
                        if (yych <= '\t') { gotoCase = 45; continue; };
                        { gotoCase = 101; continue; };
                    } else {
                        if (yych == '\r') { gotoCase = 101; continue; };
                        { gotoCase = 45; continue; };
                    }
                } else {
                    if (yych <= '\'') {
                        if (yych <= '"') { gotoCase = 95; continue; };
                        if (yych <= '&') { gotoCase = 45; continue; };
                        { gotoCase = 95; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 95; continue; };
                        { gotoCase = 45; continue; };
                    }
                }
            } else {
                if (yych <= 'q') {
                    if (yych <= 'f') {
                        if (yych <= 'b') { gotoCase = 95; continue; };
                        if (yych <= 'e') { gotoCase = 45; continue; };
                        { gotoCase = 95; continue; };
                    } else {
                        if (yych == 'n') { gotoCase = 95; continue; };
                        { gotoCase = 45; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych == 's') { gotoCase = 45; continue; };
                        { gotoCase = 95; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 100; continue; };
                        if (yych <= 'v') { gotoCase = 95; continue; };
                        { gotoCase = 45; continue; };
                    }
                }
            }
case 98:
            ++cursor;
            { this.tokenType = "javascript-string"; return cursor; }
case 100:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 103; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 103; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych <= 'f') { gotoCase = 103; continue; };
                { gotoCase = 45; continue; };
            }
case 101:
            ++cursor;
            this.setLexCondition(this._lexConditions.SSTRING);
            { this.tokenType = "javascript-string"; return cursor; }
case 103:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 104; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 104:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 105; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 105:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 95; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 95; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych <= 'f') { gotoCase = 95; continue; };
                { gotoCase = 45; continue; };
            }
case 106:
            ++cursor;
            yych = this._charAt(cursor);
case 107:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 45; continue; };
                if (yych <= '\f') { gotoCase = 106; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 106; continue; };
                    { gotoCase = 98; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 106; continue; };
                }
            }
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'a') {
                if (yych <= '!') {
                    if (yych <= '\n') {
                        if (yych <= '\t') { gotoCase = 45; continue; };
                        { gotoCase = 110; continue; };
                    } else {
                        if (yych == '\r') { gotoCase = 110; continue; };
                        { gotoCase = 45; continue; };
                    }
                } else {
                    if (yych <= '\'') {
                        if (yych <= '"') { gotoCase = 106; continue; };
                        if (yych <= '&') { gotoCase = 45; continue; };
                        { gotoCase = 106; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 106; continue; };
                        { gotoCase = 45; continue; };
                    }
                }
            } else {
                if (yych <= 'q') {
                    if (yych <= 'f') {
                        if (yych <= 'b') { gotoCase = 106; continue; };
                        if (yych <= 'e') { gotoCase = 45; continue; };
                        { gotoCase = 106; continue; };
                    } else {
                        if (yych == 'n') { gotoCase = 106; continue; };
                        { gotoCase = 45; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych == 's') { gotoCase = 45; continue; };
                        { gotoCase = 106; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 109; continue; };
                        if (yych <= 'v') { gotoCase = 106; continue; };
                        { gotoCase = 45; continue; };
                    }
                }
            }
case 109:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 112; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 112; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych <= 'f') { gotoCase = 112; continue; };
                { gotoCase = 45; continue; };
            }
case 110:
            ++cursor;
            this.setLexCondition(this._lexConditions.DSTRING);
            { this.tokenType = "javascript-string"; return cursor; }
case 112:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 113; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 113:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych >= ':') { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 114; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych >= 'g') { gotoCase = 45; continue; };
            }
case 114:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 45; continue; };
                if (yych <= '9') { gotoCase = 106; continue; };
                { gotoCase = 45; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 106; continue; };
                if (yych <= '`') { gotoCase = 45; continue; };
                if (yych <= 'f') { gotoCase = 106; continue; };
                { gotoCase = 45; continue; };
            }
case 115:
            ++cursor;
            if ((yych = this._charAt(cursor)) == '=') { gotoCase = 43; continue; };
            { gotoCase = 18; continue; };
/* *********************************** */
case this.case_DSTRING:
            yych = this._charAt(cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 120; continue; };
                if (yych <= '\f') { gotoCase = 119; continue; };
                { gotoCase = 120; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 119; continue; };
                    { gotoCase = 122; continue; };
                } else {
                    if (yych == '\\') { gotoCase = 124; continue; };
                    { gotoCase = 119; continue; };
                }
            }
case 118:
            { this.tokenType = "javascript-string"; return cursor; }
case 119:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 126; continue; };
case 120:
            ++cursor;
case 121:
            { this.tokenType = null; return cursor; }
case 122:
            ++cursor;
case 123:
            this.setLexCondition(this._lexConditions.NODIV);
            { this.tokenType = "javascript-string"; return cursor; }
case 124:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 125; continue; };
                    if (yych <= '&') { gotoCase = 121; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych <= '[') { gotoCase = 121; continue; };
                    } else {
                        if (yych != 'b') { gotoCase = 121; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych >= 'g') { gotoCase = 121; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 125; continue; };
                        if (yych <= 'q') { gotoCase = 121; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych <= 's') { gotoCase = 121; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 127; continue; };
                        if (yych >= 'w') { gotoCase = 121; continue; };
                    }
                }
            }
case 125:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 126:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 118; continue; };
                if (yych <= '\f') { gotoCase = 125; continue; };
                { gotoCase = 118; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 125; continue; };
                    { gotoCase = 133; continue; };
                } else {
                    if (yych == '\\') { gotoCase = 132; continue; };
                    { gotoCase = 125; continue; };
                }
            }
case 127:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 128; continue; };
                if (yych <= '9') { gotoCase = 129; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 129; continue; };
                if (yych <= '`') { gotoCase = 128; continue; };
                if (yych <= 'f') { gotoCase = 129; continue; };
            }
case 128:
            cursor = YYMARKER;
            if (yyaccept <= 0) {
                { gotoCase = 118; continue; };
            } else {
                { gotoCase = 121; continue; };
            }
case 129:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 128; continue; };
                if (yych >= ':') { gotoCase = 128; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 130; continue; };
                if (yych <= '`') { gotoCase = 128; continue; };
                if (yych >= 'g') { gotoCase = 128; continue; };
            }
case 130:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 128; continue; };
                if (yych >= ':') { gotoCase = 128; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 131; continue; };
                if (yych <= '`') { gotoCase = 128; continue; };
                if (yych >= 'g') { gotoCase = 128; continue; };
            }
case 131:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 128; continue; };
                if (yych <= '9') { gotoCase = 125; continue; };
                { gotoCase = 128; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 125; continue; };
                if (yych <= '`') { gotoCase = 128; continue; };
                if (yych <= 'f') { gotoCase = 125; continue; };
                { gotoCase = 128; continue; };
            }
case 132:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 125; continue; };
                    if (yych <= '&') { gotoCase = 128; continue; };
                    { gotoCase = 125; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych <= '[') { gotoCase = 128; continue; };
                        { gotoCase = 125; continue; };
                    } else {
                        if (yych == 'b') { gotoCase = 125; continue; };
                        { gotoCase = 128; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych <= 'f') { gotoCase = 125; continue; };
                        { gotoCase = 128; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 125; continue; };
                        if (yych <= 'q') { gotoCase = 128; continue; };
                        { gotoCase = 125; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych <= 's') { gotoCase = 128; continue; };
                        { gotoCase = 125; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 127; continue; };
                        if (yych <= 'v') { gotoCase = 125; continue; };
                        { gotoCase = 128; continue; };
                    }
                }
            }
case 133:
            ++cursor;
            yych = this._charAt(cursor);
            { gotoCase = 123; continue; };
/* *********************************** */
case this.case_NODIV:
            yych = this._charAt(cursor);
            if (yych <= '9') {
                if (yych <= '(') {
                    if (yych <= '#') {
                        if (yych <= ' ') { gotoCase = 136; continue; };
                        if (yych <= '!') { gotoCase = 138; continue; };
                        if (yych <= '"') { gotoCase = 140; continue; };
                    } else {
                        if (yych <= '%') {
                            if (yych <= '$') { gotoCase = 141; continue; };
                            { gotoCase = 143; continue; };
                        } else {
                            if (yych <= '&') { gotoCase = 144; continue; };
                            if (yych <= '\'') { gotoCase = 145; continue; };
                            { gotoCase = 146; continue; };
                        }
                    }
                } else {
                    if (yych <= ',') {
                        if (yych <= ')') { gotoCase = 147; continue; };
                        if (yych <= '*') { gotoCase = 149; continue; };
                        if (yych <= '+') { gotoCase = 150; continue; };
                        { gotoCase = 146; continue; };
                    } else {
                        if (yych <= '.') {
                            if (yych <= '-') { gotoCase = 151; continue; };
                            { gotoCase = 152; continue; };
                        } else {
                            if (yych <= '/') { gotoCase = 153; continue; };
                            if (yych <= '0') { gotoCase = 154; continue; };
                            { gotoCase = 156; continue; };
                        }
                    }
                }
            } else {
                if (yych <= '\\') {
                    if (yych <= '>') {
                        if (yych <= ';') { gotoCase = 146; continue; };
                        if (yych <= '<') { gotoCase = 157; continue; };
                        if (yych <= '=') { gotoCase = 158; continue; };
                        { gotoCase = 159; continue; };
                    } else {
                        if (yych <= '@') {
                            if (yych <= '?') { gotoCase = 146; continue; };
                        } else {
                            if (yych <= 'Z') { gotoCase = 141; continue; };
                            if (yych <= '[') { gotoCase = 146; continue; };
                            { gotoCase = 160; continue; };
                        }
                    }
                } else {
                    if (yych <= 'z') {
                        if (yych <= '^') {
                            if (yych <= ']') { gotoCase = 146; continue; };
                            { gotoCase = 161; continue; };
                        } else {
                            if (yych != '`') { gotoCase = 141; continue; };
                        }
                    } else {
                        if (yych <= '|') {
                            if (yych <= '{') { gotoCase = 146; continue; };
                            { gotoCase = 162; continue; };
                        } else {
                            if (yych <= '~') { gotoCase = 146; continue; };
                            if (yych >= 0x80) { gotoCase = 141; continue; };
                        }
                    }
                }
            }
case 136:
            ++cursor;
case 137:
            { this.tokenType = null; return cursor; }
case 138:
            ++cursor;
            if ((yych = this._charAt(cursor)) == '=') { gotoCase = 260; continue; };
case 139:
            { this.tokenType = null; return cursor; }
case 140:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '\n') { gotoCase = 137; continue; };
            if (yych == '\r') { gotoCase = 137; continue; };
            { gotoCase = 252; continue; };
case 141:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 170; continue; };
case 142:
            this.setLexCondition(this._lexConditions.DIV);
            {
                    var token = this._line.substring(cursorOnEnter, cursor);
                    if (token in this._keywords)
                        this.tokenType = "javascript-keyword";
                    else
                        this.tokenType = "javascript-ident";
                    return cursor;
                }
case 143:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 144:
            yych = this._charAt(++cursor);
            if (yych == '&') { gotoCase = 163; continue; };
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 145:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '\n') { gotoCase = 137; continue; };
            if (yych == '\r') { gotoCase = 137; continue; };
            { gotoCase = 241; continue; };
case 146:
            yych = this._charAt(++cursor);
            { gotoCase = 139; continue; };
case 147:
            ++cursor;
            this.setLexCondition(this._lexConditions.DIV);
            { this.tokenType = null; return cursor; }
case 149:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 150:
            yych = this._charAt(++cursor);
            if (yych == '+') { gotoCase = 163; continue; };
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 151:
            yych = this._charAt(++cursor);
            if (yych == '-') { gotoCase = 163; continue; };
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 152:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 139; continue; };
            if (yych <= '9') { gotoCase = 234; continue; };
            { gotoCase = 139; continue; };
case 153:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 137; continue; };
                    { gotoCase = 197; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 137; continue; };
                    if (yych <= ')') { gotoCase = 197; continue; };
                    { gotoCase = 202; continue; };
                }
            } else {
                if (yych <= 'Z') {
                    if (yych == '/') { gotoCase = 204; continue; };
                    { gotoCase = 197; continue; };
                } else {
                    if (yych <= '[') { gotoCase = 200; continue; };
                    if (yych <= '\\') { gotoCase = 199; continue; };
                    if (yych <= ']') { gotoCase = 137; continue; };
                    { gotoCase = 197; continue; };
                }
            }
case 154:
            yyaccept = 2;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= 'E') {
                if (yych <= '/') {
                    if (yych == '.') { gotoCase = 183; continue; };
                } else {
                    if (yych <= '7') { gotoCase = 192; continue; };
                    if (yych >= 'E') { gotoCase = 182; continue; };
                }
            } else {
                if (yych <= 'd') {
                    if (yych == 'X') { gotoCase = 194; continue; };
                } else {
                    if (yych <= 'e') { gotoCase = 182; continue; };
                    if (yych == 'x') { gotoCase = 194; continue; };
                }
            }
case 155:
            this.setLexCondition(this._lexConditions.DIV);
            { this.tokenType = "javascript-number"; return cursor; }
case 156:
            yyaccept = 2;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '9') {
                if (yych == '.') { gotoCase = 183; continue; };
                if (yych <= '/') { gotoCase = 155; continue; };
                { gotoCase = 180; continue; };
            } else {
                if (yych <= 'E') {
                    if (yych <= 'D') { gotoCase = 155; continue; };
                    { gotoCase = 182; continue; };
                } else {
                    if (yych == 'e') { gotoCase = 182; continue; };
                    { gotoCase = 155; continue; };
                }
            }
case 157:
            yych = this._charAt(++cursor);
            if (yych <= ';') { gotoCase = 139; continue; };
            if (yych <= '<') { gotoCase = 179; continue; };
            if (yych <= '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 158:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 178; continue; };
            { gotoCase = 139; continue; };
case 159:
            yych = this._charAt(++cursor);
            if (yych <= '<') { gotoCase = 139; continue; };
            if (yych <= '=') { gotoCase = 163; continue; };
            if (yych <= '>') { gotoCase = 176; continue; };
            { gotoCase = 139; continue; };
case 160:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == 'u') { gotoCase = 164; continue; };
            { gotoCase = 137; continue; };
case 161:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 162:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            if (yych != '|') { gotoCase = 139; continue; };
case 163:
            yych = this._charAt(++cursor);
            { gotoCase = 139; continue; };
case 164:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 166; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 166; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych <= 'f') { gotoCase = 166; continue; };
            }
case 165:
            cursor = YYMARKER;
            if (yyaccept <= 1) {
                if (yyaccept <= 0) {
                    { gotoCase = 137; continue; };
                } else {
                    { gotoCase = 142; continue; };
                }
            } else {
                if (yyaccept <= 2) {
                    { gotoCase = 155; continue; };
                } else {
                    { gotoCase = 217; continue; };
                }
            }
case 166:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 167; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 167:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 168; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 168:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 169; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 169:
            yyaccept = 1;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 170:
            if (yych <= '[') {
                if (yych <= '/') {
                    if (yych == '$') { gotoCase = 169; continue; };
                    { gotoCase = 142; continue; };
                } else {
                    if (yych <= '9') { gotoCase = 169; continue; };
                    if (yych <= '@') { gotoCase = 142; continue; };
                    if (yych <= 'Z') { gotoCase = 169; continue; };
                    { gotoCase = 142; continue; };
                }
            } else {
                if (yych <= '_') {
                    if (yych <= '\\') { gotoCase = 171; continue; };
                    if (yych <= '^') { gotoCase = 142; continue; };
                    { gotoCase = 169; continue; };
                } else {
                    if (yych <= '`') { gotoCase = 142; continue; };
                    if (yych <= 'z') { gotoCase = 169; continue; };
                    if (yych <= 0x7F) { gotoCase = 142; continue; };
                    { gotoCase = 169; continue; };
                }
            }
case 171:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych != 'u') { gotoCase = 165; continue; };
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 173; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 173:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 174; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 174:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 175; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 175:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 169; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 169; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych <= 'f') { gotoCase = 169; continue; };
                { gotoCase = 165; continue; };
            }
case 176:
            yych = this._charAt(++cursor);
            if (yych <= '<') { gotoCase = 139; continue; };
            if (yych <= '=') { gotoCase = 163; continue; };
            if (yych >= '?') { gotoCase = 139; continue; };
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 178:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 179:
            yych = this._charAt(++cursor);
            if (yych == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
case 180:
            yyaccept = 2;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '9') {
                if (yych == '.') { gotoCase = 183; continue; };
                if (yych <= '/') { gotoCase = 155; continue; };
                { gotoCase = 180; continue; };
            } else {
                if (yych <= 'E') {
                    if (yych <= 'D') { gotoCase = 155; continue; };
                } else {
                    if (yych != 'e') { gotoCase = 155; continue; };
                }
            }
case 182:
            yych = this._charAt(++cursor);
            if (yych <= ',') {
                if (yych == '+') { gotoCase = 189; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= '-') { gotoCase = 189; continue; };
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 190; continue; };
                { gotoCase = 165; continue; };
            }
case 183:
            yyaccept = 2;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'D') {
                if (yych <= '/') { gotoCase = 155; continue; };
                if (yych <= '9') { gotoCase = 183; continue; };
                { gotoCase = 155; continue; };
            } else {
                if (yych <= 'E') { gotoCase = 185; continue; };
                if (yych != 'e') { gotoCase = 155; continue; };
            }
case 185:
            yych = this._charAt(++cursor);
            if (yych <= ',') {
                if (yych != '+') { gotoCase = 165; continue; };
            } else {
                if (yych <= '-') { gotoCase = 186; continue; };
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 187; continue; };
                { gotoCase = 165; continue; };
            }
case 186:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 165; continue; };
            if (yych >= ':') { gotoCase = 165; continue; };
case 187:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 155; continue; };
            if (yych <= '9') { gotoCase = 187; continue; };
            { gotoCase = 155; continue; };
case 189:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 165; continue; };
            if (yych >= ':') { gotoCase = 165; continue; };
case 190:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 155; continue; };
            if (yych <= '9') { gotoCase = 190; continue; };
            { gotoCase = 155; continue; };
case 192:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 155; continue; };
            if (yych <= '7') { gotoCase = 192; continue; };
            { gotoCase = 155; continue; };
case 194:
            yych = this._charAt(++cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 195; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 195:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 155; continue; };
                if (yych <= '9') { gotoCase = 195; continue; };
                { gotoCase = 155; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 195; continue; };
                if (yych <= '`') { gotoCase = 155; continue; };
                if (yych <= 'f') { gotoCase = 195; continue; };
                { gotoCase = 155; continue; };
            }
case 197:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '.') {
                if (yych <= '\n') {
                    if (yych <= '\t') { gotoCase = 197; continue; };
                    { gotoCase = 165; continue; };
                } else {
                    if (yych == '\r') { gotoCase = 165; continue; };
                    { gotoCase = 197; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '/') { gotoCase = 220; continue; };
                    if (yych <= 'Z') { gotoCase = 197; continue; };
                    { gotoCase = 228; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 227; continue; };
                    if (yych <= ']') { gotoCase = 165; continue; };
                    { gotoCase = 197; continue; };
                }
            }
case 199:
            yych = this._charAt(++cursor);
            if (yych == '\n') { gotoCase = 165; continue; };
            if (yych == '\r') { gotoCase = 165; continue; };
            { gotoCase = 197; continue; };
case 200:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 165; continue; };
                    { gotoCase = 200; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 165; continue; };
                    if (yych <= ')') { gotoCase = 200; continue; };
                    { gotoCase = 165; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych == '/') { gotoCase = 165; continue; };
                    { gotoCase = 200; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 215; continue; };
                    if (yych <= ']') { gotoCase = 213; continue; };
                    { gotoCase = 200; continue; };
                }
            }
case 202:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 209; continue; };
                { gotoCase = 202; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 209; continue; };
                if (yych == '*') { gotoCase = 207; continue; };
                { gotoCase = 202; continue; };
            }
case 204:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 206; continue; };
            if (yych != '\r') { gotoCase = 204; continue; };
case 206:
            { this.tokenType = "javascript-comment"; return cursor; }
case 207:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '*') { gotoCase = 207; continue; };
            if (yych == '/') { gotoCase = 211; continue; };
            { gotoCase = 202; continue; };
case 209:
            ++cursor;
            this.setLexCondition(this._lexConditions.COMMENT);
            { this.tokenType = "javascript-comment"; return cursor; }
case 211:
            ++cursor;
            { this.tokenType = "javascript-comment"; return cursor; }
case 213:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 165; continue; };
                    { gotoCase = 213; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 165; continue; };
                    if (yych <= ')') { gotoCase = 213; continue; };
                    { gotoCase = 197; continue; };
                }
            } else {
                if (yych <= 'Z') {
                    if (yych == '/') { gotoCase = 220; continue; };
                    { gotoCase = 213; continue; };
                } else {
                    if (yych <= '[') { gotoCase = 218; continue; };
                    if (yych <= '\\') { gotoCase = 216; continue; };
                    { gotoCase = 213; continue; };
                }
            }
case 215:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 165; continue; };
            if (yych == '\r') { gotoCase = 165; continue; };
            { gotoCase = 200; continue; };
case 216:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 217; continue; };
            if (yych != '\r') { gotoCase = 213; continue; };
case 217:
            this.setLexCondition(this._lexConditions.REGEX);
            { this.tokenType = "javascript-regexp"; return cursor; }
case 218:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 165; continue; };
                    { gotoCase = 218; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 165; continue; };
                    if (yych <= ')') { gotoCase = 218; continue; };
                    { gotoCase = 165; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych == '/') { gotoCase = 165; continue; };
                    { gotoCase = 218; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 225; continue; };
                    if (yych <= ']') { gotoCase = 223; continue; };
                    { gotoCase = 218; continue; };
                }
            }
case 220:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'h') {
                if (yych == 'g') { gotoCase = 220; continue; };
            } else {
                if (yych <= 'i') { gotoCase = 220; continue; };
                if (yych == 'm') { gotoCase = 220; continue; };
            }
            { this.tokenType = "javascript-regexp"; return cursor; }
case 223:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 165; continue; };
                    { gotoCase = 223; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 165; continue; };
                    if (yych <= ')') { gotoCase = 223; continue; };
                    { gotoCase = 197; continue; };
                }
            } else {
                if (yych <= 'Z') {
                    if (yych == '/') { gotoCase = 220; continue; };
                    { gotoCase = 223; continue; };
                } else {
                    if (yych <= '[') { gotoCase = 218; continue; };
                    if (yych <= '\\') { gotoCase = 226; continue; };
                    { gotoCase = 223; continue; };
                }
            }
case 225:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 165; continue; };
            if (yych == '\r') { gotoCase = 165; continue; };
            { gotoCase = 218; continue; };
case 226:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 217; continue; };
            if (yych == '\r') { gotoCase = 217; continue; };
            { gotoCase = 223; continue; };
case 227:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 217; continue; };
            if (yych == '\r') { gotoCase = 217; continue; };
            { gotoCase = 197; continue; };
case 228:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 165; continue; };
                    { gotoCase = 228; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 165; continue; };
                    if (yych <= ')') { gotoCase = 228; continue; };
                    { gotoCase = 165; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych == '/') { gotoCase = 165; continue; };
                    { gotoCase = 228; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 232; continue; };
                    if (yych >= '^') { gotoCase = 228; continue; };
                }
            }
case 230:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 165; continue; };
                    { gotoCase = 230; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 165; continue; };
                    if (yych <= ')') { gotoCase = 230; continue; };
                    { gotoCase = 197; continue; };
                }
            } else {
                if (yych <= 'Z') {
                    if (yych == '/') { gotoCase = 220; continue; };
                    { gotoCase = 230; continue; };
                } else {
                    if (yych <= '[') { gotoCase = 228; continue; };
                    if (yych <= '\\') { gotoCase = 233; continue; };
                    { gotoCase = 230; continue; };
                }
            }
case 232:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 165; continue; };
            if (yych == '\r') { gotoCase = 165; continue; };
            { gotoCase = 228; continue; };
case 233:
            yyaccept = 3;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 217; continue; };
            if (yych == '\r') { gotoCase = 217; continue; };
            { gotoCase = 230; continue; };
case 234:
            yyaccept = 2;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'D') {
                if (yych <= '/') { gotoCase = 155; continue; };
                if (yych <= '9') { gotoCase = 234; continue; };
                { gotoCase = 155; continue; };
            } else {
                if (yych <= 'E') { gotoCase = 236; continue; };
                if (yych != 'e') { gotoCase = 155; continue; };
            }
case 236:
            yych = this._charAt(++cursor);
            if (yych <= ',') {
                if (yych != '+') { gotoCase = 165; continue; };
            } else {
                if (yych <= '-') { gotoCase = 237; continue; };
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 238; continue; };
                { gotoCase = 165; continue; };
            }
case 237:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 165; continue; };
            if (yych >= ':') { gotoCase = 165; continue; };
case 238:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '/') { gotoCase = 155; continue; };
            if (yych <= '9') { gotoCase = 238; continue; };
            { gotoCase = 155; continue; };
case 240:
            ++cursor;
            yych = this._charAt(cursor);
case 241:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 165; continue; };
                if (yych <= '\f') { gotoCase = 240; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 240; continue; };
                    { gotoCase = 243; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 240; continue; };
                }
            }
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'a') {
                if (yych <= '!') {
                    if (yych <= '\n') {
                        if (yych <= '\t') { gotoCase = 165; continue; };
                        { gotoCase = 246; continue; };
                    } else {
                        if (yych == '\r') { gotoCase = 246; continue; };
                        { gotoCase = 165; continue; };
                    }
                } else {
                    if (yych <= '\'') {
                        if (yych <= '"') { gotoCase = 240; continue; };
                        if (yych <= '&') { gotoCase = 165; continue; };
                        { gotoCase = 240; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 240; continue; };
                        { gotoCase = 165; continue; };
                    }
                }
            } else {
                if (yych <= 'q') {
                    if (yych <= 'f') {
                        if (yych <= 'b') { gotoCase = 240; continue; };
                        if (yych <= 'e') { gotoCase = 165; continue; };
                        { gotoCase = 240; continue; };
                    } else {
                        if (yych == 'n') { gotoCase = 240; continue; };
                        { gotoCase = 165; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych == 's') { gotoCase = 165; continue; };
                        { gotoCase = 240; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 245; continue; };
                        if (yych <= 'v') { gotoCase = 240; continue; };
                        { gotoCase = 165; continue; };
                    }
                }
            }
case 243:
            ++cursor;
            { this.tokenType = "javascript-string"; return cursor; }
case 245:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 248; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 248; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych <= 'f') { gotoCase = 248; continue; };
                { gotoCase = 165; continue; };
            }
case 246:
            ++cursor;
            this.setLexCondition(this._lexConditions.SSTRING);
            { this.tokenType = "javascript-string"; return cursor; }
case 248:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 249; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 249:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 250; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 250:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 240; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 240; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych <= 'f') { gotoCase = 240; continue; };
                { gotoCase = 165; continue; };
            }
case 251:
            ++cursor;
            yych = this._charAt(cursor);
case 252:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 165; continue; };
                if (yych <= '\f') { gotoCase = 251; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 251; continue; };
                    { gotoCase = 243; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 251; continue; };
                }
            }
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'a') {
                if (yych <= '!') {
                    if (yych <= '\n') {
                        if (yych <= '\t') { gotoCase = 165; continue; };
                        { gotoCase = 255; continue; };
                    } else {
                        if (yych == '\r') { gotoCase = 255; continue; };
                        { gotoCase = 165; continue; };
                    }
                } else {
                    if (yych <= '\'') {
                        if (yych <= '"') { gotoCase = 251; continue; };
                        if (yych <= '&') { gotoCase = 165; continue; };
                        { gotoCase = 251; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 251; continue; };
                        { gotoCase = 165; continue; };
                    }
                }
            } else {
                if (yych <= 'q') {
                    if (yych <= 'f') {
                        if (yych <= 'b') { gotoCase = 251; continue; };
                        if (yych <= 'e') { gotoCase = 165; continue; };
                        { gotoCase = 251; continue; };
                    } else {
                        if (yych == 'n') { gotoCase = 251; continue; };
                        { gotoCase = 165; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych == 's') { gotoCase = 165; continue; };
                        { gotoCase = 251; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 254; continue; };
                        if (yych <= 'v') { gotoCase = 251; continue; };
                        { gotoCase = 165; continue; };
                    }
                }
            }
case 254:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 257; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 257; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych <= 'f') { gotoCase = 257; continue; };
                { gotoCase = 165; continue; };
            }
case 255:
            ++cursor;
            this.setLexCondition(this._lexConditions.DSTRING);
            { this.tokenType = "javascript-string"; return cursor; }
case 257:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 258; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 258:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych >= ':') { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 259; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych >= 'g') { gotoCase = 165; continue; };
            }
case 259:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 165; continue; };
                if (yych <= '9') { gotoCase = 251; continue; };
                { gotoCase = 165; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 251; continue; };
                if (yych <= '`') { gotoCase = 165; continue; };
                if (yych <= 'f') { gotoCase = 251; continue; };
                { gotoCase = 165; continue; };
            }
case 260:
            ++cursor;
            if ((yych = this._charAt(cursor)) == '=') { gotoCase = 163; continue; };
            { gotoCase = 139; continue; };
/* *********************************** */
case this.case_REGEX:
            yych = this._charAt(cursor);
            if (yych <= '.') {
                if (yych <= '\n') {
                    if (yych <= '\t') { gotoCase = 264; continue; };
                    { gotoCase = 265; continue; };
                } else {
                    if (yych == '\r') { gotoCase = 265; continue; };
                    { gotoCase = 264; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '/') { gotoCase = 267; continue; };
                    if (yych <= 'Z') { gotoCase = 264; continue; };
                    { gotoCase = 269; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 270; continue; };
                    if (yych <= ']') { gotoCase = 265; continue; };
                    { gotoCase = 264; continue; };
                }
            }
case 263:
            { this.tokenType = "javascript-regexp"; return cursor; }
case 264:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 272; continue; };
case 265:
            ++cursor;
case 266:
            { this.tokenType = null; return cursor; }
case 267:
            ++cursor;
            yych = this._charAt(cursor);
            { gotoCase = 278; continue; };
case 268:
            this.setLexCondition(this._lexConditions.NODIV);
            { this.tokenType = "javascript-regexp"; return cursor; }
case 269:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 266; continue; };
                if (yych <= '\f') { gotoCase = 276; continue; };
                { gotoCase = 266; continue; };
            } else {
                if (yych <= '*') {
                    if (yych <= ')') { gotoCase = 276; continue; };
                    { gotoCase = 266; continue; };
                } else {
                    if (yych == '/') { gotoCase = 266; continue; };
                    { gotoCase = 276; continue; };
                }
            }
case 270:
            yych = this._charAt(++cursor);
            if (yych == '\n') { gotoCase = 266; continue; };
            if (yych == '\r') { gotoCase = 266; continue; };
case 271:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 272:
            if (yych <= '.') {
                if (yych <= '\n') {
                    if (yych <= '\t') { gotoCase = 271; continue; };
                    { gotoCase = 263; continue; };
                } else {
                    if (yych == '\r') { gotoCase = 263; continue; };
                    { gotoCase = 271; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '/') { gotoCase = 277; continue; };
                    if (yych <= 'Z') { gotoCase = 271; continue; };
                    { gotoCase = 275; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 273; continue; };
                    if (yych <= ']') { gotoCase = 263; continue; };
                    { gotoCase = 271; continue; };
                }
            }
case 273:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 274; continue; };
            if (yych != '\r') { gotoCase = 271; continue; };
case 274:
            cursor = YYMARKER;
            if (yyaccept <= 0) {
                { gotoCase = 263; continue; };
            } else {
                { gotoCase = 266; continue; };
            }
case 275:
            ++cursor;
            yych = this._charAt(cursor);
case 276:
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 274; continue; };
                    { gotoCase = 275; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 274; continue; };
                    if (yych <= ')') { gotoCase = 275; continue; };
                    { gotoCase = 274; continue; };
                }
            } else {
                if (yych <= '[') {
                    if (yych == '/') { gotoCase = 274; continue; };
                    { gotoCase = 275; continue; };
                } else {
                    if (yych <= '\\') { gotoCase = 281; continue; };
                    if (yych <= ']') { gotoCase = 279; continue; };
                    { gotoCase = 275; continue; };
                }
            }
case 277:
            ++cursor;
            yych = this._charAt(cursor);
case 278:
            if (yych <= 'h') {
                if (yych == 'g') { gotoCase = 277; continue; };
                { gotoCase = 268; continue; };
            } else {
                if (yych <= 'i') { gotoCase = 277; continue; };
                if (yych == 'm') { gotoCase = 277; continue; };
                { gotoCase = 268; continue; };
            }
case 279:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '*') {
                if (yych <= '\f') {
                    if (yych == '\n') { gotoCase = 263; continue; };
                    { gotoCase = 279; continue; };
                } else {
                    if (yych <= '\r') { gotoCase = 263; continue; };
                    if (yych <= ')') { gotoCase = 279; continue; };
                    { gotoCase = 271; continue; };
                }
            } else {
                if (yych <= 'Z') {
                    if (yych == '/') { gotoCase = 277; continue; };
                    { gotoCase = 279; continue; };
                } else {
                    if (yych <= '[') { gotoCase = 275; continue; };
                    if (yych <= '\\') { gotoCase = 282; continue; };
                    { gotoCase = 279; continue; };
                }
            }
case 281:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 274; continue; };
            if (yych == '\r') { gotoCase = 274; continue; };
            { gotoCase = 275; continue; };
case 282:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '\n') { gotoCase = 274; continue; };
            if (yych == '\r') { gotoCase = 274; continue; };
            { gotoCase = 279; continue; };
/* *********************************** */
case this.case_SSTRING:
            yych = this._charAt(cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 287; continue; };
                if (yych <= '\f') { gotoCase = 286; continue; };
                { gotoCase = 287; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 286; continue; };
                    { gotoCase = 289; continue; };
                } else {
                    if (yych == '\\') { gotoCase = 291; continue; };
                    { gotoCase = 286; continue; };
                }
            }
case 285:
            { this.tokenType = "javascript-string"; return cursor; }
case 286:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 293; continue; };
case 287:
            ++cursor;
case 288:
            { this.tokenType = null; return cursor; }
case 289:
            ++cursor;
case 290:
            this.setLexCondition(this._lexConditions.NODIV);
            { this.tokenType = "javascript-string"; return cursor; }
case 291:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 292; continue; };
                    if (yych <= '&') { gotoCase = 288; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych <= '[') { gotoCase = 288; continue; };
                    } else {
                        if (yych != 'b') { gotoCase = 288; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych >= 'g') { gotoCase = 288; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 292; continue; };
                        if (yych <= 'q') { gotoCase = 288; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych <= 's') { gotoCase = 288; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 294; continue; };
                        if (yych >= 'w') { gotoCase = 288; continue; };
                    }
                }
            }
case 292:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 293:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 285; continue; };
                if (yych <= '\f') { gotoCase = 292; continue; };
                { gotoCase = 285; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 292; continue; };
                    { gotoCase = 300; continue; };
                } else {
                    if (yych == '\\') { gotoCase = 299; continue; };
                    { gotoCase = 292; continue; };
                }
            }
case 294:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 295; continue; };
                if (yych <= '9') { gotoCase = 296; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 296; continue; };
                if (yych <= '`') { gotoCase = 295; continue; };
                if (yych <= 'f') { gotoCase = 296; continue; };
            }
case 295:
            cursor = YYMARKER;
            if (yyaccept <= 0) {
                { gotoCase = 285; continue; };
            } else {
                { gotoCase = 288; continue; };
            }
case 296:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 295; continue; };
                if (yych >= ':') { gotoCase = 295; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 297; continue; };
                if (yych <= '`') { gotoCase = 295; continue; };
                if (yych >= 'g') { gotoCase = 295; continue; };
            }
case 297:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 295; continue; };
                if (yych >= ':') { gotoCase = 295; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 298; continue; };
                if (yych <= '`') { gotoCase = 295; continue; };
                if (yych >= 'g') { gotoCase = 295; continue; };
            }
case 298:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '@') {
                if (yych <= '/') { gotoCase = 295; continue; };
                if (yych <= '9') { gotoCase = 292; continue; };
                { gotoCase = 295; continue; };
            } else {
                if (yych <= 'F') { gotoCase = 292; continue; };
                if (yych <= '`') { gotoCase = 295; continue; };
                if (yych <= 'f') { gotoCase = 292; continue; };
                { gotoCase = 295; continue; };
            }
case 299:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 292; continue; };
                    if (yych <= '&') { gotoCase = 295; continue; };
                    { gotoCase = 292; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych <= '[') { gotoCase = 295; continue; };
                        { gotoCase = 292; continue; };
                    } else {
                        if (yych == 'b') { gotoCase = 292; continue; };
                        { gotoCase = 295; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych <= 'f') { gotoCase = 292; continue; };
                        { gotoCase = 295; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 292; continue; };
                        if (yych <= 'q') { gotoCase = 295; continue; };
                        { gotoCase = 292; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych <= 's') { gotoCase = 295; continue; };
                        { gotoCase = 292; continue; };
                    } else {
                        if (yych <= 'u') { gotoCase = 294; continue; };
                        if (yych <= 'v') { gotoCase = 292; continue; };
                        { gotoCase = 295; continue; };
                    }
                }
            }
case 300:
            ++cursor;
            yych = this._charAt(cursor);
            { gotoCase = 290; continue; };
        }

        }
    }
}

WebInspector.SourceJavaScriptTokenizer.prototype.__proto__ = WebInspector.SourceTokenizer.prototype;

/* SourceCSSTokenizer.js */

/* Generated by re2c 0.13.5 on Thu Feb 25 21:44:55 2010 */
/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Generate js file as follows:
//
// re2c -isc WebCore/inspector/front-end/SourceCSSTokenizer.re2js \
// | sed 's|^yy\([^:]*\)*\:|case \1:|' \
// | sed 's|[*]cursor[+][+]|this._charAt(cursor++)|' \
// | sed 's|[[*][+][+]cursor|this._charAt(++cursor)|' \
// | sed 's|[*]cursor|this._charAt(cursor)|' \
// | sed 's|yych = \*\([^;]*\)|yych = this._charAt\1|' \
// | sed 's|{ gotoCase = \([^; continue; };]*\)|{ gotoCase = \1; continue; }|' \
// | sed 's|unsigned\ int|var|' \
// | sed 's|var\ yych|case 1: case 1: var yych|'

WebInspector.SourceCSSTokenizer = function()
{
    WebInspector.SourceTokenizer.call(this);

    this._propertyKeywords = [
        "background", "background-attachment", "background-clip", "background-color", "background-image",
        "background-origin", "background-position", "background-position-x", "background-position-y",
        "background-repeat", "background-repeat-x", "background-repeat-y", "background-size", "border",
        "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius",
        "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-left",
        "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right",
        "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-style",
        "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style",
        "border-top-width", "border-width", "bottom", "caption-side", "clear", "clip", "color", "content",
        "counter-increment", "counter-reset", "cursor", "direction", "display", "empty-cells", "float",
        "font", "font-family", "font-size", "font-stretch", "font-style", "font-variant", "font-weight",
        "height", "left", "letter-spacing", "line-height", "list-style", "list-style-image", "list-style-position",
        "list-style-type", "margin", "margin-bottom", "margin-left", "margin-right", "margin-top", "max-height",
        "max-width", "min-height", "min-width", "opacity", "orphans", "outline", "outline-color", "outline-offset",
        "outline-style", "outline-width", "overflow", "overflow-x", "overflow-y", "padding", "padding-bottom",
        "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before",
        "page-break-inside", "pointer-events", "position", "quotes", "resize", "right", "size", "src",
        "table-layout", "text-align", "text-decoration", "text-indent", "text-line-through", "text-line-through-color",
        "text-line-through-mode", "text-line-through-style", "text-line-through-width", "text-overflow", "text-overline",
        "text-overline-color", "text-overline-mode", "text-overline-style", "text-overline-width", "text-rendering",
        "text-shadow", "text-transform", "text-underline", "text-underline-color", "text-underline-mode",
        "text-underline-style", "text-underline-width", "top", "unicode-bidi", "unicode-range", "vertical-align",
        "visibility", "white-space", "widows", "width", "word-break", "word-spacing", "word-wrap", "z-index", "zoom",
        "-webkit-animation", "-webkit-animation-delay", "-webkit-animation-direction", "-webkit-animation-duration",
        "-webkit-animation-iteration-count", "-webkit-animation-name", "-webkit-animation-play-state",
        "-webkit-animation-timing-function", "-webkit-appearance", "-webkit-backface-visibility",
        "-webkit-background-clip", "-webkit-background-composite", "-webkit-background-origin", "-webkit-background-size",
        "-webkit-binding", "-webkit-border-fit", "-webkit-border-horizontal-spacing", "-webkit-border-image",
        "-webkit-border-radius", "-webkit-border-vertical-spacing", "-webkit-box-align", "-webkit-box-direction",
        "-webkit-box-flex", "-webkit-box-flex-group", "-webkit-box-lines", "-webkit-box-ordinal-group",
        "-webkit-box-orient", "-webkit-box-pack", "-webkit-box-reflect", "-webkit-box-shadow", "-webkit-box-sizing",
        "-webkit-column-break-after", "-webkit-column-break-before", "-webkit-column-break-inside", "-webkit-column-count",
        "-webkit-column-gap", "-webkit-column-rule", "-webkit-column-rule-color", "-webkit-column-rule-style",
        "-webkit-column-rule-width", "-webkit-column-width", "-webkit-columns", "-webkit-font-size-delta",
        "-webkit-font-smoothing", "-webkit-highlight", "-webkit-line-break", "-webkit-line-clamp",
        "-webkit-margin-bottom-collapse", "-webkit-margin-collapse", "-webkit-margin-start", "-webkit-margin-top-collapse",
        "-webkit-marquee", "-webkit-marquee-direction", "-webkit-marquee-increment", "-webkit-marquee-repetition",
        "-webkit-marquee-speed", "-webkit-marquee-style", "-webkit-mask", "-webkit-mask-attachment",
        "-webkit-mask-box-image", "-webkit-mask-clip", "-webkit-mask-composite", "-webkit-mask-image",
        "-webkit-mask-origin", "-webkit-mask-position", "-webkit-mask-position-x", "-webkit-mask-position-y",
        "-webkit-mask-repeat", "-webkit-mask-repeat-x", "-webkit-mask-repeat-y", "-webkit-mask-size",
        "-webkit-match-nearest-mail-blockquote-color", "-webkit-nbsp-mode", "-webkit-padding-start",
        "-webkit-perspective", "-webkit-perspective-origin", "-webkit-perspective-origin-x", "-webkit-perspective-origin-y",
        "-webkit-rtl-ordering", "-webkit-text-decorations-in-effect", "-webkit-text-fill-color", "-webkit-text-security",
        "-webkit-text-size-adjust", "-webkit-text-stroke", "-webkit-text-stroke-color", "-webkit-text-stroke-width",
        "-webkit-transform", "-webkit-transform-origin", "-webkit-transform-origin-x", "-webkit-transform-origin-y",
        "-webkit-transform-origin-z", "-webkit-transform-style", "-webkit-transition", "-webkit-transition-delay",
        "-webkit-transition-duration", "-webkit-transition-property", "-webkit-transition-timing-function",
        "-webkit-user-drag", "-webkit-user-modify", "-webkit-user-select", "-webkit-variable-declaration-block"
    ].keySet();
    
    this._valueKeywords = [
        "above", "absolute", "activeborder", "activecaption", "afar", "after-white-space", "ahead", "alias", "all", "all-scroll",
        "alternate", "always","amharic", "amharic-abegede", "antialiased", "appworkspace", "aqua", "arabic-indic", "armenian",
        "auto", "avoid", "background", "backwards", "baseline", "below", "bidi-override", "binary", "bengali", "black", "blink",
        "block", "block-axis", "blue", "bold", "bolder", "border", "border-box", "both", "bottom", "break-all", "break-word", "button",
        "button-bevel", "buttonface", "buttonhighlight", "buttonshadow", "buttontext", "cambodian", "capitalize", "caps-lock-indicator",
        "caption", "captiontext", "caret", "cell", "center", "checkbox", "circle", "cjk-earthly-branch", "cjk-heavenly-stem", "cjk-ideographic",
        "clear", "clip", "close-quote", "col-resize", "collapse", "compact", "condensed", "contain", "content", "content-box", "context-menu",
        "continuous", "copy", "cover", "crop", "cross", "crosshair", "currentcolor", "cursive", "dashed", "decimal", "decimal-leading-zero", "default",
        "default-button", "destination-atop", "destination-in", "destination-out", "destination-over", "devanagari", "disc", "discard", "document",
        "dot-dash", "dot-dot-dash", "dotted", "double", "down", "e-resize", "ease", "ease-in", "ease-in-out", "ease-out", "element",
        "ellipsis", "embed", "end", "ethiopic", "ethiopic-abegede", "ethiopic-abegede-am-et", "ethiopic-abegede-gez",
        "ethiopic-abegede-ti-er", "ethiopic-abegede-ti-et", "ethiopic-halehame-aa-er", "ethiopic-halehame-aa-et",
        "ethiopic-halehame-am-et", "ethiopic-halehame-gez", "ethiopic-halehame-om-et", "ethiopic-halehame-sid-et",
        "ethiopic-halehame-so-et", "ethiopic-halehame-ti-er", "ethiopic-halehame-ti-et", "ethiopic-halehame-tig", "ew-resize", "expanded",
        "extra-condensed", "extra-expanded", "fantasy", "fast", "fill", "fixed", "flat", "forwards", "from", "fuchsia", "geometricPrecision",
        "georgian", "gray", "graytext", "green", "grey", "groove", "gujarati", "gurmukhi", "hand", "hangul", "hangul-consonant", "hebrew", "help",
        "hidden", "hide", "higher", "highlight", "highlighttext", "hiragana", "hiragana-iroha", "horizontal", "hsl", "hsla", "icon", "ignore",
        "inactiveborder", "inactivecaption", "inactivecaptiontext", "infinite", "infobackground", "infotext", "inherit", "initial", "inline",
        "inline-axis", "inline-block", "inline-table", "inset", "inside", "intrinsic", "invert", "italic", "justify", "kannada", "katakana",
        "katakana-iroha", "khmer", "landscape", "lao", "large", "larger", "left", "level", "lighter", "lime", "line-through", "linear", "lines",
        "list-button", "list-item", "listbox", "listitem", "local", "logical", "loud", "lower", "lower-alpha", "lower-greek", "lower-hexadecimal", "lower-latin",
        "lower-norwegian", "lower-roman", "lowercase", "ltr", "malayalam", "maroon", "match", "media-controls-background", "media-current-time-display",
        "media-fullscreen-button", "media-mute-button", "media-play-button", "media-return-to-realtime-button", "media-rewind-button",
        "media-seek-back-button", "media-seek-forward-button", "media-slider", "media-sliderthumb", "media-time-remaining-display",
        "media-volume-slider", "media-volume-slider-container", "media-volume-sliderthumb", "medium", "menu", "menulist", "menulist-button",
        "menulist-text", "menulist-textfield", "menutext", "message-box", "middle", "min-intrinsic", "mix", "mongolian", "monospace", "move", "multiple",
        "myanmar", "n-resize", "narrower", "navy", "ne-resize", "nesw-resize", "no-close-quote", "no-drop", "no-open-quote", "no-repeat", "none",
        "normal", "not-allowed", "nowrap", "ns-resize", "nw-resize", "nwse-resize", "oblique", "octal", "olive", "open-quote", "optimizeLegibility",
        "optimizeSpeed", "orange", "oriya", "oromo", "outset", "outside", "overlay", "overline", "padding", "padding-box", "painted", "paused",
        "persian", "plus-darker", "plus-lighter", "pointer", "portrait", "pre", "pre-line", "pre-wrap", "preserve-3d", "progress", "purple",
        "push-button", "radio", "read-only", "read-write", "read-write-plaintext-only", "red", "relative", "repeat", "repeat-x",
        "repeat-y", "reset", "reverse", "rgb", "rgba", "ridge", "right", "round", "row-resize", "rtl", "run-in", "running", "s-resize", "sans-serif",
        "scroll", "scrollbar", "se-resize", "searchfield", "searchfield-cancel-button", "searchfield-decoration", "searchfield-results-button",
        "searchfield-results-decoration", "semi-condensed", "semi-expanded", "separate", "serif", "show", "sidama", "silver", "single",
        "skip-white-space", "slide", "slider-horizontal", "slider-vertical", "sliderthumb-horizontal", "sliderthumb-vertical", "slow",
        "small", "small-caps", "small-caption", "smaller", "solid", "somali", "source-atop", "source-in", "source-out", "source-over",
        "space", "square", "square-button", "start", "static", "status-bar", "stretch", "stroke", "sub", "subpixel-antialiased", "super",
        "sw-resize", "table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group",
        "table-row", "table-row-group", "teal", "telugu", "text", "text-bottom", "text-top", "textarea", "textfield", "thai", "thick", "thin",
        "threeddarkshadow", "threedface", "threedhighlight", "threedlightshadow", "threedshadow", "tibetan", "tigre", "tigrinya-er", "tigrinya-er-abegede",
        "tigrinya-et", "tigrinya-et-abegede", "to", "top", "transparent", "ultra-condensed", "ultra-expanded", "underline", "up", "upper-alpha", "upper-greek",
        "upper-hexadecimal", "upper-latin", "upper-norwegian", "upper-roman", "uppercase", "urdu", "url", "vertical", "vertical-text", "visible",
        "visibleFill", "visiblePainted", "visibleStroke", "visual", "w-resize", "wait", "wave", "white", "wider", "window", "windowframe", "windowtext",
        "x-large", "x-small", "xor", "xx-large", "xx-small", "yellow", "-wap-marquee", "-webkit-activelink", "-webkit-auto", "-webkit-baseline-middle",
        "-webkit-body", "-webkit-box", "-webkit-center", "-webkit-control", "-webkit-focus-ring-color", "-webkit-grab", "-webkit-grabbing",
        "-webkit-gradient", "-webkit-inline-box", "-webkit-left", "-webkit-link", "-webkit-marquee", "-webkit-mini-control", "-webkit-nowrap", "-webkit-right",
        "-webkit-small-control", "-webkit-text", "-webkit-xxx-large", "-webkit-zoom-in", "-webkit-zoom-out",
    ].keySet();

    this._mediaTypes = ["all", "aural", "braille", "embossed", "handheld", "import", "print", "projection", "screen", "tty", "tv"].keySet();

    this._lexConditions = {
        INITIAL: 0,
        COMMENT: 1,
        DSTRING: 2,
        SSTRING: 3
    };

    this._parseConditions = {
        INITIAL: 0,
        PROPERTY: 1,
        PROPERTY_VALUE: 2,
        AT_RULE: 3
    };

    this.case_INITIAL = 1000;
    this.case_COMMENT = 1002;
    this.case_DSTRING = 1003;
    this.case_SSTRING = 1004;

    this.initialCondition = { lexCondition: this._lexConditions.INITIAL, parseCondition: this._parseConditions.INITIAL }
};

WebInspector.SourceCSSTokenizer.prototype = {
    _stringToken: function(cursor, stringEnds)
    {
        if (this._isPropertyValue())
            this.tokenType = "css-string";
        else
            this.tokenType = null;
        return cursor;
    },

    _isPropertyValue: function()
    {
        return this._condition.parseCondition === this._parseConditions.PROPERTY_VALUE || this._condition.parseCondition === this._parseConditions.AT_RULE;
    },

    nextToken: function(cursor)
    {
        var cursorOnEnter = cursor;
        var gotoCase = 1;
        while (1) {
            switch (gotoCase)
            // Following comment is replaced with generated state machine.
            
        {
            case 1: var yych;
            var yyaccept = 0;
            if (this.getLexCondition() < 2) {
                if (this.getLexCondition() < 1) {
                    { gotoCase = this.case_INITIAL; continue; };
                } else {
                    { gotoCase = this.case_COMMENT; continue; };
                }
            } else {
                if (this.getLexCondition() < 3) {
                    { gotoCase = this.case_DSTRING; continue; };
                } else {
                    { gotoCase = this.case_SSTRING; continue; };
                }
            }
/* *********************************** */
case this.case_COMMENT:

            yych = this._charAt(cursor);
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 4; continue; };
                { gotoCase = 3; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 4; continue; };
                if (yych == '*') { gotoCase = 6; continue; };
                { gotoCase = 3; continue; };
            }
case 2:
            { this.tokenType = "css-comment"; return cursor; }
case 3:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 12; continue; };
case 4:
            ++cursor;
            { this.tokenType = null; return cursor; }
case 6:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '*') { gotoCase = 9; continue; };
            if (yych != '/') { gotoCase = 11; continue; };
case 7:
            ++cursor;
            this.setLexCondition(this._lexConditions.INITIAL);
            { this.tokenType = "css-comment"; return cursor; }
case 9:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '*') { gotoCase = 9; continue; };
            if (yych == '/') { gotoCase = 7; continue; };
case 11:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 12:
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 2; continue; };
                { gotoCase = 11; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 2; continue; };
                if (yych == '*') { gotoCase = 9; continue; };
                { gotoCase = 11; continue; };
            }
/* *********************************** */
case this.case_DSTRING:
            yych = this._charAt(cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 17; continue; };
                if (yych <= '\f') { gotoCase = 16; continue; };
                { gotoCase = 17; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 16; continue; };
                    { gotoCase = 19; continue; };
                } else {
                    if (yych == '\\') { gotoCase = 21; continue; };
                    { gotoCase = 16; continue; };
                }
            }
case 15:
            { return this._stringToken(cursor); }
case 16:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 23; continue; };
case 17:
            ++cursor;
case 18:
            { this.tokenType = null; return cursor; }
case 19:
            ++cursor;
case 20:
            this.setLexCondition(this._lexConditions.INITIAL);
            { return this._stringToken(cursor, true); }
case 21:
            yych = this._charAt(++cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 22; continue; };
                    if (yych <= '&') { gotoCase = 18; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych <= '[') { gotoCase = 18; continue; };
                    } else {
                        if (yych != 'b') { gotoCase = 18; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych >= 'g') { gotoCase = 18; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 22; continue; };
                        if (yych <= 'q') { gotoCase = 18; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych <= 's') { gotoCase = 18; continue; };
                    } else {
                        if (yych != 'v') { gotoCase = 18; continue; };
                    }
                }
            }
case 22:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 23:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 15; continue; };
                if (yych <= '\f') { gotoCase = 22; continue; };
                { gotoCase = 15; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 22; continue; };
                    { gotoCase = 26; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 22; continue; };
                }
            }
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 22; continue; };
                    if (yych >= '\'') { gotoCase = 22; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych >= '\\') { gotoCase = 22; continue; };
                    } else {
                        if (yych == 'b') { gotoCase = 22; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych <= 'f') { gotoCase = 22; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 22; continue; };
                        if (yych >= 'r') { gotoCase = 22; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych >= 't') { gotoCase = 22; continue; };
                    } else {
                        if (yych == 'v') { gotoCase = 22; continue; };
                    }
                }
            }
            cursor = YYMARKER;
            { gotoCase = 15; continue; };
case 26:
            ++cursor;
            yych = this._charAt(cursor);
            { gotoCase = 20; continue; };
/* *********************************** */
case this.case_INITIAL:
            yych = this._charAt(cursor);
            if (yych <= ';') {
                if (yych <= '\'') {
                    if (yych <= '"') {
                        if (yych <= ' ') { gotoCase = 29; continue; };
                        if (yych <= '!') { gotoCase = 31; continue; };
                        { gotoCase = 33; continue; };
                    } else {
                        if (yych == '$') { gotoCase = 31; continue; };
                        if (yych >= '\'') { gotoCase = 34; continue; };
                    }
                } else {
                    if (yych <= '.') {
                        if (yych <= ',') { gotoCase = 29; continue; };
                        if (yych <= '-') { gotoCase = 35; continue; };
                        { gotoCase = 36; continue; };
                    } else {
                        if (yych <= '/') { gotoCase = 37; continue; };
                        if (yych <= '9') { gotoCase = 38; continue; };
                        if (yych <= ':') { gotoCase = 40; continue; };
                        { gotoCase = 42; continue; };
                    }
                }
            } else {
                if (yych <= '^') {
                    if (yych <= '?') {
                        if (yych == '=') { gotoCase = 31; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 29; continue; };
                        if (yych <= ']') { gotoCase = 31; continue; };
                    }
                } else {
                    if (yych <= 'z') {
                        if (yych != '`') { gotoCase = 31; continue; };
                    } else {
                        if (yych <= '{') { gotoCase = 44; continue; };
                        if (yych == '}') { gotoCase = 46; continue; };
                    }
                }
            }
case 29:
            ++cursor;
case 30:
            { this.tokenType = null; return cursor; }
case 31:
            ++cursor;
            yych = this._charAt(cursor);
            { gotoCase = 49; continue; };
case 32:
            {
                    var token = this._line.substring(cursorOnEnter, cursor);
                    if (this._condition.parseCondition === this._parseConditions.INITIAL) {
                        if (token === "@import" || token === "@media") {
                            this.tokenType = "css-at-rule";
                            this._condition.parseCondition = this._parseConditions.AT_RULE;
                        } else if (token.indexOf("@") === 0)
                            this.tokenType = "css-at-rule";
                        else
                            this.tokenType = "css-selector";
                    }
                    else if (this._condition.parseCondition === this._parseConditions.AT_RULE && token in this._mediaTypes)
                        this.tokenType = "css-keyword";
                    else if (this._condition.parseCondition === this._parseConditions.PROPERTY && token in this._propertyKeywords)
                        this.tokenType = "css-property";
                    else if (this._isPropertyValue() && token in this._valueKeywords)
                        this.tokenType = "css-keyword";
                    else if (token === "!important")
                        this.tokenType = "css-important";
                    else
                        this.tokenType = null;
                    return cursor;
                }
case 33:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '-') {
                if (yych <= '!') {
                    if (yych <= '\f') {
                        if (yych == '\n') { gotoCase = 32; continue; };
                        { gotoCase = 124; continue; };
                    } else {
                        if (yych <= '\r') { gotoCase = 32; continue; };
                        if (yych <= ' ') { gotoCase = 124; continue; };
                        { gotoCase = 122; continue; };
                    }
                } else {
                    if (yych <= '$') {
                        if (yych <= '"') { gotoCase = 114; continue; };
                        if (yych <= '#') { gotoCase = 124; continue; };
                        { gotoCase = 122; continue; };
                    } else {
                        if (yych == '\'') { gotoCase = 122; continue; };
                        if (yych <= ',') { gotoCase = 124; continue; };
                        { gotoCase = 122; continue; };
                    }
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '<') {
                        if (yych <= '.') { gotoCase = 124; continue; };
                        if (yych <= '9') { gotoCase = 122; continue; };
                        { gotoCase = 124; continue; };
                    } else {
                        if (yych <= '=') { gotoCase = 122; continue; };
                        if (yych <= '?') { gotoCase = 124; continue; };
                        { gotoCase = 122; continue; };
                    }
                } else {
                    if (yych <= '^') {
                        if (yych <= '\\') { gotoCase = 126; continue; };
                        if (yych <= ']') { gotoCase = 122; continue; };
                        { gotoCase = 124; continue; };
                    } else {
                        if (yych == '`') { gotoCase = 124; continue; };
                        if (yych <= 'z') { gotoCase = 122; continue; };
                        { gotoCase = 124; continue; };
                    }
                }
            }
case 34:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych <= '-') {
                if (yych <= '"') {
                    if (yych <= '\f') {
                        if (yych == '\n') { gotoCase = 32; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych <= '\r') { gotoCase = 32; continue; };
                        if (yych <= ' ') { gotoCase = 116; continue; };
                        { gotoCase = 112; continue; };
                    }
                } else {
                    if (yych <= '&') {
                        if (yych == '$') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych <= '\'') { gotoCase = 114; continue; };
                        if (yych <= ',') { gotoCase = 116; continue; };
                        { gotoCase = 112; continue; };
                    }
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '<') {
                        if (yych <= '.') { gotoCase = 116; continue; };
                        if (yych <= '9') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych <= '=') { gotoCase = 112; continue; };
                        if (yych <= '?') { gotoCase = 116; continue; };
                        { gotoCase = 112; continue; };
                    }
                } else {
                    if (yych <= '^') {
                        if (yych <= '\\') { gotoCase = 118; continue; };
                        if (yych <= ']') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych == '`') { gotoCase = 116; continue; };
                        if (yych <= 'z') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    }
                }
            }
case 35:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '.') { gotoCase = 65; continue; };
            if (yych <= '/') { gotoCase = 49; continue; };
            if (yych <= '9') { gotoCase = 50; continue; };
            { gotoCase = 49; continue; };
case 36:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 30; continue; };
            if (yych <= '9') { gotoCase = 68; continue; };
            { gotoCase = 30; continue; };
case 37:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            if (yych == '*') { gotoCase = 104; continue; };
            { gotoCase = 49; continue; };
case 38:
            yyaccept = 1;
            yych = this._charAt(YYMARKER = ++cursor);
            switch (yych) {
            case '!':
            case '"':
            case '$':
            case '\'':
            case '-':
            case '/':
            case '=':
            case '@':
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
            case 'Z':
            case '[':
            case ']':
            case 'a':
            case 'b':
            case 'f':
            case 'h':
            case 'j':
            case 'l':
            case 'n':
            case 'o':
            case 'q':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':    { gotoCase = 48; continue; };
            case '%':    { gotoCase = 67; continue; };
            case '.':    { gotoCase = 65; continue; };
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':    { gotoCase = 50; continue; };
            case 'H':    { gotoCase = 52; continue; };
            case '_':    { gotoCase = 53; continue; };
            case 'c':    { gotoCase = 54; continue; };
            case 'd':    { gotoCase = 55; continue; };
            case 'e':    { gotoCase = 56; continue; };
            case 'g':    { gotoCase = 57; continue; };
            case 'i':    { gotoCase = 58; continue; };
            case 'k':    { gotoCase = 59; continue; };
            case 'm':    { gotoCase = 60; continue; };
            case 'p':    { gotoCase = 61; continue; };
            case 'r':    { gotoCase = 62; continue; };
            case 's':    { gotoCase = 63; continue; };
            case 't':    { gotoCase = 64; continue; };
            default:    { gotoCase = 39; continue; };
            }
case 39:
            {
                    if (this._isPropertyValue())
                        this.tokenType = "css-number";
                    else
                        this.tokenType = null;
                    return cursor;
                }
case 40:
            ++cursor;
            {
                    this.tokenType = null;
                    if (this._condition.parseCondition === this._parseConditions.PROPERTY)
                        this._condition.parseCondition = this._parseConditions.PROPERTY_VALUE;
                    return cursor;
                }
case 42:
            ++cursor;
            {
                    this.tokenType = null;
                    if (this._condition.parseCondition === this._parseConditions.AT_RULE)
                        this._condition.parseCondition = this._parseConditions.INITIAL;
                    else
                        this._condition.parseCondition = this._parseConditions.PROPERTY;
                    return cursor;
                }
case 44:
            ++cursor;
            {
                    this.tokenType = null;
                    if (this._condition.parseCondition === this._parseConditions.AT_RULE)
                        this._condition.parseCondition = this._parseConditions.INITIAL;
                    else
                        this._condition.parseCondition = this._parseConditions.PROPERTY;
                    return cursor;
                }
case 46:
            ++cursor;
            {
                    this.tokenType = null;
                    this._condition.parseCondition = this._parseConditions.INITIAL;
                    return cursor;
                }
case 48:
            ++cursor;
            yych = this._charAt(cursor);
case 49:
            if (yych <= '9') {
                if (yych <= '&') {
                    if (yych <= '"') {
                        if (yych <= ' ') { gotoCase = 32; continue; };
                        { gotoCase = 48; continue; };
                    } else {
                        if (yych == '$') { gotoCase = 48; continue; };
                        { gotoCase = 32; continue; };
                    }
                } else {
                    if (yych <= ',') {
                        if (yych <= '\'') { gotoCase = 48; continue; };
                        { gotoCase = 32; continue; };
                    } else {
                        if (yych == '.') { gotoCase = 32; continue; };
                        { gotoCase = 48; continue; };
                    }
                }
            } else {
                if (yych <= '\\') {
                    if (yych <= '=') {
                        if (yych <= '<') { gotoCase = 32; continue; };
                        { gotoCase = 48; continue; };
                    } else {
                        if (yych <= '?') { gotoCase = 32; continue; };
                        if (yych <= '[') { gotoCase = 48; continue; };
                        { gotoCase = 32; continue; };
                    }
                } else {
                    if (yych <= '_') {
                        if (yych == '^') { gotoCase = 32; continue; };
                        { gotoCase = 48; continue; };
                    } else {
                        if (yych <= '`') { gotoCase = 32; continue; };
                        if (yych <= 'z') { gotoCase = 48; continue; };
                        { gotoCase = 32; continue; };
                    }
                }
            }
case 50:
            yyaccept = 1;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            switch (yych) {
            case '!':
            case '"':
            case '$':
            case '\'':
            case '-':
            case '/':
            case '=':
            case '@':
            case 'A':
            case 'B':
            case 'C':
            case 'D':
            case 'E':
            case 'F':
            case 'G':
            case 'I':
            case 'J':
            case 'K':
            case 'L':
            case 'M':
            case 'N':
            case 'O':
            case 'P':
            case 'Q':
            case 'R':
            case 'S':
            case 'T':
            case 'U':
            case 'V':
            case 'W':
            case 'X':
            case 'Y':
            case 'Z':
            case '[':
            case ']':
            case 'a':
            case 'b':
            case 'f':
            case 'h':
            case 'j':
            case 'l':
            case 'n':
            case 'o':
            case 'q':
            case 'u':
            case 'v':
            case 'w':
            case 'x':
            case 'y':
            case 'z':    { gotoCase = 48; continue; };
            case '%':    { gotoCase = 67; continue; };
            case '.':    { gotoCase = 65; continue; };
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':    { gotoCase = 50; continue; };
            case 'H':    { gotoCase = 52; continue; };
            case '_':    { gotoCase = 53; continue; };
            case 'c':    { gotoCase = 54; continue; };
            case 'd':    { gotoCase = 55; continue; };
            case 'e':    { gotoCase = 56; continue; };
            case 'g':    { gotoCase = 57; continue; };
            case 'i':    { gotoCase = 58; continue; };
            case 'k':    { gotoCase = 59; continue; };
            case 'm':    { gotoCase = 60; continue; };
            case 'p':    { gotoCase = 61; continue; };
            case 'r':    { gotoCase = 62; continue; };
            case 's':    { gotoCase = 63; continue; };
            case 't':    { gotoCase = 64; continue; };
            default:    { gotoCase = 39; continue; };
            }
case 52:
            yych = this._charAt(++cursor);
            if (yych == 'z') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 53:
            yych = this._charAt(++cursor);
            if (yych == '_') { gotoCase = 101; continue; };
            { gotoCase = 49; continue; };
case 54:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 55:
            yych = this._charAt(++cursor);
            if (yych == 'e') { gotoCase = 100; continue; };
            { gotoCase = 49; continue; };
case 56:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 63; continue; };
            if (yych == 'x') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 57:
            yych = this._charAt(++cursor);
            if (yych == 'r') { gotoCase = 98; continue; };
            { gotoCase = 49; continue; };
case 58:
            yych = this._charAt(++cursor);
            if (yych == 'n') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 59:
            yych = this._charAt(++cursor);
            if (yych == 'H') { gotoCase = 97; continue; };
            { gotoCase = 49; continue; };
case 60:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 63; continue; };
            if (yych == 's') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 61:
            yych = this._charAt(++cursor);
            if (yych <= 's') {
                if (yych == 'c') { gotoCase = 63; continue; };
                { gotoCase = 49; continue; };
            } else {
                if (yych <= 't') { gotoCase = 63; continue; };
                if (yych == 'x') { gotoCase = 63; continue; };
                { gotoCase = 49; continue; };
            }
case 62:
            yych = this._charAt(++cursor);
            if (yych == 'a') { gotoCase = 95; continue; };
            if (yych == 'e') { gotoCase = 96; continue; };
            { gotoCase = 49; continue; };
case 63:
            yych = this._charAt(++cursor);
            if (yych <= '9') {
                if (yych <= '&') {
                    if (yych <= '"') {
                        if (yych <= ' ') { gotoCase = 39; continue; };
                        { gotoCase = 48; continue; };
                    } else {
                        if (yych == '$') { gotoCase = 48; continue; };
                        { gotoCase = 39; continue; };
                    }
                } else {
                    if (yych <= ',') {
                        if (yych <= '\'') { gotoCase = 48; continue; };
                        { gotoCase = 39; continue; };
                    } else {
                        if (yych == '.') { gotoCase = 39; continue; };
                        { gotoCase = 48; continue; };
                    }
                }
            } else {
                if (yych <= '\\') {
                    if (yych <= '=') {
                        if (yych <= '<') { gotoCase = 39; continue; };
                        { gotoCase = 48; continue; };
                    } else {
                        if (yych <= '?') { gotoCase = 39; continue; };
                        if (yych <= '[') { gotoCase = 48; continue; };
                        { gotoCase = 39; continue; };
                    }
                } else {
                    if (yych <= '_') {
                        if (yych == '^') { gotoCase = 39; continue; };
                        { gotoCase = 48; continue; };
                    } else {
                        if (yych <= '`') { gotoCase = 39; continue; };
                        if (yych <= 'z') { gotoCase = 48; continue; };
                        { gotoCase = 39; continue; };
                    }
                }
            }
case 64:
            yych = this._charAt(++cursor);
            if (yych == 'u') { gotoCase = 93; continue; };
            { gotoCase = 49; continue; };
case 65:
            yych = this._charAt(++cursor);
            if (yych <= '/') { gotoCase = 66; continue; };
            if (yych <= '9') { gotoCase = 68; continue; };
case 66:
            cursor = YYMARKER;
            if (yyaccept <= 0) {
                { gotoCase = 32; continue; };
            } else {
                { gotoCase = 39; continue; };
            }
case 67:
            yych = this._charAt(++cursor);
            { gotoCase = 39; continue; };
case 68:
            yyaccept = 1;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'f') {
                if (yych <= 'H') {
                    if (yych <= '/') {
                        if (yych == '%') { gotoCase = 67; continue; };
                        { gotoCase = 39; continue; };
                    } else {
                        if (yych <= '9') { gotoCase = 68; continue; };
                        if (yych <= 'G') { gotoCase = 39; continue; };
                        { gotoCase = 80; continue; };
                    }
                } else {
                    if (yych <= 'b') {
                        if (yych == '_') { gotoCase = 72; continue; };
                        { gotoCase = 39; continue; };
                    } else {
                        if (yych <= 'c') { gotoCase = 74; continue; };
                        if (yych <= 'd') { gotoCase = 77; continue; };
                        if (yych >= 'f') { gotoCase = 39; continue; };
                    }
                }
            } else {
                if (yych <= 'm') {
                    if (yych <= 'i') {
                        if (yych <= 'g') { gotoCase = 78; continue; };
                        if (yych <= 'h') { gotoCase = 39; continue; };
                        { gotoCase = 76; continue; };
                    } else {
                        if (yych == 'k') { gotoCase = 81; continue; };
                        if (yych <= 'l') { gotoCase = 39; continue; };
                        { gotoCase = 75; continue; };
                    }
                } else {
                    if (yych <= 'q') {
                        if (yych == 'p') { gotoCase = 73; continue; };
                        { gotoCase = 39; continue; };
                    } else {
                        if (yych <= 'r') { gotoCase = 71; continue; };
                        if (yych <= 's') { gotoCase = 67; continue; };
                        if (yych <= 't') { gotoCase = 79; continue; };
                        { gotoCase = 39; continue; };
                    }
                }
            }
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 67; continue; };
            if (yych == 'x') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 71:
            yych = this._charAt(++cursor);
            if (yych == 'a') { gotoCase = 91; continue; };
            if (yych == 'e') { gotoCase = 92; continue; };
            { gotoCase = 66; continue; };
case 72:
            yych = this._charAt(++cursor);
            if (yych == '_') { gotoCase = 88; continue; };
            { gotoCase = 66; continue; };
case 73:
            yych = this._charAt(++cursor);
            if (yych <= 's') {
                if (yych == 'c') { gotoCase = 67; continue; };
                { gotoCase = 66; continue; };
            } else {
                if (yych <= 't') { gotoCase = 67; continue; };
                if (yych == 'x') { gotoCase = 67; continue; };
                { gotoCase = 66; continue; };
            }
case 74:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 75:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 67; continue; };
            if (yych == 's') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 76:
            yych = this._charAt(++cursor);
            if (yych == 'n') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 77:
            yych = this._charAt(++cursor);
            if (yych == 'e') { gotoCase = 87; continue; };
            { gotoCase = 66; continue; };
case 78:
            yych = this._charAt(++cursor);
            if (yych == 'r') { gotoCase = 85; continue; };
            { gotoCase = 66; continue; };
case 79:
            yych = this._charAt(++cursor);
            if (yych == 'u') { gotoCase = 83; continue; };
            { gotoCase = 66; continue; };
case 80:
            yych = this._charAt(++cursor);
            if (yych == 'z') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 81:
            yych = this._charAt(++cursor);
            if (yych != 'H') { gotoCase = 66; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'z') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 83:
            yych = this._charAt(++cursor);
            if (yych != 'r') { gotoCase = 66; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'n') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 85:
            yych = this._charAt(++cursor);
            if (yych != 'a') { gotoCase = 66; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'd') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 87:
            yych = this._charAt(++cursor);
            if (yych == 'g') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 88:
            yych = this._charAt(++cursor);
            if (yych != 'q') { gotoCase = 66; continue; };
            yych = this._charAt(++cursor);
            if (yych != 'e') { gotoCase = 66; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 91:
            yych = this._charAt(++cursor);
            if (yych == 'd') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 92:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 67; continue; };
            { gotoCase = 66; continue; };
case 93:
            yych = this._charAt(++cursor);
            if (yych != 'r') { gotoCase = 49; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'n') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 95:
            yych = this._charAt(++cursor);
            if (yych == 'd') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 96:
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 97:
            yych = this._charAt(++cursor);
            if (yych == 'z') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 98:
            yych = this._charAt(++cursor);
            if (yych != 'a') { gotoCase = 49; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'd') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 100:
            yych = this._charAt(++cursor);
            if (yych == 'g') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 101:
            yych = this._charAt(++cursor);
            if (yych != 'q') { gotoCase = 49; continue; };
            yych = this._charAt(++cursor);
            if (yych != 'e') { gotoCase = 49; continue; };
            yych = this._charAt(++cursor);
            if (yych == 'm') { gotoCase = 63; continue; };
            { gotoCase = 49; continue; };
case 104:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '\f') {
                if (yych == '\n') { gotoCase = 108; continue; };
                { gotoCase = 104; continue; };
            } else {
                if (yych <= '\r') { gotoCase = 108; continue; };
                if (yych != '*') { gotoCase = 104; continue; };
            }
case 106:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych == '*') { gotoCase = 106; continue; };
            if (yych == '/') { gotoCase = 110; continue; };
            { gotoCase = 104; continue; };
case 108:
            ++cursor;
            this.setLexCondition(this._lexConditions.COMMENT);
            { this.tokenType = "css-comment"; return cursor; }
case 110:
            ++cursor;
            { this.tokenType = "css-comment"; return cursor; }
case 112:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '-') {
                if (yych <= '"') {
                    if (yych <= '\f') {
                        if (yych == '\n') { gotoCase = 32; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych <= '\r') { gotoCase = 32; continue; };
                        if (yych <= ' ') { gotoCase = 116; continue; };
                        { gotoCase = 112; continue; };
                    }
                } else {
                    if (yych <= '&') {
                        if (yych == '$') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych <= '\'') { gotoCase = 114; continue; };
                        if (yych <= ',') { gotoCase = 116; continue; };
                        { gotoCase = 112; continue; };
                    }
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '<') {
                        if (yych <= '.') { gotoCase = 116; continue; };
                        if (yych <= '9') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych <= '=') { gotoCase = 112; continue; };
                        if (yych <= '?') { gotoCase = 116; continue; };
                        { gotoCase = 112; continue; };
                    }
                } else {
                    if (yych <= '^') {
                        if (yych <= '\\') { gotoCase = 118; continue; };
                        if (yych <= ']') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych == '`') { gotoCase = 116; continue; };
                        if (yych <= 'z') { gotoCase = 112; continue; };
                        { gotoCase = 116; continue; };
                    }
                }
            }
case 114:
            ++cursor;
            if ((yych = this._charAt(cursor)) <= '9') {
                if (yych <= '&') {
                    if (yych <= '"') {
                        if (yych >= '!') { gotoCase = 48; continue; };
                    } else {
                        if (yych == '$') { gotoCase = 48; continue; };
                    }
                } else {
                    if (yych <= ',') {
                        if (yych <= '\'') { gotoCase = 48; continue; };
                    } else {
                        if (yych != '.') { gotoCase = 48; continue; };
                    }
                }
            } else {
                if (yych <= '\\') {
                    if (yych <= '=') {
                        if (yych >= '=') { gotoCase = 48; continue; };
                    } else {
                        if (yych <= '?') { gotoCase = 115; continue; };
                        if (yych <= '[') { gotoCase = 48; continue; };
                    }
                } else {
                    if (yych <= '_') {
                        if (yych != '^') { gotoCase = 48; continue; };
                    } else {
                        if (yych <= '`') { gotoCase = 115; continue; };
                        if (yych <= 'z') { gotoCase = 48; continue; };
                    }
                }
            }
case 115:
            { return this._stringToken(cursor, true); }
case 116:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 66; continue; };
                if (yych <= '\f') { gotoCase = 116; continue; };
                { gotoCase = 66; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 116; continue; };
                    { gotoCase = 121; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 116; continue; };
                }
            }
case 118:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'a') {
                if (yych <= '!') {
                    if (yych <= '\n') {
                        if (yych <= '\t') { gotoCase = 66; continue; };
                    } else {
                        if (yych != '\r') { gotoCase = 66; continue; };
                    }
                } else {
                    if (yych <= '\'') {
                        if (yych <= '"') { gotoCase = 116; continue; };
                        if (yych <= '&') { gotoCase = 66; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 116; continue; };
                        { gotoCase = 66; continue; };
                    }
                }
            } else {
                if (yych <= 'q') {
                    if (yych <= 'f') {
                        if (yych <= 'b') { gotoCase = 116; continue; };
                        if (yych <= 'e') { gotoCase = 66; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych == 'n') { gotoCase = 116; continue; };
                        { gotoCase = 66; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych == 's') { gotoCase = 66; continue; };
                        { gotoCase = 116; continue; };
                    } else {
                        if (yych == 'v') { gotoCase = 116; continue; };
                        { gotoCase = 66; continue; };
                    }
                }
            }
            ++cursor;
            this.setLexCondition(this._lexConditions.SSTRING);
            { return this._stringToken(cursor); }
case 121:
            yych = this._charAt(++cursor);
            { gotoCase = 115; continue; };
case 122:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '-') {
                if (yych <= '!') {
                    if (yych <= '\f') {
                        if (yych == '\n') { gotoCase = 32; continue; };
                    } else {
                        if (yych <= '\r') { gotoCase = 32; continue; };
                        if (yych >= '!') { gotoCase = 122; continue; };
                    }
                } else {
                    if (yych <= '$') {
                        if (yych <= '"') { gotoCase = 114; continue; };
                        if (yych >= '$') { gotoCase = 122; continue; };
                    } else {
                        if (yych == '\'') { gotoCase = 122; continue; };
                        if (yych >= '-') { gotoCase = 122; continue; };
                    }
                }
            } else {
                if (yych <= '[') {
                    if (yych <= '<') {
                        if (yych <= '.') { gotoCase = 124; continue; };
                        if (yych <= '9') { gotoCase = 122; continue; };
                    } else {
                        if (yych <= '=') { gotoCase = 122; continue; };
                        if (yych >= '@') { gotoCase = 122; continue; };
                    }
                } else {
                    if (yych <= '^') {
                        if (yych <= '\\') { gotoCase = 126; continue; };
                        if (yych <= ']') { gotoCase = 122; continue; };
                    } else {
                        if (yych == '`') { gotoCase = 124; continue; };
                        if (yych <= 'z') { gotoCase = 122; continue; };
                    }
                }
            }
case 124:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 66; continue; };
                if (yych <= '\f') { gotoCase = 124; continue; };
                { gotoCase = 66; continue; };
            } else {
                if (yych <= '"') {
                    if (yych <= '!') { gotoCase = 124; continue; };
                    { gotoCase = 121; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 124; continue; };
                }
            }
case 126:
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'a') {
                if (yych <= '!') {
                    if (yych <= '\n') {
                        if (yych <= '\t') { gotoCase = 66; continue; };
                    } else {
                        if (yych != '\r') { gotoCase = 66; continue; };
                    }
                } else {
                    if (yych <= '\'') {
                        if (yych <= '"') { gotoCase = 124; continue; };
                        if (yych <= '&') { gotoCase = 66; continue; };
                        { gotoCase = 124; continue; };
                    } else {
                        if (yych == '\\') { gotoCase = 124; continue; };
                        { gotoCase = 66; continue; };
                    }
                }
            } else {
                if (yych <= 'q') {
                    if (yych <= 'f') {
                        if (yych <= 'b') { gotoCase = 124; continue; };
                        if (yych <= 'e') { gotoCase = 66; continue; };
                        { gotoCase = 124; continue; };
                    } else {
                        if (yych == 'n') { gotoCase = 124; continue; };
                        { gotoCase = 66; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych == 's') { gotoCase = 66; continue; };
                        { gotoCase = 124; continue; };
                    } else {
                        if (yych == 'v') { gotoCase = 124; continue; };
                        { gotoCase = 66; continue; };
                    }
                }
            }
            ++cursor;
            this.setLexCondition(this._lexConditions.DSTRING);
            { return this._stringToken(cursor); }
/* *********************************** */
case this.case_SSTRING:
            yych = this._charAt(cursor);
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 133; continue; };
                if (yych <= '\f') { gotoCase = 132; continue; };
                { gotoCase = 133; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 132; continue; };
                    { gotoCase = 135; continue; };
                } else {
                    if (yych == '\\') { gotoCase = 137; continue; };
                    { gotoCase = 132; continue; };
                }
            }
case 131:
            { return this._stringToken(cursor); }
case 132:
            yyaccept = 0;
            yych = this._charAt(YYMARKER = ++cursor);
            { gotoCase = 139; continue; };
case 133:
            ++cursor;
case 134:
            { this.tokenType = null; return cursor; }
case 135:
            ++cursor;
case 136:
            this.setLexCondition(this._lexConditions.INITIAL);
            { return this._stringToken(cursor, true); }
case 137:
            yych = this._charAt(++cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 138; continue; };
                    if (yych <= '&') { gotoCase = 134; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych <= '[') { gotoCase = 134; continue; };
                    } else {
                        if (yych != 'b') { gotoCase = 134; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych >= 'g') { gotoCase = 134; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 138; continue; };
                        if (yych <= 'q') { gotoCase = 134; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych <= 's') { gotoCase = 134; continue; };
                    } else {
                        if (yych != 'v') { gotoCase = 134; continue; };
                    }
                }
            }
case 138:
            yyaccept = 0;
            YYMARKER = ++cursor;
            yych = this._charAt(cursor);
case 139:
            if (yych <= '\r') {
                if (yych == '\n') { gotoCase = 131; continue; };
                if (yych <= '\f') { gotoCase = 138; continue; };
                { gotoCase = 131; continue; };
            } else {
                if (yych <= '\'') {
                    if (yych <= '&') { gotoCase = 138; continue; };
                    { gotoCase = 142; continue; };
                } else {
                    if (yych != '\\') { gotoCase = 138; continue; };
                }
            }
            ++cursor;
            yych = this._charAt(cursor);
            if (yych <= 'e') {
                if (yych <= '\'') {
                    if (yych == '"') { gotoCase = 138; continue; };
                    if (yych >= '\'') { gotoCase = 138; continue; };
                } else {
                    if (yych <= '\\') {
                        if (yych >= '\\') { gotoCase = 138; continue; };
                    } else {
                        if (yych == 'b') { gotoCase = 138; continue; };
                    }
                }
            } else {
                if (yych <= 'r') {
                    if (yych <= 'm') {
                        if (yych <= 'f') { gotoCase = 138; continue; };
                    } else {
                        if (yych <= 'n') { gotoCase = 138; continue; };
                        if (yych >= 'r') { gotoCase = 138; continue; };
                    }
                } else {
                    if (yych <= 't') {
                        if (yych >= 't') { gotoCase = 138; continue; };
                    } else {
                        if (yych == 'v') { gotoCase = 138; continue; };
                    }
                }
            }
            cursor = YYMARKER;
            { gotoCase = 131; continue; };
case 142:
            ++cursor;
            yych = this._charAt(cursor);
            { gotoCase = 136; continue; };
        }

        }
    }
}

WebInspector.SourceCSSTokenizer.prototype.__proto__ = WebInspector.SourceTokenizer.prototype;
