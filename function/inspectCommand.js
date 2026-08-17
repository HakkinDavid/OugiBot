// inspectCommand.js
module.exports = async function(msg) {
    if (msg.author.id !== davidUserID) return;

    const content = msg.content.trim();
    const parts = content.split(" ");
    if (parts.length < 3) {
        msg.channel.send(await ougi.text({ msg, stringID: "inspect_specifyPath" }));
        return;
    }

    const expression = parts.slice(2).join(" ").trim();

    function parseBracketKey(raw, currentTarget) {
        let t = String(raw).trim();
        if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
            t = t.slice(1, -1);
        }
        if (Array.isArray(currentTarget) && /^\d+$/.test(t)) {
            const idx = Number(t);
            return Number.isSafeInteger(idx) ? idx : t;
        }
        return t;
    }

    async function resolveExpression(expr, stopBeforeLast = false) {
        const rootMatch = expr.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (!rootMatch) return { error: await ougi.text({ msg, stringID: "inspect_noRootVar" }) };

        let target = global[rootMatch[1]];
        if (target === undefined) return { error: await ougi.text({ msg, stringID: "inspect_varNotFound", values: { name: rootMatch[1] } }) };

        let remainder = expr.slice(rootMatch[1].length);
        const regex = /(\.([a-zA-Z_$][a-zA-Z0-9_$]*)|\[([^\]]+)\])/g;
        let m;
        let keys = [];
        while ((m = regex.exec(remainder)) !== null) {
            let key;
            if (m[2] !== undefined) {
                key = m[2];
            } else {
                key = parseBracketKey(m[3], target);
            }
            if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
                return { error: "Access to prototype properties is blocked." };
            }
            keys.push(key);
        }

        if (stopBeforeLast && keys.length === 0) {
            return { error: await ougi.text({ msg, stringID: "inspect_noPropertyToAssign" }) };
        }

        let limit = stopBeforeLast ? keys.length - 1 : keys.length;
        for (let i = 0; i < limit; i++) {
            let key = keys[i];
            if (target && typeof target === 'object' && key in target) {
                target = target[key];
            } else {
                return { error: await ougi.text({ msg, stringID: "inspect_propNotFound", values: { prop: key } }) };
            }
        }

        if (stopBeforeLast) {
            return { target: target, lastKey: keys[keys.length - 1] };
        } else {
            return { value: target };
        }
    }

    // Check if expression contains '=' for assignment
    const assignIndex = expression.indexOf('=');
    if (assignIndex !== -1) {
        const leftExpr = expression.slice(0, assignIndex).trim();
        const rightExpr = expression.slice(assignIndex + 1).trim();

        const resolved = await resolveExpression(leftExpr, true);
        if (resolved.error) {
            msg.channel.send(resolved.error);
            return;
        }

        let parsedValue;
        try {
            parsedValue = JSON.parse(rightExpr);
        } catch (e) {
            if (rightExpr === "true") {
                parsedValue = true;
            } else if (rightExpr === "false") {
                parsedValue = false;
            } else if (rightExpr === "null") {
                parsedValue = null;
            } else if (!isNaN(rightExpr)) {
                parsedValue = Number(rightExpr);
            } else if ((rightExpr.startsWith("'") && rightExpr.endsWith("'")) || (rightExpr.startsWith('"') && rightExpr.endsWith('"'))) {
                parsedValue = rightExpr.slice(1, -1);
            } else {
                parsedValue = rightExpr;
            }
        }

        try {
            resolved.target[resolved.lastKey] = parsedValue;
            msg.channel.send(await ougi.text({
                msg,
                stringID: "inspect_updatedProp",
                values: {
                    prop: leftExpr
                }
            }));
        } catch (err) {
            msg.channel.send(await ougi.text({
                msg,
                stringID: "inspect_assignError",
                values: {
                    err: err.message
                }
            }));
        }

        return;
    }

    const result = await resolveExpression(expression);

    if (result.error) {
        msg.channel.send(result.error);
        return;
    }

    let output;
    if (result.value && typeof result.value === 'object') {
        output = {};
        for (let key in result.value) {
            if (Object.prototype.hasOwnProperty.call(result.value, key)) {
                const val = result.value[key];
                output[key] = (typeof val === 'object') ? (Array.isArray(val) ? '[Array]' : '[Object]') : val;
            }
        }
    } else {
        output = result.value;
    }

    const jsonString = JSON.stringify(output, null, 4) || String(output);
    const chunkSize = 1980;
    for (let i = 0; i < jsonString.length; i += chunkSize) {
        const chunk = jsonString.slice(i, i + chunkSize);
        await msg.channel.send('```json\n' + chunk + '\n```').catch(console.error);
    }
};