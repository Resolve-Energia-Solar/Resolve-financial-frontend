import { addBusinessDays, parseISO, format } from 'date-fns';

export function calculateDueDate({ now, amount, category, department, requestTime }) {
    // Mapeia os prazos conforme o valor
    const dueDatesArr = [
        { limit: 3000, days: 2 },
        { limit: 6000, days: 3 },
        { limit: 10000, days: 4 },
        { limit: 20000, days: 10 },
    ];

    // Exceção 1: Categorias com prazo fixo de 2 dias úteis
    const twoDayCategories = new Set([
        "2.05.87",
        "2.05.84",
        "2.05.83",
        "2.05.90",
        "2.05.91",
        "2.01.93",
    ]);
    if (twoDayCategories.has(category)) {
        return addBusinessDays(now, 2);
    }

    // Exceção 2: Setores ou categorias especiais com processamento imediato
    const specialDepartments = new Set([7, 18]);
    const specialCategories = new Set(["2.02.94", "2.03.67"]);
    const cutoffTime = parseISO("15:00");
    if (specialDepartments.has(department) || specialCategories.has(category)) {
        const requestTimeParsed = typeof requestTime === "string" ? parseISO(requestTime) : requestTime;
        return requestTimeParsed < cutoffTime ? now : addBusinessDays(now, 1);
    }

    // Exceção 3: Setores que permitem processamento no sábado (mas nunca no domingo)
    const saturdayDepartments = new Set([3, 20]);
    if (saturdayDepartments.has(department)) {
        let dueDate = addBusinessDays(now, 1);
        if (dueDate.getDay() === 0) { // Se cair no domingo, adianta para segunda-feira
            dueDate = addBusinessDays(dueDate, 1);
        }
        return dueDate;
    }

    // Regra geral: aplica o prazo conforme o valor
    for (const { limit, days } of dueDatesArr) {
        if (amount <= limit) {
            return addBusinessDays(now, days);
        }
    }

    // Para valores acima de 20.000
    return addBusinessDays(now, 15);
}

export async function handleDueDateCalculation({ amount, category, department }) {
    if (!amount || !category) {
        throw new Error("Os parâmetros 'amount' e 'category' são obrigatórios.");
    }

    try {
        // Limpa o valor, removendo pontos e trocando vírgula por ponto
        const cleanedAmount = typeof amount === "string"
            ? parseFloat(amount.replace(".", "").replace(",", "."))
            : amount;
        const now = new Date();
        const requestTime = format(now, "HH:mm");

        console.log(`Calculando data de vencimento para amount: ${cleanedAmount}, category: ${category}, request_time: ${requestTime}`);

        const dueDate = calculateDueDate({
            now,
            amount: cleanedAmount,
            category,
            department,
            requestTime,
        });

        console.log(`Data de vencimento calculada: ${format(dueDate, "yyyy-MM-dd")}`);
        return format(dueDate, "yyyy-MM-dd");
    } catch (error) {
        console.error(`Erro ao calcular data de vencimento: ${error}`);
        throw new Error(`Erro ao calcular data de vencimento: ${error.message}`);
    }
}
