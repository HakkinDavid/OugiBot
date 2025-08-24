// inspectCommand.js
module.exports = async function(msg) {
    const content = msg.content.trim();
    const parts = content.split(" ");
    if (parts.length < 3) {
        msg.channel.send("Debes especificar la ruta de acceso al objeto.");
        return;
    }

    const expression = parts.slice(2).join(" ").trim();

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
            const prop = m[2] || m[3];
            let key = prop;
            if (!isNaN(key)) key = parseInt(key, 10);
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

    msg.channel.send('```json\n' + JSON.stringify(output, null, 4) + '\n```');
};