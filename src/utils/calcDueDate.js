import { addBusinessDays, parseISO, format } from 'date-fns';

export function calculateDueDate({
    now,
    amount,
    category,
    department,
    requestTime,
}) {
    // Regras para dias úteis normais
    const dueDates = {
        3000: 2,
        6000: 3,
        10000: 4,
        20000: 10,
    };

    // Exceção 1: Categorias que podem solicitar para dois dias úteis
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

    // Exceção 2: Setores e categorias especiais que podem ser processados no mesmo dia ou no próximo dia
    const specialDepartments = new Set([7, 18]);
    const specialCategories = new Set(["2.02.94", "2.03.67"]);
    const cutoffTime = parseISO("15:00");

    if (specialDepartments.has(department) || specialCategories.has(category)) {
        const requestTimeParsed = typeof requestTime === "string" ? parseISO(requestTime) : requestTime;
        if (requestTimeParsed < cutoffTime) {
            return now; // Hoje, se for antes das 15h
        }
        return addBusinessDays(now, 1); // Próximo dia útil, se for após às 15h
    }

    // Exceção 3: Setores que podem ser processados no sábado, mas nunca no domingo
    const saturdayDepartments = new Set([3, 20]);
    if (saturdayDepartments.has(department)) {
        let dueDate = addBusinessDays(now, 1);
        if (dueDate.getDay() === 0) {
            dueDate = addBusinessDays(dueDate, 1); // Move para segunda-feira
        }
        return dueDate;
    }

    // Regra geral para calcular dias úteis com base no valor
    for (const [limit, days] of Object.entries(dueDates)) {
        if (amount <= limit) {
            return addBusinessDays(now, days);
        }
    }

    // Caso o valor seja maior que 20.000, aplica 15 dias úteis
    return addBusinessDays(now, 15);
}

export async function handleDueDateCalculation({
    amount,
    category,
    department,
}) {
    if (!amount || !category) {
        throw new Error("Os parâmetros 'amount' e 'category' são obrigatórios.");
    }

    try {
        // Remove pontos e substitui vírgula por ponto no valor do amount
        const cleanedAmount = parseFloat(amount.replace(".", "").replace(",", "."));
        const now = new Date();
        const requestTime = format(now, "HH:mm");

        console.debug(`Calculando data de vencimento para amount: ${cleanedAmount}, category: ${category}, request_time: ${requestTime}`);

        // Calcula a data mínima
        const dueDate = calculateDueDate({
            now,
            amount: cleanedAmount,
            category,
            department,
            requestTime,
        });

        console.debug(`Data de vencimento calculada: ${format(dueDate, "yyyy-MM-dd")}`);

        return format(dueDate, "yyyy-MM-dd");
    } catch (error) {
        console.error(`Erro ao calcular data de vencimento: ${error}`);
        throw new Error(`Erro ao calcular data de vencimento: ${error.message}`);
    }
}
