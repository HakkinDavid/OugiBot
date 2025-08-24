// inspectCommand.js
module.exports = async function(msg) {
    const content = msg.content.trim();
    const parts = content.split(" ");
    if (parts.length < 3) {
        msg.channel.send("Debes especificar la ruta de acceso al objeto.");
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

    function resolveExpression(expr) {
        // Separar rootVar de los accesadores
        const rootMatch = expr.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)/);
        if (!rootMatch) return { error: "No se detectó variable raíz válida." };

        let target = global[rootMatch[1]]; // Acceso directo al contexto global
        if (target === undefined) return { error: `Variable \`${rootMatch[1]}\` no encontrada.` };

        let remainder = expr.slice(rootMatch[1].length);
        const regex = /(\.([a-zA-Z_$][a-zA-Z0-9_$]*)|\[([^\]]+)\])/g;
        let m;
        while ((m = regex.exec(remainder)) !== null) {
            let key;
            if (m[2] !== undefined) {
                const prop = m[2];
                key = /^\d+$/.test(prop) ? prop : prop;
            } else {
                key = parseBracketKey(m[3], target);
            }
            if (target && typeof target === 'object' && key in target) {
                target = target[key];
            } else {
                return { error: `Propiedad \`${key}\` no encontrada.` };
            }
        }

        return { value: target };
    }

    const result = resolveExpression(expression);

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