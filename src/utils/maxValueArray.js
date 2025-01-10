export default function maxValueArray(payments) {
    if (!Array.isArray(payments) || payments.length === 0) {
        throw new Error("O array de pagamentos é inválido ou está vazio.");
    }

    return payments.reduce((max, atual) =>
        atual.value > max.value ? atual : max
    );
}

