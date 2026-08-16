// inspectCommand.js
module.exports = async function(msg) {
    const content = msg.content.trim();
    const parts = content.split(" ");
    if (parts.length < 3) {
        msg.channel.send(await ougi.text(msg, "inspect_specifyPath"));
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
        // Separar rootVar de los accesadores
        const rootMatch = expr.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (!rootMatch) return { error: await ougi.text(msg, "inspect_noRootVar") };

        let target = global[rootMatch[1]]; // Acceso directo al contexto global
        if (target === undefined) return { error: (await ougi.text(msg, "inspect_varNotFound")).replace(/{name}/g, rootMatch[1]) };

        let remainder = expr.slice(rootMatch[1].length);
        const regex = /(\.([a-zA-Z_$][a-zA-Z0-9_$]*)|\[([^\]]+)\])/g;
        let m;
        let keys = [];
        while ((m = regex.exec(remainder)) !== null) {
            let key;
            if (m[2] !== undefined) {
                const prop = m[2];
                key = /^\d+$/.test(prop) ? prop : prop;
            } else {
                key = parseBracketKey(m[3], target);
            }
            keys.push(key);
        }

        if (stopBeforeLast && keys.length === 0) {
            return { error: await ougi.text(msg, "inspect_noPropertyToAssign") };
        }

        let limit = stopBeforeLast ? keys.length - 1 : keys.length;
        for (let i = 0; i < limit; i++) {
            let key = keys[i];
            if (target && typeof target === 'object' && key in target) {
                target = target[key];
            } else {
                return { error: (await ougi.text(msg, "inspect_propNotFound")).replace(/{prop}/g, key) };
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

        // Resolve left expression to get target object and last key
        const resolved = await resolveExpression(leftExpr, true);
        if (resolved.error) {
            msg.channel.send(resolved.error);
            return;
        }

        let parsedValue;
        try {
            // Try to parse rightExpr as JSON
            parsedValue = JSON.parse(rightExpr);
        } catch (e) {
            // If JSON.parse fails, try to parse as primitive manually
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
                // If all fails, treat as string
                parsedValue = rightExpr;
            }
        }

        try {
            resolved.target[resolved.lastKey] = parsedValue;
            const updatedSuccessTemplate = await ougi.text(msg, "inspect_updatedProp");
            msg.channel.send(updatedSuccessTemplate.replace(/{prop}/g, leftExpr));
        } catch (err) {
            const assignErrTemplate = await ougi.text(msg, "inspect_assignError");
            msg.channel.send(assignErrTemplate.replace(/{err}/g, err.message));
        }

        return;
    }

    // If no assignment, behave as before (inspection)
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

    const jsonString = JSON.stringify(output, null, 4);
    const wrapperOverhead = 15; // length of ```json\n + \n``` is 9
    const chunkSize = 2000 - wrapperOverhead;
    for (let i = 0; i < jsonString.length; i += chunkSize) {
        const chunk = jsonString.slice(i, i + chunkSize);
        setTimeout(() => {
            msg.channel.send('```json\n' + chunk + '\n```');
        }, i / chunkSize * 500); // 500ms delay between each message
    }
};